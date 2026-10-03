"""
TrustLayer - Video / Visual ML Module Tests
Validates video preprocessing, frame extraction, timestamp preservation,
invalid input handling, and structured evidence generation adhering to the PRD.
"""

import os
import tempfile
import pytest
import numpy as np
import cv2

from backend.preprocessing.video import (
    validate_video,
    get_video_metadata,
    VideoPreprocessor,
    VideoMetadata,
)
from backend.preprocessing.frames import (
    sample_frames,
    iter_frames,
    FrameExtractor,
    FrameData,
)
from backend.models.face_consistency import (
    detect_face,
    analyze_face_consistency,
    FaceConsistencyResult,
)
from backend.models.video_detector import (
    analyze_video,
    VideoDetector,
    FrameScore,
)


@pytest.fixture
def synthetic_video_path():
    """Creates a temporary 2-second, 10 FPS test video (20 frames)."""
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        temp_path = f.name

    fps = 10.0
    width, height = 320, 240
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(temp_path, fourcc, fps, (width, height))

    for i in range(20):
        # Generate distinct frame with visual content
        frame = np.full((height, width, 3), (i * 12) % 255, dtype=np.uint8)
        # Draw dynamic shapes
        cv2.circle(frame, (50 + i * 8, 120), 30, (0, 255, 0), -1)
        out.write(frame)

    out.release()
    yield temp_path

    if os.path.exists(temp_path):
        os.remove(temp_path)


@pytest.fixture
def invalid_video_path():
    """Creates an empty 0-byte file with video extension."""
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        temp_path = f.name

    yield temp_path

    if os.path.exists(temp_path):
        os.remove(temp_path)


# ==========================================================
# 1. Video Metadata Extraction Tests
# ==========================================================
def test_video_metadata_extraction(synthetic_video_path):
    metadata = get_video_metadata(synthetic_video_path)

    assert metadata.is_valid is True
    assert metadata.error_message is None
    assert metadata.width == 320
    assert metadata.height == 240
    assert metadata.fps == 10.0
    assert metadata.frame_count == 20
    assert abs(metadata.duration_seconds - 2.0) < 0.2


def test_validate_video(synthetic_video_path):
    is_valid, error = validate_video(synthetic_video_path)
    assert is_valid is True
    assert error is None


# ==========================================================
# 2. Frame Sampling & Timestamp Mapping Tests
# ==========================================================
def test_frame_sampling(synthetic_video_path):
    # Sample at 2 fps from a 2s video (should yield ~4 frames)
    frames = sample_frames(synthetic_video_path, sample_fps=2.0, max_frames=10)

    assert len(frames) >= 2
    assert len(frames) <= 10
    for f in frames:
        assert isinstance(f, FrameData)
        assert f.frame.shape == (240, 320, 3)
        assert f.frame_index >= 0
        assert f.timestamp >= 0.0


def test_timestamp_mapping(synthetic_video_path):
    frames = sample_frames(synthetic_video_path, sample_fps=5.0)

    # Verify timestamps are monotonically increasing and accurately calculated
    prev_t = -1.0
    for f in frames:
        expected_t = round(f.frame_index / 10.0, 3)
        assert abs(f.timestamp - expected_t) < 0.01
        assert f.timestamp > prev_t
        prev_t = f.timestamp


# ==========================================================
# 3. Invalid Video Handling Tests
# ==========================================================
def test_invalid_video_nonexistent():
    metadata = get_video_metadata("/path/to/nonexistent_video_12345.mp4")
    assert metadata.is_valid is False
    assert "not found" in metadata.error_message.lower()


def test_invalid_video_empty(invalid_video_path):
    metadata = get_video_metadata(invalid_video_path)
    assert metadata.is_valid is False
    assert "empty" in metadata.error_message.lower()


def test_unsupported_extension():
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as f:
        f.write(b"not a video")
        temp_path = f.name

    try:
        metadata = get_video_metadata(temp_path)
        assert metadata.is_valid is False
        assert "unsupported" in metadata.error_message.lower()
    finally:
        os.remove(temp_path)


# ==========================================================
# 4. Face Detection & Consistency Module Tests
# ==========================================================
def test_face_consistency_no_face():
    # Synthetic frames have no faces
    synthetic_frames = [
        FrameData(frame_index=0, timestamp=0.0, frame=np.zeros((200, 200, 3), dtype=np.uint8)),
        FrameData(frame_index=1, timestamp=1.0, frame=np.ones((200, 200, 3), dtype=np.uint8) * 100),
    ]
    result: FaceConsistencyResult = analyze_face_consistency(synthetic_frames)
    assert result.face_detected is False
    assert result.consistency_score is None
    assert "no face detected" in result.evidence.lower()


# ==========================================================
# 5. Detector Interface & Structured Result Format Tests
# ==========================================================
def test_analyze_video_structured_format(synthetic_video_path):
    # Test analyze_video with max_frames=2 for fast execution
    result = analyze_video(synthetic_video_path, sample_fps=1.0, max_frames=2)

    # PRD Evidence Model required fields:
    assert "modality" in result
    assert result["modality"] == "video"
    assert "signal_type" in result
    assert result["signal_type"] == "visual_synthetic"
    assert "score" in result
    assert "direction" in result
    assert result["direction"] in ["suspicious", "authentic", "inconclusive"]
    assert "uncertainty" in result
    assert 0.0 <= result["uncertainty"] <= 1.0
    assert "time_range" in result
    assert "evidence" in result
    assert isinstance(result["evidence"], str)

    # Pipeline status
    assert result["status"] == "success"
    assert result["frames_analyzed"] >= 1
    assert "metadata" in result


def test_analyze_video_invalid_input():
    result = analyze_video("/path/to/missing_video.mp4")

    assert result["modality"] == "video"
    assert result["signal_type"] == "visual_synthetic"
    assert result["score"] is None
    assert result["direction"] == "inconclusive"
    assert result["uncertainty"] == 1.0
    assert result["status"] == "insufficient_evidence"
    assert "unavailable" in result["evidence"].lower() or "failed" in result["evidence"].lower()
