"""Investigation route orchestration for TrustLayer.

Connects the forensic pipeline:
API request (with optional video upload)
    -> PreprocessingService (video reference)
    -> Mock Evidence (ML analysis hook in later step)
    -> ConsistencyAnalyzer
    -> ConflictDetector
    -> TrustEngine
    -> Gemini Explanation
    -> InvestigationResult
"""

import math
import os
import tempfile
import uuid
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import BaseModel

try:
    from backend.analysis.evidence import (
        Assessment,
        Evidence,
        InvestigationResult,
        TimelineItem,
        TimeRange,
        Verdict,
    )
    from backend.analysis.consistency import ConsistencyAnalyzer
    from backend.analysis.conflict import ConflictDetector
    from backend.fusion.trust_engine import TrustEngine
    from backend.explanation.gemini import GeminiExplanationService
    from backend.preprocessing.video import PreprocessingService
    from backend.models.video_detector import VideoDetector
    from backend.analysis.audio.pipeline import run_audio_pipeline
except ImportError:
    from analysis.evidence import (
        Assessment,
        Evidence,
        InvestigationResult,
        TimelineItem,
        TimeRange,
        Verdict,
    )
    from analysis.consistency import ConsistencyAnalyzer
    from analysis.conflict import ConflictDetector
    from fusion.trust_engine import TrustEngine
    from explanation.gemini import GeminiExplanationService
    from preprocessing.video import PreprocessingService
    from models.video_detector import VideoDetector
    from analysis.audio.pipeline import run_audio_pipeline


router = APIRouter(tags=["investigation"])

SUPPORTED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}


class InvestigationRequest(BaseModel):
    """Optional request payload for initiating an investigation."""

    investigation_id: Optional[str] = None


def create_mock_evidence() -> list[Evidence]:
    """Generate deterministic multimodal mock evidence for testing pipeline orchestration.

    Includes:
    - video evidence (facial artifact detection)
    - audio evidence (synthetic voice signal)
    - text evidence (semantic coherence signal)
    """
    return [
        Evidence(
            modality="video",
            signal="face_artifact",
            score=0.82,
            confidence=0.88,
            status="suspicious",
            time_range=TimeRange(start=1.2, end=3.8),
        ),
        Evidence(
            modality="audio",
            signal="synthetic_voice",
            score=0.85,
            confidence=0.90,
            status="suspicious",
            time_range=TimeRange(start=1.0, end=4.0),
        ),
        Evidence(
            modality="text",
            signal="semantic_coherence",
            score=0.78,
            confidence=0.80,
            status="suspicious",
            time_range=None,
        ),
    ]


@router.post("/investigations", response_model=InvestigationResult)
async def run_investigation(
    request: Request,
    video: Optional[UploadFile] = File(default=None),
    file: Optional[UploadFile] = File(default=None),
    investigation_id: Optional[str] = Form(default=None),
) -> InvestigationResult:
    """Run an investigation pipeline and produce an assessment."""
    inv_id = investigation_id

    # Backward compatibility: extract investigation_id from JSON request body if present
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            if isinstance(body, dict) and body.get("investigation_id"):
                inv_id = body.get("investigation_id")
        except Exception:
            pass

    if not inv_id:
        inv_id = f"inv_{uuid.uuid4().hex[:10]}"

    # Video input validation and local temporary storage
    uploaded_file = video or file
    video_ref: Optional[str] = None

    if uploaded_file is not None:
        filename = (uploaded_file.filename or "").strip()
        if not filename:
            raise HTTPException(
                status_code=400,
                detail="No file supplied or missing filename.",
            )
        _, ext = os.path.splitext(filename)
        if not ext or ext.lower() not in SUPPORTED_VIDEO_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported video format '{ext}'. "
                    f"Supported formats: {', '.join(sorted(SUPPORTED_VIDEO_EXTENSIONS))}"
                ),
            )

        # Temporary local storage appropriate for hackathon prototype
        temp_dir = tempfile.gettempdir()
        safe_filename = f"trustlayer_{inv_id}_{os.path.basename(filename)}"
        temp_file_path = os.path.join(temp_dir, safe_filename)

        contents = await uploaded_file.read()
        with open(temp_file_path, "wb") as buffer:
            buffer.write(contents)

        video_ref = temp_file_path

    # Step 1: Preprocessing layer receives video input reference
    preprocessing_service = PreprocessingService()
    video_path = video_ref if video_ref else "mock_video_input"
    preprocessing_service.process(video_path=video_path)

    # Step 2: Evidence generation
    timeline: list[TimelineItem] = []

    if video_ref is not None:
        # Step 16: Real ML Video Analysis via VideoDetector
        detector = VideoDetector()
        video_result = detector.analyze_video(
            video_path=video_ref,
            include_face_consistency=True,
        )

        evidence: list[Evidence] = []

        # Map VideoDetector output to TrustLayer Evidence model
        if video_result and video_result.get("score") is not None:
            raw_score = float(video_result["score"])
            uncertainty = float(video_result.get("uncertainty", 0.5))
            confidence = max(0.0, min(1.0, 1.0 - uncertainty))
            direction = str(video_result.get("direction", "inconclusive")).lower()

            if direction == "suspicious":
                status = "suspicious"
            elif direction == "authentic":
                status = "normal"
            else:
                status = "inconclusive"

            t_range = None
            res_tr = video_result.get("time_range")
            if res_tr and isinstance(res_tr, dict) and "start" in res_tr and "end" in res_tr:
                t_range = TimeRange(
                    start=float(res_tr["start"]),
                    end=float(res_tr["end"]),
                )

            video_evidence = Evidence(
                modality="video",
                signal="visual_synthetic",
                score=max(0.0, min(1.0, raw_score)),
                confidence=confidence,
                status=status,
                time_range=t_range,
            )
            evidence.append(video_evidence)

        # Real Audio ML Analysis via run_audio_pipeline (Step 17 AASIST + Step 18 Whisper)
        try:
            audio_pipeline_result = run_audio_pipeline(video_path=video_ref)
            if not isinstance(audio_pipeline_result, dict):
                audio_pipeline_result = {}
        except Exception:
            audio_pipeline_result = {}

        audio_info = (
            audio_pipeline_result.get("audio", {})
            if isinstance(audio_pipeline_result, dict)
            else {}
        )
        transcription_info = (
            audio_pipeline_result.get("transcription", {})
            if isinstance(audio_pipeline_result, dict)
            else {}
        )

        # Safe-degradation rule: If synthetic_score is None or status is unavailable/error/insufficient:
        # - Do NOT fabricate a score.
        # - Do NOT create invalid Evidence.
        # - Do NOT treat missing audio evidence as authentic.
        # - Simply omit the audio Evidence item.
        if audio_info and audio_info.get("synthetic_score") is not None:
            raw_audio_status = str(audio_info.get("status", "")).lower().strip()
            if raw_audio_status not in ["unavailable", "error"]:
                raw_score = float(audio_info["synthetic_score"])
                bounded_score = max(0.0, min(1.0, raw_score))

                raw_confidence = audio_info.get("confidence")
                if raw_confidence is not None:
                    confidence = max(0.0, min(1.0, float(raw_confidence)))
                else:
                    confidence = max(0.0, min(1.0, abs(bounded_score - 0.5) * 2))

                # Status mapping according to AASIST semantics:
                # - "suspicious" if audio status indicates suspicious/synthetic or synthetic_score >= 0.5
                # - "normal" if normal/authentic/genuine or synthetic_score < 0.5
                # - "inconclusive" if unavailable/partial/error/inconclusive
                if raw_audio_status in ["suspicious", "synthetic"]:
                    audio_status = "suspicious"
                elif raw_audio_status in ["normal", "authentic", "genuine", "bonafide"]:
                    audio_status = "normal"
                elif raw_audio_status in ["inconclusive", "partial"]:
                    audio_status = "inconclusive"
                else:
                    # AASIST decision threshold is 0.5 (backend/analysis/audio/spoof_detection.py)
                    audio_status = "suspicious" if bounded_score >= 0.5 else "normal"

                # Time range mapping
                audio_time_range = None
                raw_tr = audio_info.get("time_ranges")
                if isinstance(raw_tr, list) and len(raw_tr) > 0:
                    first_tr = raw_tr[0]
                    if isinstance(first_tr, dict) and "start" in first_tr and "end" in first_tr:
                        try:
                            audio_time_range = TimeRange(
                                start=float(first_tr["start"]),
                                end=float(first_tr["end"]),
                            )
                        except (ValueError, TypeError):
                            audio_time_range = None
                elif isinstance(raw_tr, dict) and "start" in raw_tr and "end" in raw_tr:
                    try:
                        audio_time_range = TimeRange(
                            start=float(raw_tr["start"]),
                            end=float(raw_tr["end"]),
                        )
                    except (ValueError, TypeError):
                        audio_time_range = None

                if audio_time_range is None and isinstance(audio_info.get("time_range"), dict):
                    sing_tr = audio_info["time_range"]
                    if "start" in sing_tr and "end" in sing_tr:
                        try:
                            audio_time_range = TimeRange(
                                start=float(sing_tr["start"]),
                                end=float(sing_tr["end"]),
                            )
                        except (ValueError, TypeError):
                            audio_time_range = None

                audio_evidence = Evidence(
                    modality="audio",
                    signal="synthetic_voice",
                    score=bounded_score,
                    confidence=confidence,
                    status=audio_status,
                    time_range=audio_time_range,
                )
                evidence.append(audio_evidence)

                # Timeline generation for suspicious audio segments
                if isinstance(raw_tr, list) and audio_status == "suspicious":
                    for tr_item in raw_tr:
                        if isinstance(tr_item, dict) and "start" in tr_item and "end" in tr_item:
                            try:
                                timeline.append(
                                    TimelineItem(
                                        start=float(tr_item["start"]),
                                        end=float(tr_item["end"]),
                                        label="Detected synthetic speech segment",
                                        severity="high" if bounded_score >= 0.7 else "medium",
                                    )
                                )
                            except (ValueError, TypeError):
                                pass
                elif audio_time_range and audio_status == "suspicious":
                    timeline.append(
                        TimelineItem(
                            start=audio_time_range.start,
                            end=audio_time_range.end,
                            label="Detected synthetic speech segment",
                            severity="high" if bounded_score >= 0.7 else "medium",
                        )
                    )

        # Step 18: Real faster-whisper Speech Transcription integration
        try:
            if isinstance(transcription_info, dict):
                raw_trans_status = str(transcription_info.get("status", "")).lower().strip()
                if raw_trans_status not in ["unavailable", "error", "failed"]:
                    raw_text = str(transcription_info.get("text", "")).strip()
                    raw_segments = transcription_info.get("segments") or []

                    # Extract valid segments and calculate word-level confidence if available
                    valid_segments: list[tuple[float, float, str]] = []
                    word_probs: list[float] = []

                    if isinstance(raw_segments, list):
                        for seg in raw_segments:
                            if not isinstance(seg, dict):
                                continue
                            try:
                                seg_start = float(seg["start"])
                                seg_end = float(seg["end"])
                                if (
                                    math.isnan(seg_start)
                                    or math.isnan(seg_end)
                                    or seg_start < 0
                                    or seg_end < seg_start
                                ):
                                    continue
                                seg_text = str(seg.get("text", "")).strip()
                                valid_segments.append((seg_start, seg_end, seg_text))

                                # Collect word probabilities if present
                                words = seg.get("words")
                                if isinstance(words, list):
                                    for w in words:
                                        if isinstance(w, dict):
                                            p = w.get("probability")
                                            if p is None:
                                                p = w.get("prob")
                                            if p is not None:
                                                wp = float(p)
                                                if not math.isnan(wp):
                                                    word_probs.append(wp)
                                elif "probability" in seg and seg["probability"] is not None:
                                    sp = float(seg["probability"])
                                    if not math.isnan(sp):
                                        word_probs.append(sp)
                            except (ValueError, TypeError, KeyError):
                                continue

                    # Create text Evidence if usable text or valid segments exist
                    has_usable_content = bool(raw_text or valid_segments)
                    if has_usable_content:
                        if word_probs:
                            avg_prob = sum(word_probs) / len(word_probs)
                            transcript_conf = round(max(0.0, min(1.0, float(avg_prob))), 4)
                        elif transcription_info.get("confidence") is not None:
                            try:
                                transcript_conf = round(
                                    max(0.0, min(1.0, float(transcription_info["confidence"]))),
                                    4,
                                )
                            except (ValueError, TypeError):
                                transcript_conf = 0.50
                        else:
                            transcript_conf = 0.50

                        evidence.append(
                            Evidence(
                                modality="text",
                                signal="speech_transcript",
                                score=0.50,
                                confidence=transcript_conf,
                                status="normal",
                                time_range=None,
                            )
                        )

                        # Append neutral timeline entries for valid speech segments
                        for start_t, end_t, text_val in valid_segments:
                            lbl = (
                                f"Speech transcript: {text_val[:60]}..."
                                if len(text_val) > 60
                                else (f"Speech transcript: {text_val}" if text_val else "Speech transcript segment")
                            )
                            timeline.append(
                                TimelineItem(
                                    start=round(start_t, 2),
                                    end=round(end_t, 2),
                                    label=lbl,
                                    severity="info",
                                )
                            )
        except Exception:
            # Safe degradation: transcription errors must not break investigation
            pass

        # Timeline generation from video intervals if available
        if video_result and video_result.get("suspicious_intervals"):
            for iv in video_result["suspicious_intervals"]:
                timeline.append(
                    TimelineItem(
                        start=float(iv["start"]),
                        end=float(iv["end"]),
                        label="Detected visual manipulation",
                        severity="high",
                    )
                )
        elif video_result and video_result.get("time_range"):
            tr = video_result["time_range"]
            timeline.append(
                TimelineItem(
                    start=float(tr["start"]),
                    end=float(tr["end"]),
                    label="Detected visual anomaly",
                    severity="medium",
                )
            )
    else:
        # Backward-compatible fallback for no-file requests
        evidence = create_mock_evidence()
        timeline = [
            TimelineItem(
                start=1.2,
                end=3.8,
                label="Detected facial artifact",
                severity="high",
            )
        ]

    # Step 3: Cross-modal consistency analysis
    consistency_analyzer = ConsistencyAnalyzer()
    consistency_score = consistency_analyzer.calculate_consistency(evidence)

    # Step 4: Conflict detection
    conflict_detector = ConflictDetector()
    conflict_detected = conflict_detector.detect_conflict(evidence)

    # Step 5: Trust assessment engine (remains the ONLY verdict decision-maker)
    trust_engine = TrustEngine()
    assessment = trust_engine.assess(evidence, consistency_score=consistency_score)
    if conflict_detected:
        assessment.conflict = True

    # Step 7: Generate explanation via Gemini (with deterministic fallback)
    explanation_service = GeminiExplanationService()
    explanation = explanation_service.generate_explanation(
        assessment=assessment,
        evidence=evidence,
        timeline=timeline,
    )

    return InvestigationResult(
        investigation_id=inv_id,
        assessment=assessment,
        evidence=evidence,
        timeline=timeline,
        explanation=explanation,
    )


__all__ = [
    "Assessment",
    "Evidence",
    "GeminiExplanationService",
    "InvestigationRequest",
    "InvestigationResult",
    "PreprocessingService",
    "SUPPORTED_VIDEO_EXTENSIONS",
    "TimelineItem",
    "TimeRange",
    "Verdict",
    "VideoDetector",
    "create_mock_evidence",
    "router",
    "run_audio_pipeline",
]
