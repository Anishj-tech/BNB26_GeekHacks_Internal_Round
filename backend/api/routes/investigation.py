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

    # Step 2: Generate / retrieve mock multimodal evidence
    # Note: ML analysis from preprocessed video will be hooked in a later step.
    evidence = create_mock_evidence()

    # Step 3: Cross-modal consistency analysis
    consistency_analyzer = ConsistencyAnalyzer()
    consistency_score = consistency_analyzer.calculate_consistency(evidence)

    # Step 4: Conflict detection
    conflict_detector = ConflictDetector()
    conflict_detected = conflict_detector.detect_conflict(evidence)

    # Step 5: Trust assessment engine
    trust_engine = TrustEngine()
    assessment = trust_engine.assess(evidence, consistency_score=consistency_score)
    if conflict_detected:
        assessment.conflict = True

    # Step 6: Deterministic timeline intervals
    timeline = [
        TimelineItem(
            start=1.2,
            end=3.8,
            label="Detected facial artifact",
            severity="high",
        )
    ]

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
    "create_mock_evidence",
    "router",
]
