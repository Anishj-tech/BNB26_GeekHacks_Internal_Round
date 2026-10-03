"""
TrustLayer - Video Preprocessing Module
Responsible for validating video input, verifying container integrity,
and extracting video stream metadata (FPS, duration, resolution, frame count)
using OpenCV and FFmpeg capabilities.
"""

import os
from dataclasses import dataclass, asdict
from typing import Optional, Tuple
import cv2


@dataclass
class VideoMetadata:
    filepath: str
    duration_seconds: float
    fps: float
    frame_count: int
    width: int
    height: int
    is_valid: bool
    error_message: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


class VideoPreprocessor:
    """
    Validates input video files and extracts essential stream metadata
    prior to downstream frame sampling and forensic analysis.
    """

    SUPPORTED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}

    def __init__(self, max_duration_seconds: float = 300.0):
        self.max_duration_seconds = max_duration_seconds

    def validate_file(self, video_path: str) -> Tuple[bool, Optional[str]]:
        """
        Validates that the file exists, is non-empty, and has a supported extension.
        """
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
            return False, f"Unsupported video extension: '{ext}'. Supported: {', '.join(self.SUPPORTED_EXTENSIONS)}"

        return True, None

    def extract_metadata(self, video_path: str) -> VideoMetadata:
        """
        Opens the video container using OpenCV, validates readable stream,
        and extracts video stream properties.
        """
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

            # Check if at least one frame can be read
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

            # If frame count or fps reported as 0, calculate duration safely
            if fps > 0 and frame_count > 0:
                duration_seconds = frame_count / fps
            elif fps > 0:
                # Count remaining frames manually if metadata is incomplete
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


# Convenience functions
_preprocessor = VideoPreprocessor()


def validate_video(video_path: str) -> Tuple[bool, Optional[str]]:
    """Convenience helper to validate video file integrity."""
    metadata = _preprocessor.extract_metadata(video_path)
    return metadata.is_valid, metadata.error_message


def get_video_metadata(video_path: str) -> VideoMetadata:
    """Convenience helper to extract video metadata."""
    return _preprocessor.extract_metadata(video_path)
