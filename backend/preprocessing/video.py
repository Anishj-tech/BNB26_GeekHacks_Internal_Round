"""Video preprocessing contract and service for TrustLayer.

Combines:
- Step 14/15 preprocessing contracts (VideoMetadata, PreprocessingResult, PreprocessingService)
- OpenCV-based video validation and metadata extraction (VideoPreprocessor, validate_video, get_video_metadata)
"""

import os
from typing import Optional, Tuple
import cv2
from pydantic import BaseModel, Field

try:
    from backend.preprocessing.frames import FrameInfo, extract_frames
    from backend.preprocessing.audio import (
        AudioInfo,
        TranscriptInfo,
        TranscriptSegment,
        extract_audio,
        transcribe_audio,
    )
except ImportError:
    from preprocessing.frames import FrameInfo, extract_frames
    from preprocessing.audio import (
        AudioInfo,
        TranscriptInfo,
        TranscriptSegment,
        extract_audio,
        transcribe_audio,
    )


class VideoMetadata(BaseModel):
    """Core video container and stream metadata."""

    duration: float = Field(default=0.0, ge=0.0, description="Video duration in seconds")
    fps: float = Field(default=0.0, ge=0.0, description="Frames per second")
    width: int = Field(default=0, ge=0, description="Video width in pixels")
    height: int = Field(default=0, ge=0, description="Video height in pixels")
    total_frames: Optional[int] = Field(default=None, ge=0, description="Total frame count")
    codec: Optional[str] = Field(default=None, description="Video stream codec (e.g. h264, vp9)")
    filepath: Optional[str] = Field(default=None, description="Video file path")
    duration_seconds: float = Field(default=0.0, description="Video duration in seconds")
    frame_count: int = Field(default=0, description="Total frame count")
    is_valid: bool = Field(default=True, description="Whether the video stream is valid")
    error_message: Optional[str] = Field(default=None, description="Error message if invalid")

    def __init__(self, **data):
        if "duration" in data and "duration_seconds" not in data:
            data["duration_seconds"] = data["duration"]
        elif "duration_seconds" in data and "duration" not in data:
            data["duration"] = data["duration_seconds"]
        if "total_frames" in data and "frame_count" not in data:
            data["frame_count"] = data["total_frames"] or 0
        elif "frame_count" in data and "total_frames" not in data:
            data["total_frames"] = data["frame_count"]
        super().__init__(**data)

    def to_dict(self) -> dict:
        return self.model_dump()


class VideoPreprocessor:
    """Validates input video files and extracts essential stream metadata."""

    SUPPORTED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}

    def __init__(self, max_duration_seconds: float = 300.0):
        self.max_duration_seconds = max_duration_seconds

    def validate_file(self, video_path: str) -> Tuple[bool, Optional[str]]:
        if not video_path:
            return False, "Video path is empty or None"
        if not os.path.exists(video_path):
            return False, f"Video file not found: {video_path}"
        if not os.path.isfile(video_path):
            return False, f"Path is not a regular file: {video_path}"
        if os.path.getsize(video_path) == 0:
            return False, "Video file is empty (0 bytes)"

        ext = os.path.splitext(video_path)[1].lower()
        if ext not in self.SUPPORTED_EXTENSIONS:
            return False, f"Unsupported video extension: '{ext}'. Supported: {', '.join(sorted(self.SUPPORTED_EXTENSIONS))}"

        return True, None

    def extract_metadata(self, video_path: str) -> VideoMetadata:
        is_valid, error = self.validate_file(video_path)
        if not is_valid:
            return VideoMetadata(
                filepath=video_path,
                duration_seconds=0.0,
                fps=0.0,
                frame_count=0,
                width=0,
                height=0,
                is_valid=False,
                error_message=error,
            )

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return VideoMetadata(
                filepath=video_path,
                duration_seconds=0.0,
                fps=0.0,
                frame_count=0,
                width=0,
                height=0,
                is_valid=False,
                error_message="Could not open video stream (unsupported codec or corrupt container)",
            )

        try:
            fps = float(cap.get(cv2.CAP_PROP_FPS) or 0.0)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)

            ret, test_frame = cap.read()
            if not ret or test_frame is None:
                return VideoMetadata(
                    filepath=video_path,
                    duration_seconds=0.0,
                    fps=fps,
                    frame_count=0,
                    width=width,
                    height=height,
                    is_valid=False,
                    error_message="Video contains no decodable frames",
                )

            if fps > 0 and frame_count > 0:
                duration_seconds = frame_count / fps
            elif fps > 0:
                remaining_frames = 1
                while True:
                    ret_next, _ = cap.read()
                    if not ret_next:
                        break
                    remaining_frames += 1
                frame_count = remaining_frames
                duration_seconds = frame_count / fps
            else:
                duration_seconds = 0.0

            if duration_seconds == 0.0 or frame_count == 0:
                return VideoMetadata(
                    filepath=video_path,
                    duration_seconds=0.0,
                    fps=fps,
                    frame_count=frame_count,
                    width=width,
                    height=height,
                    is_valid=False,
                    error_message="Video has zero duration or zero frames",
                )

            return VideoMetadata(
                filepath=video_path,
                duration_seconds=round(duration_seconds, 3),
                fps=round(fps, 2),
                frame_count=frame_count,
                width=width,
                height=height,
                is_valid=True,
                error_message=None,
            )
        finally:
            cap.release()


_preprocessor = VideoPreprocessor()


def validate_video(video_path: str) -> Tuple[bool, Optional[str]]:
    """Convenience helper to validate video file integrity."""
    metadata = _preprocessor.extract_metadata(video_path)
    return metadata.is_valid, metadata.error_message


def get_video_metadata(video_path: str) -> VideoMetadata:
    """Convenience helper to extract video metadata."""
    return _preprocessor.extract_metadata(video_path)


class PreprocessingResult(BaseModel):
    """Unified result contract for media preprocessing."""

    video_path: str = Field(description="Original video path, URI, or storage reference")
    metadata: Optional[VideoMetadata] = Field(default=None, description="Extracted video stream metadata")
    frames: list[FrameInfo] = Field(default_factory=list, description="Extracted frame references with timestamps")
    audio: Optional[AudioInfo] = Field(default=None, description="Extracted audio stream metadata and path")
    transcript: Optional[TranscriptInfo] = Field(default=None, description="Transcribed speech text and segments")
    status: str = Field(default="placeholder", description="Status of the preprocessing stage")
    error: Optional[str] = Field(default=None, description="Error message if preprocessing failed")


class PreprocessingService:
    """Service interface for multimodal media preprocessing."""

    def process(
        self,
        video_path: str,
        metadata: Optional[VideoMetadata] = None,
    ) -> PreprocessingResult:
        return PreprocessingResult(
            video_path=video_path,
            metadata=metadata,
            frames=[],
            audio=None,
            transcript=None,
            status="placeholder",
            error=None,
        )

    def preprocess(
        self,
        video_path: str,
        metadata: Optional[VideoMetadata] = None,
    ) -> PreprocessingResult:
        return self.process(video_path, metadata=metadata)


def preprocess_video(
    video_path: str,
    metadata: Optional[VideoMetadata] = None,
) -> PreprocessingResult:
    return PreprocessingService().process(video_path, metadata=metadata)


__all__ = [
    "AudioInfo",
    "FrameInfo",
    "PreprocessingResult",
    "PreprocessingService",
    "TranscriptInfo",
    "TranscriptSegment",
    "VideoMetadata",
    "VideoPreprocessor",
    "extract_audio",
    "extract_frames",
    "get_video_metadata",
    "preprocess_video",
    "transcribe_audio",
    "validate_video",
]
