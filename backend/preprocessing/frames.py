"""
TrustLayer - Frame Sampling Module
Responsible for memory-efficient frame extraction from video files,
preserving accurate frame indices and timestamps for temporal forensic localization.
"""

from dataclasses import dataclass
from typing import Generator, List, Optional
import cv2
import numpy as np

from backend.preprocessing.video import get_video_metadata, VideoMetadata


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
    """
    Extracts frames from video files at controlled intervals without loading
    the full video into memory.
    """

    def __init__(self, default_sample_fps: float = 1.0, max_frames: int = 30):
        """
        :param default_sample_fps: Desired sampling rate (e.g., 1.0 = 1 frame per second).
        :param max_frames: Maximum number of frames to sample to bound memory and CPU usage.
        """
        self.default_sample_fps = default_sample_fps
        self.max_frames = max_frames

    def iter_frames(
        self,
        video_path: str,
        sample_fps: Optional[float] = None,
        max_frames: Optional[int] = None,
    ) -> Generator[FrameData, None, None]:
        """
        Generator yielding FrameData sequentially to minimize peak RAM consumption.
        """
        target_fps = sample_fps if sample_fps is not None else self.default_sample_fps
        limit_frames = max_frames if max_frames is not None else self.max_frames

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

            # If total expected sampled frames exceed limit, adjust step
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
        """
        Collects sampled frames into a list.
        """
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
