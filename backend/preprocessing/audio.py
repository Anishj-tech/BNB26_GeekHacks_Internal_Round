"""Audio extraction and transcription contract and data models.

Provides structures and interface hooks for the ml-audio branch to integrate
FFmpeg audio extraction and Whisper transcription.
"""

from typing import Optional
from pydantic import BaseModel, Field, model_validator


class TranscriptSegment(BaseModel):
    """Timestamped segment of transcribed speech."""

    start: float = Field(ge=0.0, description="Start timestamp of the segment in seconds")
    end: float = Field(ge=0.0, description="End timestamp of the segment in seconds")
    text: str = Field(description="Transcribed text content")

    @model_validator(mode="after")
    def validate_segment_times(self) -> "TranscriptSegment":
        if self.end < self.start:
            raise ValueError(
                f"Segment end time ({self.end}) cannot be earlier than start time ({self.start})"
            )
        return self


class TranscriptInfo(BaseModel):
    """Complete speech transcription information."""

    text: Optional[str] = Field(default=None, description="Full consolidated transcript text")
    language: Optional[str] = Field(default=None, description="Detected or specified spoken language")
    segments: list[TranscriptSegment] = Field(
        default_factory=list,
        description="Chronological list of timestamped transcript segments",
    )


class AudioInfo(BaseModel):
    """Information for extracted audio stream."""

    path: Optional[str] = Field(default=None, description="Filesystem path or URI to extracted audio track (.wav)")
    sample_rate: Optional[int] = Field(default=None, gt=0, description="Audio sample rate in Hz (e.g. 16000)")
    channels: Optional[int] = Field(default=None, gt=0, description="Number of audio channels (e.g. 1 for mono)")
    duration: Optional[float] = Field(default=None, ge=0.0, description="Duration of audio in seconds")
    transcript: Optional[TranscriptInfo] = Field(default=None, description="Transcription derived from this audio track")


def extract_audio(video_path: str, output_path: Optional[str] = None) -> Optional[AudioInfo]:
    """Placeholder interface for audio track extraction.

    To be implemented by the ml-audio branch using FFmpeg.
    Currently returns None without pretending real audio was extracted.
    """
    return None


def transcribe_audio(audio_path: str) -> Optional[TranscriptInfo]:
    """Placeholder interface for speech transcription.

    To be implemented by the ml-audio branch using Whisper.
    Currently returns None without pretending real transcription was performed.
    """
    return None


__all__ = [
    "AudioInfo",
    "TranscriptInfo",
    "TranscriptSegment",
    "extract_audio",
    "transcribe_audio",
]
