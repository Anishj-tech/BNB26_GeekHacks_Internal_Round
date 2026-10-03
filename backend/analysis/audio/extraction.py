"""Audio extraction module for TrustLayer.

Handles extracting audio tracks from input video files, converting formats,
and standardizing sample rates/channels for downstream ML analysis.
"""

import json
import os
import shutil
import subprocess
import tempfile
from typing import Any, Dict, Optional, Union


class AudioExtractionError(RuntimeError):
    """Raised when audio extraction cannot be performed or fails."""
    pass


class VideoNotFoundError(FileNotFoundError):
    """Raised when the specified video file does not exist."""
    pass


class FFmpegNotFoundError(AudioExtractionError):
    """Raised when ffmpeg or ffprobe executable is not available on PATH."""
    pass


class NoAudioStreamError(AudioExtractionError):
    """Raised when the input video file contains no audio stream."""
    pass


def _check_binary_available(binary_name: str) -> str:
    """Verify that a binary executable exists on system PATH."""
    path = shutil.which(binary_name)
    if not path:
        raise FFmpegNotFoundError(
            f"'{binary_name}' was not found on system PATH. Please ensure FFmpeg is installed."
        )
    return path


def has_audio_stream(video_path: str) -> bool:
    """Check whether a video file contains at least one audio stream using ffprobe.

    Args:
        video_path: Path to the target video file.

    Returns:
        True if at least one audio stream exists, False otherwise.
    """
    ffprobe_bin = _check_binary_available("ffprobe")
    probe_cmd = [
        ffprobe_bin,
        "-v", "error",
        "-select_streams", "a",
        "-show_entries", "stream=codec_type",
        "-of", "json",
        video_path,
    ]
    try:
        proc = subprocess.run(
            probe_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        data = json.loads(proc.stdout or "{}")
        streams = data.get("streams", [])
        return len(streams) > 0
    except subprocess.SubprocessError:
        return False
    except json.JSONDecodeError:
        return False


def extract_audio_from_video(
    video_path: str,
    output_path: Optional[str] = None,
    target_sr: int = 16000,
    mono: bool = True,
) -> Union[str, Dict[str, Any]]:
    """Extract and standardize audio from a video file into a 16kHz mono WAV file.

    Args:
        video_path: Absolute or relative path to the input video.
        output_path: Optional destination path for extracted WAV.
                     If None, creates a safe temporary file (.wav).
        target_sr: Target audio sampling rate in Hz (default: 16000).
        mono: Whether to downmix multi-channel audio to mono (default: True).

    Returns:
        Dict containing:
            - audio_path: str (path to extracted WAV file)
            - sample_rate: int
            - channels: int

    Raises:
        VideoNotFoundError: If the input video path does not exist or is not a file.
        FFmpegNotFoundError: If ffmpeg or ffprobe executable is not found in PATH.
        NoAudioStreamError: If the input video does not contain any audio stream.
        AudioExtractionError: If ffmpeg fails during extraction.
    """
    if not os.path.exists(video_path) or not os.path.isfile(video_path):
        raise VideoNotFoundError(f"Input video file does not exist: {video_path}")

    ffmpeg_bin = _check_binary_available("ffmpeg")
    _check_binary_available("ffprobe")

    if not has_audio_stream(video_path):
        raise NoAudioStreamError(
            f"Input video contains no detectable audio stream: {video_path}"
        )

    if output_path is None:
        video_base = os.path.splitext(os.path.basename(video_path))[0]
        temp_dir = tempfile.gettempdir()
        output_path = os.path.join(temp_dir, f"trustlayer_audio_{video_base}.wav")
    else:
        out_dir = os.path.dirname(output_path)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)

    channels = 1 if mono else 2
    cmd = [
        ffmpeg_bin,
        "-y",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", str(target_sr),
        "-ac", str(channels),
        output_path,
    ]

    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
    except Exception as exc:
        raise AudioExtractionError(
            f"Failed to execute FFmpeg process: {exc}"
        ) from exc

    if result.returncode != 0:
        raise AudioExtractionError(
            f"FFmpeg extraction failed with exit code {result.returncode}: {result.stderr.strip()}"
        )

    if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
        raise AudioExtractionError(
            f"FFmpeg completed but output audio file is missing or empty: {output_path}"
        )

    return {
        "audio_path": os.path.abspath(output_path),
        "sample_rate": target_sr,
        "channels": channels,
    }
