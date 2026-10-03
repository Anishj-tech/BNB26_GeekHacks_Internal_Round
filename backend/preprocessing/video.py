"""Video preprocessing contract and placeholder service for TrustLayer.

Establishes the input contract for the video-first multimodal pipeline:
Uploaded video -> Preprocessing -> Video/Audio/Text Analysis -> Consistency -> Conflict -> TrustEngine -> Gemini.

Re-exports frame, audio, and transcript models so consumers have a unified import point.
"""

from typing import Optional
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

    duration: float = Field(ge=0.0, description="Video duration in seconds")
    fps: float = Field(gt=0.0, description="Frames per second")
    width: int = Field(gt=0, description="Video width in pixels")
    height: int = Field(gt=0, description="Video height in pixels")
    total_frames: Optional[int] = Field(default=None, ge=0, description="Total frame count")
    codec: Optional[str] = Field(default=None, description="Video stream codec (e.g. h264, vp9)")


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
    """Service interface for multimodal media preprocessing.

    Operates in deterministic placeholder mode until ML pipelines (ml-video, ml-audio)
    are hooked in. Clearly represents unextracted data as empty/None.
    """

    def process(
        self,
        video_path: str,
        metadata: Optional[VideoMetadata] = None,
    ) -> PreprocessingResult:
        """Preprocess a video input reference.

        Args:
            video_path: Path, URI, or reference identifier to the video.
            metadata: Optional known video metadata.

        Returns:
            Structured PreprocessingResult with unextracted assets represented as empty/None.
        """
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
        """Alias for process."""
        return self.process(video_path, metadata=metadata)


def preprocess_video(
    video_path: str,
    metadata: Optional[VideoMetadata] = None,
) -> PreprocessingResult:
    """Convenience function to preprocess a video."""
    return PreprocessingService().process(video_path, metadata=metadata)


__all__ = [
    "AudioInfo",
    "FrameInfo",
    "PreprocessingResult",
    "PreprocessingService",
    "TranscriptInfo",
    "TranscriptSegment",
    "VideoMetadata",
    "extract_audio",
    "extract_frames",
    "preprocess_video",
    "transcribe_audio",
]
