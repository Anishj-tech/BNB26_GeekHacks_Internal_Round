from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


class TimeRange(BaseModel):
    start: float
    end: float


class Evidence(BaseModel):
    modality: str
    signal: str
    score: float = Field(ge=0.0, le=1.0, description="Evidence score between 0.0 and 1.0")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    status: str
    time_range: Optional[TimeRange] = None


class Verdict(str, Enum):
    AUTHENTIC = "AUTHENTIC"
    MANIPULATED = "MANIPULATED"
    COORDINATED_SYNTHETIC = "COORDINATED SYNTHETIC"
    INCONCLUSIVE_INSUFFICIENT_EVIDENCE = "INCONCLUSIVE — INSUFFICIENT EVIDENCE"
    INCONCLUSIVE_CONFLICTING_EVIDENCE = "INCONCLUSIVE — CONFLICTING EVIDENCE"


class Assessment(BaseModel):
    verdict: str
    synthetic_score: float = Field(ge=0.0, le=1.0, description="Synthetic score between 0.0 and 1.0")
    consistency_score: float = Field(ge=0.0, le=1.0, description="Consistency score between 0.0 and 1.0")
    evidence_coverage: float = Field(ge=0.0, le=1.0, description="Evidence coverage between 0.0 and 1.0")
    conflict: bool


class TimelineItem(BaseModel):
    start: float
    end: float
    label: str
    severity: str


class GraphNode(BaseModel):
    id: str
    type: str
    label: str
    status: str
    score: Optional[float] = None
    confidence: Optional[float] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    source: str
    target: str
    relation: str
    weight: float = Field(default=1.0, ge=0.0, le=1.0)
    is_conflict: bool = False


class EvidenceGraph(BaseModel):
    nodes: list[GraphNode] = Field(default_factory=list)
    edges: list[GraphEdge] = Field(default_factory=list)


class InvestigationResult(BaseModel):
    investigation_id: str
    assessment: Assessment
    evidence: list[Evidence] = Field(default_factory=list)
    timeline: list[TimelineItem] = Field(default_factory=list)
    explanation: Optional[str] = None
    graph: Optional[EvidenceGraph] = None
