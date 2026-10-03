"""Step 17 focused test suite: AASIST audio pipeline integration.

Tests:
8a. Uploaded video calls real audio pipeline
8b & 8c. AASIST audio result mapped to Evidence (modality, signal, score, confidence)
8d. Suspicious / normal / inconclusive status mapping semantics
8e. time_ranges mapped correctly when available and None when empty
8f. synthetic_score=None safely omits audio Evidence
8g. audio unavailable/error safely degrades without HTTP 500
8h. no-file request remains backward compatible
8i. TrustEngine remains the final verdict authority
"""

import os
import sys

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from unittest.mock import patch
from fastapi.testclient import TestClient
from backend.main import app
from backend.analysis.evidence import Evidence, Verdict, InvestigationResult
from backend.models.video_detector import VideoDetector


def run_tests():
    print("=== Test Suite: Step 17 AASIST Audio Pipeline Integration ===")

    client = TestClient(app)

    dummy_video_result = {
        "modality": "video",
        "signal_type": "visual_synthetic",
        "score": 0.80,
        "uncertainty": 0.15,
        "direction": "suspicious",
        "time_range": {"start": 0.0, "end": 3.0},
        "status": "success",
    }

    # 8a. Uploaded video calls real audio pipeline
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.77,
                    "confidence": 0.85,
                    "status": "success",
                    "model": "AASIST-L",
                    "time_ranges": [],
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }
            res = client.post(
                "/investigations",
                files={"video": ("sample_call.mp4", b"fake-bytes", "video/mp4")},
            )
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            mock_audio_pipe.assert_called_once()
            call_kwargs = mock_audio_pipe.call_args[1] if mock_audio_pipe.call_args[1] else {}
            vpath = call_kwargs.get("video_path") or mock_audio_pipe.call_args[0][0]
            assert "sample_call.mp4" in vpath
            print("8a. Uploaded video calls real audio pipeline: PASSED")

    # 8b & 8c. AASIST audio result correctly mapped to Evidence; synthetic_score and confidence preserved
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.8765,
                    "confidence": 0.9123,
                    "status": "success",
                    "model": "AASIST-L",
                    "time_ranges": [],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("mapping_test.mp4", b"fake-bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            audio_items = [e for e in data["evidence"] if e["modality"] == "audio"]
            assert len(audio_items) == 1, f"Expected 1 audio item, got {len(audio_items)}"
            a_ev = audio_items[0]
            assert a_ev["modality"] == "audio"
            assert a_ev["signal"] == "synthetic_voice"
            assert abs(a_ev["score"] - 0.8765) < 1e-4
            assert abs(a_ev["confidence"] - 0.9123) < 1e-4
            assert a_ev["status"] == "suspicious"  # score >= 0.5
            print("8b & 8c. AASIST audio result mapped to Evidence with score and confidence: PASSED")

    # 8d. Status mapping semantics (suspicious, normal, inconclusive)
    status_test_cases = [
        # (raw_status, score, expected_mapped_status)
        ("success", 0.85, "suspicious"),
        ("success", 0.15, "normal"),
        ("suspicious", 0.70, "suspicious"),
        ("synthetic", 0.70, "suspicious"),
        ("normal", 0.20, "normal"),
        ("authentic", 0.20, "normal"),
        ("inconclusive", 0.50, "inconclusive"),
        ("partial", 0.50, "inconclusive"),
    ]
    for raw_st, sc, expected_st in status_test_cases:
        with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_audio_pipe.return_value = {
                    "status": "success",
                    "audio": {
                        "synthetic_score": sc,
                        "confidence": 0.80,
                        "status": raw_st,
                        "model": "AASIST-L",
                        "time_ranges": [],
                    },
                }
                res = client.post(
                    "/investigations",
                    files={"video": ("status_test.mp4", b"fake-bytes", "video/mp4")},
                )
                data = res.json()
                a_ev = [e for e in data["evidence"] if e["modality"] == "audio"][0]
                assert a_ev["status"] == expected_st, f"For ({raw_st}, {sc}), expected {expected_st}, got {a_ev['status']}"
    print("8d. suspicious/normal/inconclusive status mapping: PASSED")

    # 8e. time_ranges mapping
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        # Case 1: time_ranges present
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.85,
                    "confidence": 0.90,
                    "status": "success",
                    "model": "AASIST-L",
                    "time_ranges": [{"start": 1.25, "end": 3.75}],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("tr_test.mp4", b"fake-bytes", "video/mp4")},
            )
            a_ev = [e for e in res.json()["evidence"] if e["modality"] == "audio"][0]
            assert a_ev["time_range"] == {"start": 1.25, "end": 3.75}

        # Case 2: time_ranges empty -> None
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.85,
                    "confidence": 0.90,
                    "status": "success",
                    "model": "AASIST-L",
                    "time_ranges": [],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("tr_test.mp4", b"fake-bytes", "video/mp4")},
            )
            a_ev = [e for e in res.json()["evidence"] if e["modality"] == "audio"][0]
            assert a_ev["time_range"] is None
    print("8e. time_ranges correctly mapped when available and None when empty: PASSED")

    # 8f. synthetic_score=None safely omits audio Evidence
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "partial",
                "audio": {
                    "synthetic_score": None,
                    "confidence": None,
                    "status": "unavailable",
                    "message": "No speech detected",
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("no_score.mp4", b"fake-bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            audio_items = [e for e in data["evidence"] if e["modality"] == "audio"]
            assert len(audio_items) == 0, "Audio evidence should be omitted when synthetic_score is None"
            assert len([e for e in data["evidence"] if e["modality"] == "video"]) == 1
            print("8f. synthetic_score=None safely omits audio Evidence: PASSED")

    # 8g. audio unavailable/error safely degrades without HTTP 500
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        # Case 1: status='unavailable'
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "error",
                "audio": {"status": "unavailable", "synthetic_score": None, "message": "FFmpeg error"},
            }
            res = client.post(
                "/investigations",
                files={"video": ("unavail.mp4", b"fake-bytes", "video/mp4")},
            )
            assert res.status_code == 200
            assert len([e for e in res.json()["evidence"] if e["modality"] == "audio"]) == 0

        # Case 2: exception in pipeline
        with patch("backend.api.routes.investigation.run_audio_pipeline", side_effect=RuntimeError("Audio crash")):
            res = client.post(
                "/investigations",
                files={"video": ("crash.mp4", b"fake-bytes", "video/mp4")},
            )
            assert res.status_code == 200
            assert len([e for e in res.json()["evidence"] if e["modality"] == "audio"]) == 0
    print("8g. Audio unavailable/error safely degrades without HTTP 500: PASSED")

    # 8h. no-file request remains backward compatible
    with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
        res_no_file = client.post("/investigations")
        assert res_no_file.status_code == 200
        mock_audio_pipe.assert_not_called()
        data_nf = res_no_file.json()
        assert len(data_nf["evidence"]) == 3
        assert data_nf["evidence"][1]["modality"] == "audio"
        assert data_nf["evidence"][1]["score"] == 0.85  # mock evidence

        # With JSON body
        res_json = client.post("/investigations", json={"investigation_id": "back_compat_test"})
        assert res_json.status_code == 200
        assert res_json.json()["investigation_id"] == "back_compat_test"
    print("8h. No-file request backward compatibility preserved: PASSED")

    # 8i. TrustEngine remains the final verdict authority
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            # Both high synthetic and consistent -> COORDINATED SYNTHETIC
            mock_vid.return_value = {
                "modality": "video", "signal_type": "visual_synthetic",
                "score": 0.88, "uncertainty": 0.10, "direction": "suspicious",
                "status": "success",
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.86,
                    "confidence": 0.90,
                    "status": "success",
                },
            }
            res_coord = client.post(
                "/investigations",
                files={"video": ("coord.mp4", b"bytes", "video/mp4")},
            )
            assert res_coord.status_code == 200
            data_coord = res_coord.json()
            assert data_coord["assessment"]["verdict"] == Verdict.COORDINATED_SYNTHETIC.value

            # High synthetic video, low synthetic audio -> MANIPULATED
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.10,
                    "confidence": 0.90,
                    "status": "success",
                },
            }
            res_manip = client.post(
                "/investigations",
                files={"video": ("manip.mp4", b"bytes", "video/mp4")},
            )
            assert res_manip.status_code == 200
            assert res_manip.json()["assessment"]["verdict"] == Verdict.MANIPULATED.value
    print("8i. TrustEngine remains final verdict authority: PASSED")

    print("\n*** ALL STEP 17 FOCUSED TESTS PASSED! ***")


if __name__ == "__main__":
    run_tests()
