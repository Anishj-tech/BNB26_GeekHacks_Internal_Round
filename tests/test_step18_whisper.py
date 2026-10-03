"""Step 18 focused test suite: faster-whisper speech transcription integration.

Tests:
18a. Uploaded video calls run_audio_pipeline with the uploaded video path.
18b. Successful transcription creates text Evidence with modality text, signal speech_transcript, score 0.50, confidence in [0,1], status normal.
18c. Transcript segments are converted into timeline entries with correct start/end and severity info.
18d. Word probabilities are converted into bounded confidence.
18e. Missing word probabilities use the neutral confidence fallback (0.50).
18f. Empty/unavailable/failed transcription does not create text Evidence.
18g. Malformed transcript segments are skipped safely.
18h. Transcription exception does not cause HTTP 500.
18i. Existing AASIST audio evidence remains present when transcription succeeds.
18j. Existing no-file behavior remains backward compatible.
18k. TrustEngine remains final authority; transcription does not directly alter the verdict.
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
    print("=== Test Suite: Step 18 faster-whisper Transcription Integration ===")

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

    # 18a. Uploaded video calls run_audio_pipeline with uploaded video path
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": {
                    "status": "success",
                    "text": "Hello world this is a test.",
                    "segments": [{"start": 0.5, "end": 2.5, "text": "Hello world this is a test."}],
                },
                "sync": {"status": "unavailable"},
            }
            res = client.post(
                "/investigations",
                files={"video": ("whisper_call_test.mp4", b"dummy-data", "video/mp4")},
            )
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            mock_audio_pipe.assert_called_once()
            call_kwargs = mock_audio_pipe.call_args[1] if mock_audio_pipe.call_args[1] else {}
            vpath = call_kwargs.get("video_path") or mock_audio_pipe.call_args[0][0]
            assert "whisper_call_test.mp4" in vpath
            print("18a. Uploaded video calls run_audio_pipeline with video path: PASSED")

    # 18b. Successful transcription creates text Evidence with correct attributes
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": {
                    "status": "success",
                    "text": "Forensic testimony verification statement.",
                    "segments": [
                        {
                            "start": 0.0,
                            "end": 3.0,
                            "text": "Forensic testimony verification statement.",
                            "words": [{"word": "Forensic", "start": 0.0, "end": 0.8, "probability": 0.94}],
                        }
                    ],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("evidence_check.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            text_items = [e for e in data["evidence"] if e["modality"] == "text"]
            assert len(text_items) == 1, f"Expected 1 text Evidence item, got {len(text_items)}"
            t_ev = text_items[0]
            assert t_ev["modality"] == "text"
            assert t_ev["signal"] == "speech_transcript"
            assert t_ev["score"] == 0.50
            assert 0.0 <= t_ev["confidence"] <= 1.0
            assert t_ev["status"] == "normal"
            assert t_ev["time_range"] is None
            print("18b. Successful transcription creates text Evidence with expected schema: PASSED")

    # 18c. Transcript segments are converted into timeline entries with correct start/end
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": {
                    "status": "success",
                    "text": "Segment one. Segment two.",
                    "segments": [
                        {"start": 1.25, "end": 2.75, "text": "Segment one."},
                        {"start": 3.10, "end": 4.80, "text": "Segment two."},
                    ],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("timeline_test.mp4", b"bytes", "video/mp4")},
            )
            data = res.json()
            timeline = data["timeline"]
            transcript_timeline = [
                item for item in timeline if "transcript" in item["label"].lower() or item["severity"] == "info"
            ]
            assert len(transcript_timeline) == 2, f"Expected 2 transcript timeline items, got {len(transcript_timeline)}"
            assert abs(transcript_timeline[0]["start"] - 1.25) < 1e-2
            assert abs(transcript_timeline[0]["end"] - 2.75) < 1e-2
            assert transcript_timeline[0]["severity"] == "info"
            assert abs(transcript_timeline[1]["start"] - 3.10) < 1e-2
            assert abs(transcript_timeline[1]["end"] - 4.80) < 1e-2
            assert transcript_timeline[1]["severity"] == "info"
            print("18c. Transcript segments converted into timeline entries with start/end/info: PASSED")

    # 18d. Word probabilities are converted into bounded confidence
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": {
                    "status": "success",
                    "text": "High confidence speech.",
                    "segments": [
                        {
                            "start": 0.0,
                            "end": 2.0,
                            "text": "High confidence speech.",
                            "words": [
                                {"word": "High", "probability": 0.90},
                                {"word": "confidence", "probability": 0.85},
                                {"word": "speech", "probability": 0.95},
                            ],
                        }
                    ],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("word_prob_test.mp4", b"bytes", "video/mp4")},
            )
            data = res.json()
            t_ev = [e for e in data["evidence"] if e["modality"] == "text"][0]
            # Expected avg = (0.90 + 0.85 + 0.95) / 3 = 0.90
            assert abs(t_ev["confidence"] - 0.90) < 1e-3, f"Expected ~0.90, got {t_ev['confidence']}"
            print("18d. Word probabilities converted into bounded confidence: PASSED")

    # 18e. Missing word probabilities use the neutral confidence fallback (0.50)
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": {
                    "status": "success",
                    "text": "Plain text with no word probabilities.",
                    "segments": [
                        {"start": 0.0, "end": 2.0, "text": "Plain text with no word probabilities."}
                    ],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("neutral_conf_test.mp4", b"bytes", "video/mp4")},
            )
            data = res.json()
            t_ev = [e for e in data["evidence"] if e["modality"] == "text"][0]
            assert t_ev["confidence"] == 0.50
            print("18e. Missing word probabilities use neutral confidence fallback: PASSED")

    # 18f. Empty/unavailable/failed transcription does not create text Evidence
    for bad_status, text_val, segs in [
        ("unavailable", "Some text but status unavailable", []),
        ("error", "Error text", []),
        ("failed", "Failed text", []),
        ("success", "", []),  # empty text and empty segments
        ("success", "   ", []),  # whitespace only
    ]:
        with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_audio_pipe.return_value = {
                    "status": "partial",
                    "audio": dummy_audio_section,
                    "transcription": {
                        "status": bad_status,
                        "text": text_val,
                        "segments": segs,
                    },
                }
                res = client.post(
                    "/investigations",
                    files={"video": ("unavail_trans.mp4", b"bytes", "video/mp4")},
                )
                assert res.status_code == 200
                data = res.json()
                text_items = [e for e in data["evidence"] if e["modality"] == "text"]
                assert len(text_items) == 0, f"Expected 0 text evidence for ({bad_status}, '{text_val}'), got {len(text_items)}"
    print("18f. Empty/unavailable/failed transcription omits text Evidence: PASSED")

    # 18g. Malformed transcript segments are skipped safely
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": dummy_audio_section,
                "transcription": {
                    "status": "success",
                    "text": "Mixed valid and invalid segments.",
                    "segments": [
                        "not a dict",
                        {"start": "invalid_num", "end": 2.0, "text": "bad start"},
                        {"start": 5.0, "end": 3.0, "text": "end before start"},
                        {"start": -1.0, "end": 2.0, "text": "negative timestamp"},
                        {"start": 1.0, "end": 2.5, "text": "valid segment"},
                    ],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("malformed_test.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            # Text evidence should still be created
            text_items = [e for e in data["evidence"] if e["modality"] == "text"]
            assert len(text_items) == 1
            # Only the single valid segment should make it into the timeline
            trans_timeline = [t for t in data["timeline"] if t["severity"] == "info"]
            assert len(trans_timeline) == 1
            assert abs(trans_timeline[0]["start"] - 1.0) < 1e-2
            assert abs(trans_timeline[0]["end"] - 2.5) < 1e-2
            print("18g. Malformed transcript segments skipped safely: PASSED")

    # 18h. Transcription exception does not cause HTTP 500
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            # Simulate unexpected crash in transcription
            mock_audio_pipe.side_effect = RuntimeError("Whisper CTranslate2 runtime crash")
            res = client.post(
                "/investigations",
                files={"video": ("crash_trans.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200, f"Expected 200 on pipeline crash, got {res.status_code}"
            data = res.json()
            assert "investigation_id" in data
            assert "assessment" in data
            print("18h. Transcription exception does not cause HTTP 500: PASSED")

    # 18i. Existing AASIST audio evidence remains present when transcription succeeds
    with patch.object(VideoDetector, "analyze_video", return_value=dummy_video_result):
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.84,
                    "confidence": 0.91,
                    "status": "success",
                    "model": "AASIST-L",
                    "time_ranges": [{"start": 1.0, "end": 3.0}],
                },
                "transcription": {
                    "status": "success",
                    "text": "Speech verified.",
                    "segments": [{"start": 1.0, "end": 3.0, "text": "Speech verified."}],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("both_modalities.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            modalities = [e["modality"] for e in data["evidence"]]
            assert "video" in modalities
            assert "audio" in modalities
            assert "text" in modalities
            audio_ev = [e for e in data["evidence"] if e["modality"] == "audio"][0]
            assert abs(audio_ev["score"] - 0.84) < 1e-4
            assert audio_ev["signal"] == "synthetic_voice"
            print("18i. Existing AASIST audio evidence remains present alongside transcription: PASSED")

    # 18j. Existing no-file behavior remains backward compatible
    with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
        res_no_file = client.post("/investigations")
        assert res_no_file.status_code == 200
        mock_audio_pipe.assert_not_called()
        data_nf = res_no_file.json()
        assert len(data_nf["evidence"]) == 3
        assert data_nf["evidence"][2]["modality"] == "text"
        assert data_nf["evidence"][2]["signal"] == "semantic_coherence"  # original mock evidence preserved

        # With JSON body
        res_json = client.post("/investigations", json={"investigation_id": "inv_back_compat"})
        assert res_json.status_code == 200
        assert res_json.json()["investigation_id"] == "inv_back_compat"
    print("18j. Existing no-file behavior remains backward compatible: PASSED")

    # 18k. TrustEngine remains final authority; transcription does not directly alter verdict
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
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
                    "text": "Neutral transcript.",
                    "segments": [{"start": 0.0, "end": 2.0, "text": "Neutral transcript."}],
                },
            }
            res = client.post(
                "/investigations",
                files={"video": ("verdict_test.mp4", b"bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            verdict = data["assessment"]["verdict"]
            # TrustEngine assessment should be COORDINATED_SYNTHETIC due to high video & high audio
            assert verdict == Verdict.COORDINATED_SYNTHETIC.value
            assert "direction" not in data["assessment"]
    print("18k. TrustEngine remains final authority and transcription does not override verdict: PASSED")

    print("\n*** ALL STEP 18 FOCUSED TESTS PASSED! ***")


if __name__ == "__main__":
    run_tests()
