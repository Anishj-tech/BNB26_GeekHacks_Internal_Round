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
from typing import Any, Optional
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import BaseModel

try:
    from backend.analysis.evidence import (
        Assessment,
        Evidence,
        EvidenceGraph,
        GraphEdge,
        GraphNode,
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
        EvidenceGraph,
        GraphEdge,
        GraphNode,
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


def build_investigation_timeline(
    evidence: list[Evidence],
    transcript_timeline: Optional[list[TimelineItem]] = None,
    sub_intervals: Optional[list[TimelineItem]] = None,
) -> list[TimelineItem]:
    """Assemble a deterministic, chronological timeline from actual investigation evidence.

    Rules:
    - Suspicious evidence items with valid time_range (start >= 0, end >= start) produce timeline entries.
    - Normal, inconclusive, or missing evidence items do NOT produce suspicious timeline entries.
    - Informational transcript segments from Whisper are preserved.
    - Timeline entries are sorted chronologically by start time.
    """
    timeline: list[TimelineItem] = []
    seen: set[tuple[float, float, str]] = set()

    def _is_valid_range(st: float, et: float) -> bool:
        return (
            not math.isnan(st)
            and not math.isnan(et)
            and not math.isinf(st)
            and not math.isinf(et)
            and st >= 0.0
            and et >= st
        )

    def _add_item(start: float, end: float, label: str, severity: str):
        try:
            st = round(float(start), 2)
            et = round(float(end), 2)
        except (ValueError, TypeError):
            return
        if not _is_valid_range(st, et):
            return
        key = (st, et, label)
        if key not in seen:
            seen.add(key)
            timeline.append(
                TimelineItem(
                    start=st,
                    end=et,
                    label=label,
                    severity=severity,
                )
            )

    # 1. Add fine-grained sub-intervals if present for suspicious evidence
    if sub_intervals:
        for sub in sub_intervals:
            _add_item(sub.start, sub.end, sub.label, sub.severity)

    # 2. Derive timeline items from suspicious Evidence objects
    for ev in evidence:
        if ev.status.lower() != "suspicious":
            continue
        if ev.time_range is None:
            continue

        try:
            st = float(ev.time_range.start)
            et = float(ev.time_range.end)
        except (ValueError, TypeError):
            continue

        # Map label based on modality and signal
        mod_lower = ev.modality.lower()
        sig_lower = ev.signal.lower()

        if mod_lower == "video" or "visual" in sig_lower:
            lbl = "Visual synthetic signal"
            sev = "high" if ev.score >= 0.70 else "medium"
        elif mod_lower == "audio" or "voice" in sig_lower or "audio" in sig_lower:
            lbl = "Synthetic voice signal"
            sev = "high" if ev.score >= 0.70 else "medium"
        elif mod_lower in ("audio_video", "sync") or "lip_sync" in sig_lower or "sync" in sig_lower:
            lbl = "Audio-video synchronization anomaly"
            sev = "high"
        else:
            lbl = f"Suspicious {ev.modality} signal"
            sev = "high" if ev.score >= 0.70 else "medium"

        _add_item(st, et, lbl, sev)

    # 3. Add informational transcript segments (Whisper)
    if transcript_timeline:
        for t_item in transcript_timeline:
            _add_item(t_item.start, t_item.end, t_item.label, t_item.severity)

    # 4. Sort chronologically by start time, then end time
    timeline.sort(key=lambda item: (item.start, item.end))
    return timeline


def build_evidence_graph(
    evidence: list[Evidence],
    assessment: Assessment,
    face_info: Optional[dict[str, Any]] = None,
) -> EvidenceGraph:
    """Build a deterministic evidence graph showing cross-modal relationships.

    Visualizes how evidence supports or conflicts with the final assessment:
    - Modality nodes: Video, Audio, Text, Audio-Video Consistency
    - Signal nodes: Each underlying Evidence item with its score/confidence/status
    - Relationships:
      * video <-> audio (corroborates / conflicts_with)
      * audio <-> text (corroborates / derived_from / conflicts_with)
      * video <-> face (derived_from / corroborates / conflicts_with) when reliable face data exists
      * audio <-> audio_video (synchronizes_with) when SyncNet data exists
      * video <-> audio_video (synchronizes_with) when SyncNet data exists
      * signal -> modality (derived_from)

    Args:
        evidence: List of Evidence objects.
        assessment: Deterministic Assessment from TrustEngine.
        face_info: Optional raw face_consistency telemetry from VideoDetector.

    Returns:
        EvidenceGraph with nodes and edges, or empty graph if no evidence.
    """
    if not evidence:
        return EvidenceGraph(nodes=[], edges=[])

    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    seen_node_ids: set[str] = set()
    seen_edges: set[tuple[str, str, str]] = set()

    def _add_node(node: GraphNode) -> None:
        if node.id not in seen_node_ids:
            nodes.append(node)
            seen_node_ids.add(node.id)

    def _add_edge(source: str, target: str, relation: str, weight: float, is_conflict: bool = False) -> None:
        bounded_weight = round(max(0.0, min(1.0, float(weight))), 4)
        edge_key = (source, target, relation)
        if edge_key not in seen_edges:
            edges.append(
                GraphEdge(
                    source=source,
                    target=target,
                    relation=relation,
                    weight=bounded_weight,
                    is_conflict=is_conflict,
                )
            )
            seen_edges.add(edge_key)

    # 1. Modality mapping definition
    MODALITY_INFO = {
        "video": ("mod_video", "Video"),
        "audio": ("mod_audio", "Audio"),
        "text": ("mod_text", "Text"),
        "audio_video": ("mod_audio_video", "Audio-Video Consistency"),
        "sync": ("mod_audio_video", "Audio-Video Consistency"),
        "face": ("mod_face", "Face Consistency"),
    }

    # Group evidence items by normalized modality
    evidence_by_modality: dict[str, list[Evidence]] = {}
    for ev in evidence:
        mod_key = ev.modality.lower().strip()
        if mod_key in ("audio_video", "sync"):
            mod_key = "audio_video"
        evidence_by_modality.setdefault(mod_key, []).append(ev)

    # Modality selection: strongest evidence item for node attributes
    mod_nodes: dict[str, GraphNode] = {}
    for mod_key, items in evidence_by_modality.items():
        if not items:
            continue
        mod_id, mod_label = MODALITY_INFO.get(mod_key, (f"mod_{mod_key}", mod_key.replace("_", " ").title()))

        def _item_strength(item: Evidence) -> tuple[int, float, float]:
            st = item.status.lower()
            if st == "suspicious":
                return (2, item.score, item.confidence)
            elif st in ("normal", "authentic"):
                return (1, 1.0 - item.score, item.confidence)
            return (0, item.confidence, 0.0)

        best_item = max(items, key=_item_strength)
        mod_score = round(max(0.0, min(1.0, float(best_item.score))), 4)
        mod_conf = round(max(0.0, min(1.0, float(best_item.confidence))), 4)

        mod_node = GraphNode(
            id=mod_id,
            type="modality",
            label=mod_label,
            status=best_item.status,
            score=mod_score,
            confidence=mod_conf,
            metadata={"primary_signal": best_item.signal},
        )
        _add_node(mod_node)
        mod_nodes[mod_id] = mod_node

    # 2. Signal nodes for each Evidence item
    SIGNAL_LABELS = {
        "visual_synthetic": "Visual Synthetic Signal",
        "synthetic_voice": "Synthetic Voice Signal",
        "speech_transcript": "Speech Transcript",
        "lip_sync": "Lip-Sync Consistency",
        "face_consistency": "Face Consistency",
        "facial_artifact": "Facial Artifact",
    }

    sig_counter: dict[str, int] = {}
    for ev in evidence:
        mod_key = ev.modality.lower().strip()
        if mod_key in ("audio_video", "sync"):
            mod_key = "audio_video"
        mod_id = MODALITY_INFO.get(mod_key, (f"mod_{mod_key}", ""))[0]

        sig_base = f"sig_{mod_key}_{ev.signal.lower()}"
        sig_counter[sig_base] = sig_counter.get(sig_base, 0) + 1
        sig_id = sig_base if sig_counter[sig_base] == 1 else f"{sig_base}_{sig_counter[sig_base]}"

        label = SIGNAL_LABELS.get(ev.signal) or ev.signal.replace("_", " ").title()

        sig_meta: dict[str, Any] = {}
        if ev.time_range is not None:
            try:
                sig_meta["time_range"] = {
                    "start": round(float(ev.time_range.start), 2),
                    "end": round(float(ev.time_range.end), 2),
                }
            except (ValueError, TypeError):
                pass

        sig_score = round(max(0.0, min(1.0, float(ev.score))), 4)
        sig_conf = round(max(0.0, min(1.0, float(ev.confidence))), 4)

        sig_node = GraphNode(
            id=sig_id,
            type="signal",
            label=label,
            status=ev.status,
            score=sig_score,
            confidence=sig_conf,
            metadata=sig_meta,
        )
        _add_node(sig_node)

        # Connect signal to its modality via derived_from
        if mod_id in seen_node_ids:
            _add_edge(
                source=sig_id,
                target=mod_id,
                relation="derived_from",
                weight=sig_conf,
                is_conflict=False,
            )

    # 3. Create FACE node from reliable existing video evidence if available
    face_node_id: Optional[str] = None
    if "mod_face" in seen_node_ids:
        face_node_id = "mod_face"
    elif face_info and isinstance(face_info, dict):
        num_faces = face_info.get("num_faces_detected", 0)
        status_str = str(face_info.get("status", "")).lower()
        mean_sim = face_info.get("mean_embedding_similarity")
        is_consistent = face_info.get("is_consistent")

        if (
            isinstance(num_faces, int)
            and num_faces >= 2
            and status_str in ("consistent", "inconsistent")
            and mean_sim is not None
        ):
            try:
                sim_float = float(mean_sim)
                if not math.isnan(sim_float) and 0.0 <= sim_float <= 1.0:
                    face_score = round(max(0.0, min(1.0, 1.0 - sim_float)), 4)
                    face_status = (
                        "suspicious"
                        if (is_consistent is False or status_str == "inconsistent" or face_score >= 0.50)
                        else "normal"
                    )
                    face_node = GraphNode(
                        id="node_face",
                        type="face",
                        label="Face Consistency",
                        status=face_status,
                        score=face_score,
                        confidence=0.85,
                        metadata={
                            "num_faces_detected": num_faces,
                            "mean_embedding_similarity": round(sim_float, 4),
                            "status": status_str,
                        },
                    )
                    _add_node(face_node)
                    mod_nodes["node_face"] = face_node
                    face_node_id = "node_face"
            except (ValueError, TypeError):
                pass

    # 4. Modality-to-Modality Relationships
    # A. video <-> audio
    if "mod_video" in mod_nodes and "mod_audio" in mod_nodes:
        v_node = mod_nodes["mod_video"]
        a_node = mod_nodes["mod_audio"]
        v_susp = v_node.status == "suspicious" or (v_node.score is not None and v_node.score >= 0.65)
        a_susp = a_node.status == "suspicious" or (a_node.score is not None and a_node.score >= 0.65)
        v_norm = v_node.status == "normal" or (v_node.score is not None and v_node.score <= 0.35)
        a_norm = a_node.status == "normal" or (a_node.score is not None and a_node.score <= 0.35)
        v_conf = v_node.confidence or 0.5
        a_conf = a_node.confidence or 0.5

        if assessment.conflict or (v_susp and a_norm and v_conf >= 0.60 and a_conf >= 0.60) or (v_norm and a_susp and v_conf >= 0.60 and a_conf >= 0.60):
            rel = "conflicts_with"
            is_conf = True
            wt = abs((v_node.score or 0.5) - (a_node.score or 0.5))
            if wt == 0.0:
                wt = 0.80
        elif v_susp and a_susp:
            rel = "corroborates"
            is_conf = False
            wt = assessment.consistency_score if assessment.consistency_score > 0 else (v_conf + a_conf) / 2.0
        elif v_norm and a_norm:
            rel = "corroborates"
            is_conf = False
            wt = assessment.consistency_score if assessment.consistency_score > 0 else 0.85
        else:
            if assessment.consistency_score >= 0.50:
                rel = "corroborates"
                is_conf = False
                wt = assessment.consistency_score
            else:
                rel = "conflicts_with"
                is_conf = True
                wt = 1.0 - assessment.consistency_score

        _add_edge(source="mod_video", target="mod_audio", relation=rel, weight=wt, is_conflict=is_conf)

    # B. audio <-> text
    if "mod_audio" in mod_nodes and "mod_text" in mod_nodes:
        a_node = mod_nodes["mod_audio"]
        t_node = mod_nodes["mod_text"]
        a_susp = a_node.status == "suspicious" or (a_node.score is not None and a_node.score >= 0.65)
        t_susp = t_node.status == "suspicious" or (t_node.score is not None and t_node.score >= 0.65)
        t_conf = t_node.confidence or 0.5
        a_conf = a_node.confidence or 0.5

        if assessment.conflict and a_susp and (t_node.status == "normal") and a_conf >= 0.60 and t_conf >= 0.80 and t_node.metadata.get("primary_signal") != "speech_transcript":
            rel = "conflicts_with"
            is_conf = True
            wt = abs((a_node.score or 0.5) - (t_node.score or 0.5))
        elif a_susp and t_susp:
            rel = "corroborates"
            is_conf = False
            wt = (a_conf + t_conf) / 2.0
        elif a_node.status == "normal" and t_node.status == "normal":
            rel = "corroborates"
            is_conf = False
            wt = (a_conf + t_conf) / 2.0
        else:
            rel = "derived_from"
            is_conf = False
            wt = t_conf

        _add_edge(source="mod_audio", target="mod_text", relation=rel, weight=wt, is_conflict=is_conf)

    # C. video <-> face (when face evidence exists)
    if face_node_id and "mod_video" in mod_nodes and face_node_id in mod_nodes:
        v_node = mod_nodes["mod_video"]
        f_node = mod_nodes[face_node_id]
        v_susp = v_node.status == "suspicious" or (v_node.score is not None and v_node.score >= 0.65)
        f_susp = f_node.status == "suspicious" or (f_node.score is not None and f_node.score >= 0.50)
        v_norm = v_node.status == "normal" or (v_node.score is not None and v_node.score <= 0.35)
        f_norm = f_node.status == "normal" or (f_node.score is not None and f_node.score < 0.50)
        v_conf = v_node.confidence or 0.5
        f_conf = f_node.confidence or 0.5

        if (v_susp and f_norm and v_conf >= 0.60 and f_conf >= 0.60) or (v_norm and f_susp and v_conf >= 0.60 and f_conf >= 0.60):
            rel = "conflicts_with"
            is_conf = True
            wt = abs((v_node.score or 0.5) - (f_node.score or 0.5))
        elif v_susp and f_susp:
            rel = "corroborates"
            is_conf = False
            wt = (v_conf + f_conf) / 2.0
        else:
            rel = "derived_from"
            is_conf = False
            wt = f_conf

        _add_edge(source="mod_video", target=face_node_id, relation=rel, weight=wt, is_conflict=is_conf)

    # D. audio <-> audio_video and video <-> audio_video (when SyncNet exists)
    if "mod_audio_video" in mod_nodes:
        av_node = mod_nodes["mod_audio_video"]
        av_conf = av_node.confidence or 0.85
        av_susp = av_node.status == "suspicious"

        if "mod_video" in mod_nodes:
            v_node = mod_nodes["mod_video"]
            v_norm = v_node.status == "normal" or (v_node.score is not None and v_node.score <= 0.35)
            is_conf = av_susp and v_norm and (v_node.confidence or 0.5) >= 0.60 and av_conf >= 0.60
            _add_edge(
                source="mod_video",
                target="mod_audio_video",
                relation="synchronizes_with",
                weight=av_conf,
                is_conflict=is_conf,
            )

        if "mod_audio" in mod_nodes:
            a_node = mod_nodes["mod_audio"]
            a_norm = a_node.status == "normal" or (a_node.score is not None and a_node.score <= 0.35)
            is_conf = av_susp and a_norm and (a_node.confidence or 0.5) >= 0.60 and av_conf >= 0.60
            _add_edge(
                source="mod_audio",
                target="mod_audio_video",
                relation="synchronizes_with",
                weight=av_conf,
                is_conflict=is_conf,
            )

    return EvidenceGraph(nodes=nodes, edges=edges)


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
    sub_intervals: list[TimelineItem] = []
    transcript_timeline: list[TimelineItem] = []
    face_consistency_info: Optional[dict[str, Any]] = None

    if video_ref is not None:
        # Step 16: Real ML Video Analysis via VideoDetector
        detector = VideoDetector()
        video_result = detector.analyze_video(
            video_path=video_ref,
            include_face_consistency=True,
        )
        if isinstance(video_result, dict):
            face_consistency_info = video_result.get("face_consistency")

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
                try:
                    tr_s = float(res_tr["start"])
                    tr_e = float(res_tr["end"])
                    if not math.isnan(tr_s) and not math.isnan(tr_e) and tr_s >= 0 and tr_e >= tr_s:
                        t_range = TimeRange(
                            start=round(tr_s, 2),
                            end=round(tr_e, 2),
                        )
                except (ValueError, TypeError):
                    t_range = None

            video_evidence = Evidence(
                modality="video",
                signal="visual_synthetic",
                score=max(0.0, min(1.0, raw_score)),
                confidence=confidence,
                status=status,
                time_range=t_range,
            )
            evidence.append(video_evidence)

            # Collect fine-grained suspicious video intervals if present
            if status == "suspicious" and video_result.get("suspicious_intervals"):
                for iv in video_result["suspicious_intervals"]:
                    if isinstance(iv, dict) and "start" in iv and "end" in iv:
                        try:
                            iv_s = float(iv["start"])
                            iv_e = float(iv["end"])
                            if not math.isnan(iv_s) and not math.isnan(iv_e) and iv_s >= 0 and iv_e >= iv_s:
                                sub_intervals.append(
                                    TimelineItem(
                                        start=round(iv_s, 2),
                                        end=round(iv_e, 2),
                                        label="Visual synthetic signal",
                                        severity="high" if raw_score >= 0.70 else "medium",
                                    )
                                )
                        except (ValueError, TypeError):
                            pass

        # Real Audio ML Analysis via run_audio_pipeline (Step 17 AASIST + Step 18 Whisper + Step 19 SyncNet)
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
        sync_info = (
            audio_pipeline_result.get("sync", {})
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

                # Collect sub-intervals for suspicious audio segments
                if audio_status == "suspicious" and isinstance(raw_tr, list):
                    for tr_item in raw_tr:
                        if isinstance(tr_item, dict) and "start" in tr_item and "end" in tr_item:
                            try:
                                a_s = float(tr_item["start"])
                                a_e = float(tr_item["end"])
                                if not math.isnan(a_s) and not math.isnan(a_e) and a_s >= 0 and a_e >= a_s:
                                    sub_intervals.append(
                                        TimelineItem(
                                            start=round(a_s, 2),
                                            end=round(a_e, 2),
                                            label="Synthetic voice signal",
                                            severity="high" if bounded_score >= 0.70 else "medium",
                                        )
                                    )
                            except (ValueError, TypeError):
                                pass

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
                            transcript_timeline.append(
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

        # Step 19: Real SyncNet Audio-Visual Synchronization integration
        try:
            if isinstance(sync_info, dict):
                raw_sync_status = str(sync_info.get("status", "")).lower().strip()
                if raw_sync_status not in ["unavailable", "error", "failed"]:
                    raw_lip_sync_score = sync_info.get("lip_sync_score")
                    if raw_lip_sync_score is not None:
                        try:
                            lip_sync_val = float(raw_lip_sync_score)
                            is_valid_score = (
                                not math.isnan(lip_sync_val)
                                and not math.isinf(lip_sync_val)
                                and 0.0 <= lip_sync_val <= 1.0
                            )
                        except (ValueError, TypeError):
                            is_valid_score = False

                        if is_valid_score:
                            # Suspiciousness score: 1.0 - lip_sync_score
                            # Good sync (e.g. 0.90) -> low suspiciousness (0.10)
                            # Poor sync (e.g. 0.20) -> high suspiciousness (0.80)
                            evidence_score = round(max(0.0, min(1.0, 1.0 - lip_sync_val)), 4)

                            # Confidence calculation: use bounded value from SyncNet result or documented default 0.85
                            if sync_info.get("confidence") is not None:
                                try:
                                    raw_conf = float(sync_info["confidence"])
                                    sync_conf = round(max(0.0, min(1.0, raw_conf)), 4)
                                except (ValueError, TypeError):
                                    sync_conf = 0.85
                            else:
                                sync_conf = 0.85

                            # Status mapping
                            sync_status = "suspicious" if lip_sync_val < 0.50 else "normal"

                            # Time range mapping
                            sync_time_range = None
                            valid_ranges: list[tuple[float, float]] = []
                            raw_tr = sync_info.get("time_ranges")

                            if isinstance(raw_tr, list):
                                for r in raw_tr:
                                    if isinstance(r, dict) and "start" in r and "end" in r:
                                        try:
                                            st = float(r["start"])
                                            et = float(r["end"])
                                            if (
                                                not math.isnan(st)
                                                and not math.isnan(et)
                                                and st >= 0
                                                and et >= st
                                            ):
                                                valid_ranges.append((st, et))
                                        except (ValueError, TypeError):
                                            continue
                            elif isinstance(raw_tr, dict) and "start" in raw_tr and "end" in raw_tr:
                                try:
                                    st = float(raw_tr["start"])
                                    et = float(raw_tr["end"])
                                    if not math.isnan(st) and not math.isnan(et) and st >= 0 and et >= st:
                                        valid_ranges.append((st, et))
                                except (ValueError, TypeError):
                                    pass

                            if not valid_ranges and isinstance(sync_info.get("time_range"), dict):
                                sing_tr = sync_info["time_range"]
                                if "start" in sing_tr and "end" in sing_tr:
                                    try:
                                        st = float(sing_tr["start"])
                                        et = float(sing_tr["end"])
                                        if not math.isnan(st) and not math.isnan(et) and st >= 0 and et >= st:
                                            valid_ranges.append((st, et))
                                    except (ValueError, TypeError):
                                        pass

                            if valid_ranges:
                                sync_time_range = TimeRange(
                                    start=round(valid_ranges[0][0], 2),
                                    end=round(valid_ranges[0][1], 2),
                                )

                            evidence.append(
                                Evidence(
                                    modality="audio_video",
                                    signal="lip_sync",
                                    score=evidence_score,
                                    confidence=sync_conf,
                                    status=sync_status,
                                    time_range=sync_time_range,
                                )
                            )

                            # Append suspicious timeline entries only if synchronization is suspicious
                            if sync_status == "suspicious" and valid_ranges:
                                for st, et in valid_ranges:
                                    sub_intervals.append(
                                        TimelineItem(
                                            start=round(st, 2),
                                            end=round(et, 2),
                                            label="Audio-video synchronization anomaly",
                                            severity="high",
                                        )
                                    )
        except Exception:
            # Safe degradation: SyncNet errors must not break investigation
            pass

        # Step 2b: Assemble deterministic, evidence-driven timeline
        timeline = build_investigation_timeline(
            evidence=evidence,
            transcript_timeline=transcript_timeline,
            sub_intervals=sub_intervals,
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
    assessment = trust_engine.assess(
        evidence,
        consistency_score=consistency_score,
        conflict=conflict_detected,
    )
    if conflict_detected:
        assessment.conflict = True

    # Step 7: Generate explanation via Gemini (with deterministic fallback)
    explanation_service = GeminiExplanationService()
    explanation = explanation_service.generate_explanation(
        assessment=assessment,
        evidence=evidence,
        timeline=timeline,
    )

    # Step 8: Build Evidence Graph
    graph = build_evidence_graph(
        evidence=evidence,
        assessment=assessment,
        face_info=face_consistency_info,
    )

    return InvestigationResult(
        investigation_id=inv_id,
        assessment=assessment,
        evidence=evidence,
        timeline=timeline,
        explanation=explanation,
        graph=graph,
    )


__all__ = [
    "Assessment",
    "Evidence",
    "EvidenceGraph",
    "GeminiExplanationService",
    "GraphEdge",
    "GraphNode",
    "InvestigationRequest",
    "InvestigationResult",
    "PreprocessingService",
    "SUPPORTED_VIDEO_EXTENSIONS",
    "TimelineItem",
    "TimeRange",
    "Verdict",
    "VideoDetector",
    "build_evidence_graph",
    "build_investigation_timeline",
    "create_mock_evidence",
    "router",
    "run_audio_pipeline",
]
