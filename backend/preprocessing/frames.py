"""Frame extraction contract and data models for video preprocessing.

Provides structures and interface hooks for video frame extraction:
- FrameInfo & extract_frames: Pydantic interface from Step 14
- FrameData, FrameExtractor, sample_frames, iter_frames: OpenCV frame sampling from ml-video
"""

from dataclasses import dataclass
from typing import Generator, List, Optional
import cv2
import numpy as np
from pydantic import BaseModel, Field

# Note: get_video_metadata is imported lazily inside iter_frames to avoid circular imports


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
    """Extract frames metadata."""
    return []


@dataclass
class FrameData:
    frame_index: int
    timestamp: float
    frame: np.ndarray  # BGR image as standard in OpenCV

    def to_dict(self, include_image: bool = False) -> dict:
        data = {
            "frame_index": self.frame_index,
            "timestamp": round(self.timestamp, 3),
        }
        if include_image:
            data["frame"] = self.frame
        return data


class FrameExtractor:
    """Extracts frames from video files at controlled intervals without loading the full video into memory."""

    def __init__(self, default_sample_fps: float = 1.0, max_frames: int = 30):
        self.default_sample_fps = default_sample_fps
        self.max_frames = max_frames

    def iter_frames(
        self,
        video_path: str,
        sample_fps: Optional[float] = None,
        max_frames: Optional[int] = None,
    ) -> Generator[FrameData, None, None]:
        target_fps = sample_fps if sample_fps is not None else self.default_sample_fps
        limit_frames = max_frames if max_frames is not None else self.max_frames

        try:
            from backend.preprocessing.video import get_video_metadata, VideoMetadata
        except ImportError:
            from preprocessing.video import get_video_metadata, VideoMetadata

        metadata: VideoMetadata = get_video_metadata(video_path)
        if not metadata.is_valid or metadata.frame_count <= 0 or metadata.fps <= 0:
            return

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return

        try:
            native_fps = metadata.fps
            total_frames = metadata.frame_count

            # Determine frame step interval
            if target_fps >= native_fps:
                step = 1
            else:
                step = max(1, int(round(native_fps / target_fps)))

            expected_sampled = total_frames // step
            if expected_sampled > limit_frames:
                step = max(1, total_frames // limit_frames)

            sampled_count = 0
            current_frame_idx = 0

            while current_frame_idx < total_frames and sampled_count < limit_frames:
                cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame_idx)
                ret, frame = cap.read()
                if not ret or frame is None:
                    break

                timestamp = current_frame_idx / native_fps
                yield FrameData(
                    frame_index=current_frame_idx,
                    timestamp=round(timestamp, 3),
                    frame=frame,
                )

                sampled_count += 1
                current_frame_idx += step

        finally:
            cap.release()

    def sample_frames(
        self,
        video_path: str,
        sample_fps: Optional[float] = None,
        max_frames: Optional[int] = None,
    ) -> List[FrameData]:
        return list(
            self.iter_frames(
                video_path=video_path,
                sample_fps=sample_fps,
                max_frames=max_frames,
            )
        )


_extractor = FrameExtractor()


def sample_frames(
    video_path: str,
    sample_fps: Optional[float] = None,
    max_frames: Optional[int] = None,
) -> List[FrameData]:
    """Convenience helper to extract a list of sampled frames with timestamps."""
    return _extractor.sample_frames(
        video_path=video_path, sample_fps=sample_fps, max_frames=max_frames
    )


def iter_frames(
    video_path: str,
    sample_fps: Optional[float] = None,
    max_frames: Optional[int] = None,
) -> Generator[FrameData, None, None]:
    """Convenience generator to stream sampled frames."""
    return _extractor.iter_frames(
        video_path=video_path, sample_fps=sample_fps, max_frames=max_frames
    )


__all__ = [
    "FrameData",
    "FrameExtractor",
    "FrameInfo",
    "extract_frames",
    "iter_frames",
    "sample_frames",
]
