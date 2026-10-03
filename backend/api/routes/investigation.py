"""Investigation route orchestration for TrustLayer.

Connects the forensic pipeline:
API request -> Mock Evidence -> ConsistencyAnalyzer -> ConflictDetector -> TrustEngine -> InvestigationResult
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Body
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


router = APIRouter(tags=["investigation"])


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
def run_investigation(
    payload: Optional[InvestigationRequest] = Body(default=None),
) -> InvestigationResult:
    """Run an investigation pipeline and produce an assessment."""
    inv_id = (
        payload.investigation_id if payload and payload.investigation_id else None
    ) or f"inv_{uuid.uuid4().hex[:10]}"

    # Step 1: Generate / retrieve mock multimodal evidence
    evidence = create_mock_evidence()

    # Step 2: Cross-modal consistency analysis
    consistency_analyzer = ConsistencyAnalyzer()
    consistency_score = consistency_analyzer.calculate_consistency(evidence)

    # Step 3: Conflict detection
    conflict_detector = ConflictDetector()
    conflict_detected = conflict_detector.detect_conflict(evidence)

    # Step 4: Trust assessment engine
    trust_engine = TrustEngine()
    assessment = trust_engine.assess(evidence, consistency_score=consistency_score)
    if conflict_detected:
        assessment.conflict = True

    # Step 5: Deterministic timeline intervals
    timeline = [
        TimelineItem(
            start=1.2,
            end=3.8,
            label="Detected facial artifact",
            severity="high",
        )
    ]

    # Step 6: Deterministic explanation placeholder incorporating pipeline findings
    conflict_note = " Conflicting forensic evidence detected." if conflict_detected else ""
    explanation = (
        f"Multi-modal forensic analysis completed.{conflict_note} Coordinated synthetic indicators "
        f"detected across video, audio, and text modalities. Verdict: {assessment.verdict}."
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
    "InvestigationRequest",
    "InvestigationResult",
    "TimelineItem",
    "TimeRange",
    "Verdict",
    "create_mock_evidence",
    "router",
]
