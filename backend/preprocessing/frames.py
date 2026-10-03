"""Frame extraction contract and data models for video preprocessing.

Provides structures and interface hooks for the ml-video branch to integrate
OpenCV / FFmpeg frame extraction.
"""

from typing import Optional
from pydantic import BaseModel, Field


class FrameInfo(BaseModel):
    """Information for an extracted video frame."""

    timestamp: float = Field(ge=0.0, description="Timestamp of the frame in seconds from video start")
    frame_index: Optional[int] = Field(default=None, ge=0, description="0-indexed frame sequence number")
    path: Optional[str] = Field(default=None, description="Filesystem path or URI to the extracted frame image")
    width: Optional[int] = Field(default=None, gt=0, description="Width of the frame in pixels")
    height: Optional[int] = Field(default=None, gt=0, description="Height of the frame in pixels")


def extract_frames(
    video_path: str,
    fps: Optional[float] = None,
    max_frames: Optional[int] = None,
) -> list[FrameInfo]:
    """Placeholder interface for frame extraction.

    To be implemented by the ml-video branch using OpenCV / FFmpeg.
    Currently returns an empty list without pretending real frames were extracted.
    """
    return []


__all__ = ["FrameInfo", "extract_frames"]
