"""TrustLayer Audio / Speech / Sync ML Module.

Exposes key functions for audio extraction, spoof detection,
speech-to-text transcription, audio-visual synchronization, and pipeline orchestration.
"""

from .extraction import extract_audio_from_video
from .spoof_detection import detect_audio_spoof
from .transcription import transcribe_audio
from .sync import check_av_sync
from .pipeline import run_audio_pipeline

__all__ = [
    "extract_audio_from_video",
    "detect_audio_spoof",
    "transcribe_audio",
    "check_av_sync",
    "run_audio_pipeline",
]
