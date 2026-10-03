from typing import Optional
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
