from typing import Optional
from fastapi import APIRouter

try:
    from backend.analysis.evidence import (
        Assessment,
        Evidence,
        InvestigationResult,
        TimelineItem,
        TimeRange,
        Verdict,
    )
except ImportError:
    from analysis.evidence import (
        Assessment,
        Evidence,
        InvestigationResult,
        TimelineItem,
        TimeRange,
        Verdict,
    )

router = APIRouter(tags=["investigation"])

__all__ = [
    "Assessment",
    "Evidence",
    "InvestigationResult",
    "TimelineItem",
    "TimeRange",
    "Verdict",
    "router",
]
