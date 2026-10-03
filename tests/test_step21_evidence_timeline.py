"""Step 21 focused test suite: Evidence-driven investigation timeline.

Tests:
A. Suspicious video evidence creates a timeline item with its real time range
B. Suspicious audio evidence creates a timeline item with its real time range
C. Suspicious SyncNet evidence creates a timeline item with label and high severity
D. Normal evidence does not create a suspicious timeline item
E. Missing time_range does not invent timestamps
F. Malformed time ranges are safely ignored without causing HTTP 500
G. Timeline items are chronologically sorted by start time
H. Whisper transcript timeline behavior remains valid (informational entries)
I. Existing no-file investigation behavior remains compatible
"""

import math
import os
import sys
from unittest.mock import patch
from fastapi.testclient import TestClient

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.analysis.evidence import Evidence, TimeRange, TimelineItem
from backend.models.video_detector import VideoDetector
from backend.api.routes.investigation import build_investigation_timeline


def run_tests():
    print("=== Test Suite: Step 21 Evidence-Driven Timeline ===")

    client = TestClient(app)

    # -------------------------------------------------------------------------
    # A. Suspicious video evidence creates a timeline item with its real time range
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": 0.88,
                "uncertainty": 0.10,
                "direction": "suspicious",
                "time_range": {"start": 1.5, "end": 3.5},
                "status": "success",
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {"status": "unavailable"},
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_vid_timeline.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            vid_items = [t for t in data["timeline"] if "visual" in t["label"].lower()]
            assert len(vid_items) == 1, f"Expected 1 visual timeline item, got {len(vid_items)}"
            assert abs(vid_items[0]["start"] - 1.50) < 1e-2
            assert abs(vid_items[0]["end"] - 3.50) < 1e-2
            assert vid_items[0]["label"] == "Visual synthetic signal"
            assert vid_items[0]["severity"] == "high"
    print("A. Suspicious video creates timeline item with real time range: PASSED")

    # -------------------------------------------------------------------------
    # B. Suspicious audio evidence creates a timeline item with its real time range
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.20,
                "direction": "authentic",
                "time_range": {"start": 0.0, "end": 5.0},
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.82,
                    "confidence": 0.90,
                    "status": "suspicious",
                    "time_ranges": [{"start": 2.0, "end": 4.0}],
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_audio_timeline.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            audio_items = [t for t in data["timeline"] if "voice" in t["label"].lower() or "audio" in t["label"].lower()]
            assert len(audio_items) == 1, f"Expected 1 audio timeline item, got {len(audio_items)}"
            assert abs(audio_items[0]["start"] - 2.00) < 1e-2
            assert abs(audio_items[0]["end"] - 4.00) < 1e-2
            assert audio_items[0]["label"] == "Synthetic voice signal"
            assert audio_items[0]["severity"] == "high"
    print("B. Suspicious audio creates timeline item with real time range: PASSED")

    # -------------------------------------------------------------------------
    # C. Suspicious SyncNet evidence creates a timeline item
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {"modality": "video", "score": 0.10, "direction": "authentic"}
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {"status": "unavailable"},
                "transcription": {"status": "unavailable"},
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.25,  # suspicious (< 0.50)
                    "time_ranges": [{"start": 0.80, "end": 2.20}],
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_sync_timeline.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            sync_items = [t for t in data["timeline"] if "synchronization" in t["label"].lower()]
            assert len(sync_items) == 1, f"Expected 1 sync timeline item, got {len(sync_items)}"
            assert abs(sync_items[0]["start"] - 0.80) < 1e-2
            assert abs(sync_items[0]["end"] - 2.20) < 1e-2
            assert sync_items[0]["label"] == "Audio-video synchronization anomaly"
            assert sync_items[0]["severity"] == "high"
    print("C. Suspicious SyncNet evidence creates a timeline item: PASSED")

    # -------------------------------------------------------------------------
    # D. Normal evidence does not create a suspicious timeline item
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.15,
                "uncertainty": 0.10,
                "direction": "authentic",
                "time_range": {"start": 0.0, "end": 6.0},
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.10,
                    "confidence": 0.85,
                    "status": "normal",
                    "time_ranges": [{"start": 0.0, "end": 6.0}],
                },
                "transcription": {"status": "unavailable"},
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.95,  # normal sync
                    "time_ranges": [{"start": 0.0, "end": 6.0}],
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_norm_timeline.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            susp_items = [t for t in data["timeline"] if t["severity"] in ("high", "medium")]
            assert len(susp_items) == 0, f"Expected 0 suspicious timeline items for authentic media, got {len(susp_items)}"
    print("D. Normal evidence does not create suspicious timeline items: PASSED")

    # -------------------------------------------------------------------------
    # E. Missing time_range does not invent timestamps
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.85,
                "direction": "suspicious",
                "time_range": None,  # no time range
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.80,
                    "status": "suspicious",
                    "time_ranges": [],  # empty ranges
                    "time_range": None,
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_no_tr.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            # Missing time range must not fabricate timestamps
            assert len(data["timeline"]) == 0, f"Expected empty timeline when time ranges missing, got {data['timeline']}"
    print("E. Missing time_range does not invent timestamps: PASSED")

    # -------------------------------------------------------------------------
    # F. Malformed time ranges are safely ignored
    # -------------------------------------------------------------------------
    # Unit test build_investigation_timeline directly with invalid ranges
    malformed_evidences = [
        Evidence(
            modality="video",
            signal="visual_synthetic",
            score=0.85,
            confidence=0.90,
            status="suspicious",
            time_range=TimeRange(start=-1.0, end=3.0),  # negative start
        ),
        Evidence(
            modality="audio",
            signal="synthetic_voice",
            score=0.85,
            confidence=0.90,
            status="suspicious",
            time_range=TimeRange(start=4.0, end=2.0),  # end < start
        ),
        Evidence(
            modality="video",
            signal="visual_synthetic",
            score=0.85,
            confidence=0.90,
            status="suspicious",
            time_range=TimeRange(start=float("nan"), end=3.0),  # NaN
        ),
        Evidence(
            modality="video",
            signal="visual_synthetic",
            score=0.85,
            confidence=0.90,
            status="suspicious",
            time_range=TimeRange(start=1.0, end=float("inf")),  # Inf
        ),
        Evidence(
            modality="video",
            signal="visual_synthetic",
            score=0.85,
            confidence=0.90,
            status="suspicious",
            time_range=TimeRange(start=1.0, end=3.0),  # valid
        ),
    ]

    safe_tl = build_investigation_timeline(evidence=malformed_evidences)
    assert len(safe_tl) == 1, f"Expected only 1 valid timeline item, got {len(safe_tl)}"
    assert safe_tl[0].start == 1.0
    assert safe_tl[0].end == 3.0

    # Also test via endpoint with malformed intervals
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.85,
                "direction": "suspicious",
                "time_range": {"start": -5.0, "end": 2.0},  # negative
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {"synthetic_score": 0.80, "status": "suspicious", "time_ranges": [{"start": 5.0, "end": 1.0}]},
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_malformed.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200  # does not cause HTTP 500
            data = res.json()
            assert len(data["timeline"]) == 0
    print("F. Malformed time ranges are safely ignored: PASSED")

    # -------------------------------------------------------------------------
    # G. Timeline is chronologically sorted
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            # Video at start=3.0
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.88,
                "direction": "suspicious",
                "time_range": {"start": 3.0, "end": 4.5},
            }
            # Audio at start=1.5, SyncNet at start=0.5, Whisper at start=2.0
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.85,
                    "status": "suspicious",
                    "time_ranges": [{"start": 1.5, "end": 2.8}],
                },
                "transcription": {
                    "status": "success",
                    "text": "Chronological test speech.",
                    "segments": [{"start": 2.0, "end": 3.2, "text": "Chronological test speech."}],
                },
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.20,
                    "time_ranges": [{"start": 0.5, "end": 1.2}],
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_sorted.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            tl = res.json()["timeline"]
            assert len(tl) == 4
            starts = [t["start"] for t in tl]
            assert starts == sorted(starts), f"Timeline must be chronologically sorted by start time: {starts}"
            assert abs(tl[0]["start"] - 0.5) < 1e-2  # SyncNet first
            assert abs(tl[1]["start"] - 1.5) < 1e-2  # Audio second
            assert abs(tl[2]["start"] - 2.0) < 1e-2  # Whisper third
            assert abs(tl[3]["start"] - 3.0) < 1e-2  # Video fourth
    print("G. Timeline is chronologically sorted: PASSED")

    # -------------------------------------------------------------------------
    # H. Whisper transcript timeline behavior remains valid
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {"modality": "video", "score": 0.10, "direction": "authentic"}
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {"status": "unavailable"},
                "transcription": {
                    "status": "success",
                    "text": "Speaker identification in progress.",
                    "segments": [
                        {"start": 0.25, "end": 1.75, "text": "Speaker identification"},
                        {"start": 2.10, "end": 3.80, "text": "in progress."},
                    ],
                },
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_transcript.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            tl = res.json()["timeline"]
            assert len(tl) == 2
            assert all(t["severity"] == "info" for t in tl)
            assert "transcript" in tl[0]["label"].lower()
            assert abs(tl[0]["start"] - 0.25) < 1e-2
            assert abs(tl[1]["start"] - 2.10) < 1e-2
    print("H. Whisper transcript timeline behavior remains valid: PASSED")

    # -------------------------------------------------------------------------
    # I. Existing no-file investigation behavior remains compatible
    # -------------------------------------------------------------------------
    res_nf = client.post("/investigations")
    assert res_nf.status_code == 200
    data_nf = res_nf.json()
    assert len(data_nf["timeline"]) == 1
    assert data_nf["timeline"][0]["label"] == "Detected facial artifact"
    assert data_nf["timeline"][0]["start"] == 1.2
    assert data_nf["timeline"][0]["end"] == 3.8
    assert data_nf["timeline"][0]["severity"] == "high"

    res_json = client.post("/investigations", json={"investigation_id": "step21_compat"})
    assert res_json.status_code == 200
    assert len(res_json.json()["timeline"]) == 1
    print("I. Existing no-file investigation behavior remains compatible: PASSED")

    print("\n*** ALL STEP 21 FOCUSED TESTS PASSED! ***")


def test_step21():
    run_tests()


if __name__ == "__main__":
    run_tests()
