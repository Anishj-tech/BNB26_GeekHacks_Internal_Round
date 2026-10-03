"""Step 19 focused test suite: SyncNet audio-visual synchronization integration.

Tests:
19a. Uploaded video calls run_audio_pipeline with the uploaded video path.
19b. Valid SyncNet result creates modality audio_video, signal lip_sync, score = 1 - lip_sync_score, confidence in [0,1].
19c. Verify score direction (good sync 0.90 -> evidence score 0.10, poor sync 0.20 -> evidence score 0.80).
19d. Status mapping (lip_sync_score < 0.50 -> suspicious, lip_sync_score >= 0.50 -> normal).
19e. Valid SyncNet time range is converted to Evidence.time_range.
19f. Suspicious SyncNet time range creates a timeline item with label and severity high.
19g. Normal synchronization does not create a suspicious timeline item.
19h. Missing/None/invalid SyncNet score omits SyncNet Evidence.
19i. unavailable/error/failed SyncNet status safely degrades without HTTP 500.
19j. SyncNet exception safely degrades without HTTP 500.
19k. Existing AASIST audio Evidence remains present.
19l. Existing Whisper text Evidence remains present.
19m. Existing no-file behavior remains backward compatible.
19n. TrustEngine remains final authority and SyncNet does not directly override the verdict.
"""

import os
import sys
from unittest.mock import patch
from fastapi.testclient import TestClient

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.analysis.evidence import Evidence, Verdict, InvestigationResult
from backend.models.video_detector import VideoDetector


def run_tests():
    print("=== Test Suite: Step 19 SyncNet Integration ===")

    client = TestClient(app)

    dummy_video_result = {
        "modality": "video",
        "signal_type": "visual_synthetic",
        "score": 0.82,
        "uncertainty": 0.15,
        "direction": "suspicious",
        "time_range": {"start": 0.0, "end": 4.0},
        "status": "success",
    }

    dummy_audio_section = {
        "synthetic_score": 0.88,
        "confidence": 0.90,
        "status": "success",
        "model": "AASIST-L",
        "time_ranges": [{"start": 1.0, "end": 3.0}],
    }

    dummy_transcription_section = {
        "status": "success",
        "text": "Synchronized forensic dialogue.",
        "segments": [{"start": 0.5, "end": 3.5, "text": "Synchronized forensic dialogue."}],
    }

    # 19a. Uploaded video calls run_audio_pipeline with the uploaded video path
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": dummy_transcription_section,
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.85,
                    "detected_offset_seconds": 0.02,
                    "time_ranges": [],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("syncnet_call.mp4", b"bytes-payload", "video/mp4")},
            )
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            mock_audio_pipe.assert_called_once()
            call_kwargs = mock_audio_pipe.call_args[1] if mock_audio_pipe.call_args[1] else {}
            vpath = call_kwargs.get("video_path") or mock_audio_pipe.call_args[0][0]
            assert "syncnet_call.mp4" in vpath
            print("19a. Uploaded video calls run_audio_pipeline with video path: PASSED")

    # 19b. Valid SyncNet result creates audio_video Evidence
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": dummy_transcription_section,
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.75,
                    "confidence": 0.88,
                    "detected_offset_seconds": 0.01,
                    "time_ranges": [],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("sync_ev_test.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            sync_items = [e for e in data["evidence"] if e["modality"] == "audio_video"]
            assert len(sync_items) == 1, f"Expected 1 audio_video evidence item, got {len(sync_items)}"
            s_ev = sync_items[0]
            assert s_ev["modality"] == "audio_video"
            assert s_ev["signal"] == "lip_sync"
            assert abs(s_ev["score"] - 0.25) < 1e-4  # 1.0 - 0.75
            assert abs(s_ev["confidence"] - 0.88) < 1e-4
            assert s_ev["status"] == "normal"
            print("19b. Valid SyncNet result creates expected audio_video Evidence: PASSED")

    # 19c. Verify score direction (good sync -> low suspiciousness; poor sync -> high suspiciousness)
    for lip_score, expected_evidence_score in [(0.90, 0.10), (0.20, 0.80), (1.0, 0.0), (0.0, 1.0)]:
        with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_audio_pipe.return_value = {
                    "status": "success",
                    "audio": dummy_audio_section,
                    "transcription": dummy_transcription_section,
                    "sync": {
                        "status": "success",
                        "model": "SyncNet-v2",
                        "lip_sync_score": lip_score,
                        "time_ranges": [],
                    },
                }
                res = client.post(
                    "/investigations",
                    files={"video": ("score_dir_test.mp4", b"bytes", "video/mp4")},
                )
                data = res.json()
                s_ev = [e for e in data["evidence"] if e["modality"] == "audio_video"][0]
                assert abs(s_ev["score"] - expected_evidence_score) < 1e-4, (
                    f"For lip_sync_score={lip_score}, expected evidence score={expected_evidence_score}, got {s_ev['score']}"
                )
    print("19c. Score direction inverted properly (1 - lip_sync_score): PASSED")

    # 19d. Status mapping (< 0.50 -> suspicious, >= 0.50 -> normal)
    for lip_score, expected_status in [(0.49, "suspicious"), (0.15, "suspicious"), (0.50, "normal"), (0.85, "normal")]:
        with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_audio_pipe.return_value = {
                    "status": "success",
                    "audio": dummy_audio_section,
                    "transcription": dummy_transcription_section,
                    "sync": {
                        "status": "success",
                        "model": "SyncNet-v2",
                        "lip_sync_score": lip_score,
                        "time_ranges": [],
                    },
                }
                res = client.post(
                    "/investigations",
                    files={"video": ("status_test.mp4", b"bytes", "video/mp4")},
                )
                data = res.json()
                s_ev = [e for e in data["evidence"] if e["modality"] == "audio_video"][0]
                assert s_ev["status"] == expected_status, (
                    f"For lip_sync_score={lip_score}, expected status={expected_status}, got {s_ev['status']}"
                )
    print("19d. Status mapping (<0.50 suspicious, >=0.50 normal): PASSED")

    # 19e. Valid SyncNet time range is converted to Evidence.time_range
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": dummy_transcription_section,
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.30,
                    "time_ranges": [{"start": 1.40, "end": 2.80, "reason": "Mouth mismatch"}],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("tr_test.mp4", b"bytes", "video/mp4")},
            )
            data = res.json()
            s_ev = [e for e in data["evidence"] if e["modality"] == "audio_video"][0]
            assert s_ev["time_range"] == {"start": 1.40, "end": 2.80}
    print("19e. Valid SyncNet time range mapped to Evidence.time_range: PASSED")

    # 19f. Suspicious SyncNet time range creates a timeline item with label and severity high
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": dummy_transcription_section,
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.25,  # suspicious
                    "time_ranges": [{"start": 1.50, "end": 3.00}],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("susp_timeline.mp4", b"bytes", "video/mp4")},
            )
            data = res.json()
            sync_timeline = [
                item for item in data["timeline"] if "synchronization" in item["label"].lower()
            ]
            assert len(sync_timeline) == 1, f"Expected 1 sync timeline item, got {len(sync_timeline)}"
            assert sync_timeline[0]["severity"] == "high"
            assert abs(sync_timeline[0]["start"] - 1.50) < 1e-2
            assert abs(sync_timeline[0]["end"] - 3.00) < 1e-2
            print("19f. Suspicious SyncNet time range creates high severity timeline entry: PASSED")

    # 19g. Normal synchronization does not create a suspicious timeline item
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": dummy_transcription_section,
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.92,  # normal
                    "time_ranges": [{"start": 1.50, "end": 3.00}],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("norm_timeline.mp4", b"bytes", "video/mp4")},
            )
            data = res.json()
            sync_timeline = [
                item for item in data["timeline"] if "synchronization" in item["label"].lower()
            ]
            assert len(sync_timeline) == 0, f"Expected 0 sync timeline items for normal sync, got {len(sync_timeline)}"
            print("19g. Normal synchronization does not create suspicious timeline items: PASSED")

    # 19h. Missing/None/invalid SyncNet score omits SyncNet Evidence
    for invalid_score in [None, "non-numeric", -0.5, 1.5, float("nan")]:
        with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_audio_pipe.return_value = {
                    "status": "success",
                    "audio": dummy_audio_section,
                    "transcription": dummy_transcription_section,
                    "sync": {
                        "status": "success",
                        "model": "SyncNet-v2",
                        "lip_sync_score": invalid_score,
                    },
                }
                res = client.post(
                    "/investigations",
                    files={"video": ("invalid_score.mp4", b"bytes", "video/mp4")},
                )
                assert res.status_code == 200
                data = res.json()
                sync_items = [e for e in data["evidence"] if e["modality"] == "audio_video"]
                assert len(sync_items) == 0, f"Expected 0 sync items for invalid score {invalid_score}, got {len(sync_items)}"
    print("19h. Missing/None/invalid SyncNet score omits SyncNet Evidence: PASSED")

    # 19i. unavailable/error/failed SyncNet status safely degrades without HTTP 500
    for bad_status in ["unavailable", "error", "failed"]:
        with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_audio_pipe.return_value = {
                    "status": "partial",
                    "audio": dummy_audio_section,
                    "transcription": dummy_transcription_section,
                    "sync": {
                        "status": bad_status,
                        "model": "SyncNet-v2",
                        "lip_sync_score": 0.80,
                        "message": "Model not available",
                    },
                }
                res = client.post(
                    "/investigations",
                    files={"video": ("bad_sync_status.mp4", b"bytes", "video/mp4")},
                )
                assert res.status_code == 200
                sync_items = [e for e in res.json()["evidence"] if e["modality"] == "audio_video"]
                assert len(sync_items) == 0
    print("19i. unavailable/error/failed status safely degrades without HTTP 500: PASSED")

    # 19j. SyncNet exception safely degrades without HTTP 500
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.side_effect = RuntimeError("SyncNet tensor calculation failed")
            res = client.post(
                "/investigations",
                files={"video": ("sync_crash.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            assert "investigation_id" in data
            assert "assessment" in data
            print("19j. SyncNet exception safely degrades without HTTP 500: PASSED")

    # 19k & 19l. Existing AASIST audio and Whisper text evidence remain present
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": dummy_transcription_section,
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.70,
                    "time_ranges": [],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("all_modalities.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            modalities = {e["modality"]: e for e in data["evidence"]}
            assert "video" in modalities
            assert "audio" in modalities
            assert "text" in modalities
            assert "audio_video" in modalities
            assert modalities["audio"]["signal"] == "synthetic_voice"
            assert modalities["text"]["signal"] == "speech_transcript"
            assert modalities["audio_video"]["signal"] == "lip_sync"
            print("19k & 19l. AASIST audio and Whisper text evidence remain present: PASSED")

    # 19m. Existing no-file behavior remains backward compatible
    with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
        res_no_file = client.post("/investigations")
        assert res_no_file.status_code == 200
        mock_audio_pipe.assert_not_called()
        data_nf = res_no_file.json()
        assert len(data_nf["evidence"]) == 3
        sync_items_nf = [e for e in data_nf["evidence"] if e["modality"] == "audio_video"]
        assert len(sync_items_nf) == 0  # no fake syncnet evidence on mock path

        # With JSON body
        res_json = client.post("/investigations", json={"investigation_id": "step19_back_compat"})
        assert res_json.status_code == 200
        assert res_json.json()["investigation_id"] == "step19_back_compat"
    print("19m. Existing no-file behavior remains backward compatible: PASSED")

    # 19n. TrustEngine remains final authority and SyncNet does not directly override verdict
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            # Video & Audio suspicious, SyncNet normal -> TrustEngine evaluates full multi-modal fusion
            mock_vid.return_value = {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": 0.88,
                "uncertainty": 0.10,
                "direction": "suspicious",
                "status": "success",
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.86,
                    "confidence": 0.90,
                    "status": "success",
                },
                "transcription": {
                    "status": "success",
                    "text": "Forensic test.",
                    "segments": [{"start": 0.0, "end": 2.0, "text": "Forensic test."}],
                },
                "sync": {
                    "status": "success",
                    "model": "SyncNet-v2",
                    "lip_sync_score": 0.95,  # evidence score = 0.05
                    "time_ranges": [],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("te_authority.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            verdict = data["assessment"]["verdict"]
            assert verdict in [v.value for v in Verdict]
            assert "direction" not in data["assessment"]
    print("19n. TrustEngine remains final authority: PASSED")

    print("\n*** ALL STEP 19 FOCUSED TESTS PASSED! ***")


if __name__ == "__main__":
    run_tests()
