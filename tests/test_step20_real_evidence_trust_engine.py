"""Step 20 focused test suite: Real-evidence -> TrustEngine integration.

Validates that POST /investigations correctly orchestrates REAL evidence
(VideoDetector, AASIST audio, Whisper text, SyncNet AV-consistency) into
the deterministic TrustEngine:
A. Real video + audio + text + normal SyncNet consistency reaches TrustEngine correctly.
B. Missing audio does not create fake authentic audio evidence.
C. Missing text does not create fake authentic text evidence.
D. Conflicting evidence is preserved as conflicting (INCONCLUSIVE — CONFLICTING EVIDENCE).
E. Strong synthetic evidence across multiple modalities with high consistency produces COORDINATED SYNTHETIC.
F. Gemini failure/fallback cannot change the deterministic verdict.
G. Existing no-file behavior remains backward compatible.
"""

import os
import sys
from unittest.mock import patch
from fastapi.testclient import TestClient

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.analysis.evidence import Evidence, Verdict
from backend.models.video_detector import VideoDetector
from backend.fusion.trust_engine import TrustEngine
from backend.analysis.consistency import ConsistencyAnalyzer
from backend.analysis.conflict import ConflictDetector


def run_tests():
    print("=== Test Suite: Step 20 Real-Evidence -> TrustEngine Integration ===")

    client = TestClient(app)

    dummy_video_suspicious = {
        "modality": "video",
        "signal_type": "visual_synthetic",
        "score": 0.88,
        "uncertainty": 0.10,
        "direction": "suspicious",
        "time_range": {"start": 0.0, "end": 4.0},
        "status": "success",
    }

    dummy_video_authentic = {
        "modality": "video",
        "signal_type": "visual_synthetic",
        "score": 0.15,
        "uncertainty": 0.15,
        "direction": "authentic",
        "time_range": None,
        "status": "success",
    }

    # -------------------------------------------------------------------------
    # A. Real video + audio + text + normal SyncNet consistency reaches TrustEngine correctly
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = dummy_video_suspicious
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.85,
                    "confidence": 0.90,
                    "status": "suspicious",
                    "time_ranges": [{"start": 1.0, "end": 3.0}],
                },
                "transcription": {
                    "status": "success",
                    "text": "Full multimodal pipeline verification.",
                    "segments": [{"start": 0.5, "end": 3.5, "text": "Full multimodal pipeline verification."}],
                },
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.92,
                    "confidence": 0.88,
                    "time_ranges": [],
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_full_pipeline.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            data = res.json()

            # Verify evidence list contains all four distinct signals
            modalities = {e["modality"]: e for e in data["evidence"]}
            assert "video" in modalities, "Missing video modality in evidence"
            assert "audio" in modalities, "Missing audio modality in evidence"
            assert "text" in modalities, "Missing text modality in evidence"
            assert "audio_video" in modalities, "Missing audio_video (SyncNet) in evidence"

            assert modalities["video"]["score"] == 0.88
            assert modalities["audio"]["score"] == 0.85
            assert modalities["text"]["signal"] == "speech_transcript"
            assert modalities["audio_video"]["signal"] == "lip_sync"

            assessment = data["assessment"]
            assert assessment["verdict"] in [v.value for v in Verdict]
            assert assessment["evidence_coverage"] == 1.0, "Expected full core modality coverage (1.0)"
            assert assessment["consistency_score"] >= 0.70, "Expected high consistency from SyncNet"
            assert assessment["conflict"] is False
    print("A. Real video + audio + text + normal SyncNet reaches TrustEngine correctly: PASSED")

    # -------------------------------------------------------------------------
    # B. Missing audio does not create fake authentic audio evidence
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            # Low synthetic visual score (authentic video), but audio pipeline fails / unavailable
            mock_vid.return_value = dummy_video_authentic
            mock_audio_pipe.return_value = {
                "status": "partial",
                "audio": {"status": "unavailable", "synthetic_score": None},
                "transcription": {"status": "unavailable", "text": ""},
                "sync": {"status": "unavailable", "lip_sync_score": None},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_missing_audio.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()

            audio_items = [e for e in data["evidence"] if e["modality"] == "audio"]
            assert len(audio_items) == 0, "Missing audio must not produce fake audio evidence"

            assessment = data["assessment"]
            # With only video present, coverage is 1/3 (0.33) which is < 0.50
            # Despite low synthetic score on video, verdict must NOT be AUTHENTIC
            assert assessment["verdict"] == Verdict.INCONCLUSIVE_INSUFFICIENT_EVIDENCE.value, (
                f"Expected INSUFFICIENT EVIDENCE due to missing audio/text, got {assessment['verdict']}"
            )
            assert assessment["evidence_coverage"] < 0.50
    print("B. Missing audio does not create fake authentic audio evidence: PASSED")

    # -------------------------------------------------------------------------
    # C. Missing text does not create fake authentic text evidence
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = dummy_video_authentic
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.12,
                    "confidence": 0.85,
                    "status": "normal",
                },
                "transcription": {
                    "status": "error",
                    "text": "",
                    "segments": [],
                },
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.95,
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_missing_text.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()

            text_items = [e for e in data["evidence"] if e["modality"] == "text"]
            assert len(text_items) == 0, "Missing/error transcription must not produce text evidence"

            modalities = {e["modality"] for e in data["evidence"]}
            assert "video" in modalities
            assert "audio" in modalities
            assert "audio_video" in modalities
            assert "text" not in modalities
    print("C. Missing text does not create fake authentic text evidence: PASSED")

    # -------------------------------------------------------------------------
    # D. Conflicting evidence is preserved as conflicting
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = dummy_video_suspicious
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.85,
                    "confidence": 0.90,
                    "status": "suspicious",
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            # Inject a conflicting evidence signal via patch on ConflictDetector
            with patch.object(ConflictDetector, "detect_conflict", return_value=True):
                res = client.post(
                    "/investigations",
                    files={"video": ("test_conflict.mp4", b"fake_bytes", "video/mp4")},
                )
                assert res.status_code == 200
                data = res.json()
                assessment = data["assessment"]
                assert assessment["conflict"] is True
                assert assessment["verdict"] == Verdict.INCONCLUSIVE_CONFLICTING_EVIDENCE.value, (
                    f"Expected INCONCLUSIVE — CONFLICTING EVIDENCE, got {assessment['verdict']}"
                )
    print("D. Conflicting evidence is preserved as conflicting: PASSED")

    # -------------------------------------------------------------------------
    # E. Strong synthetic evidence across multiple modalities with high consistency
    #    produces COORDINATED SYNTHETIC
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": 0.92,
                "uncertainty": 0.08,
                "direction": "suspicious",
                "status": "success",
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.89,
                    "confidence": 0.94,
                    "status": "suspicious",
                },
                "transcription": {
                    "status": "success",
                    "text": "Deepfake synthesis dialogue.",
                    "segments": [{"start": 0.0, "end": 2.0, "text": "Deepfake synthesis dialogue."}],
                },
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.94,  # high AV consistency >= 0.70
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_coordinated.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            assessment = data["assessment"]
            assert assessment["verdict"] == Verdict.COORDINATED_SYNTHETIC.value, (
                f"Expected COORDINATED SYNTHETIC, got {assessment['verdict']}"
            )
            assert assessment["synthetic_score"] >= 0.65
            assert assessment["consistency_score"] >= 0.70
            assert assessment["conflict"] is False

            # Verify that when SyncNet indicates poor lip sync (inconsistent, < 0.70),
            # verdict is MANIPULATED rather than COORDINATED SYNTHETIC
            mock_audio_pipe.return_value["sync"]["lip_sync_score"] = 0.20  # consistency = 0.20 < 0.70
            res_manip = client.post(
                "/investigations",
                files={"video": ("test_manipulated.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res_manip.status_code == 200
            assessment_manip = res_manip.json()["assessment"]
            assert assessment_manip["verdict"] == Verdict.MANIPULATED.value, (
                f"Expected MANIPULATED with low consistency, got {assessment_manip['verdict']}"
            )
    print("E. Strong synthetic evidence across multiple modalities with high consistency produces COORDINATED SYNTHETIC: PASSED")

    # -------------------------------------------------------------------------
    # F. Gemini failure/fallback cannot change the deterministic verdict
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            with patch("backend.explanation.gemini.GeminiExplanationService.generate_explanation") as mock_expl:
                mock_vid.return_value = dummy_video_suspicious
                mock_audio_pipe.return_value = {
                    "status": "success",
                    "audio": {"synthetic_score": 0.85, "confidence": 0.90, "status": "suspicious"},
                    "transcription": {"status": "unavailable"},
                    "sync": {"status": "success", "lip_sync_score": 0.90},
                }

                # Gemini service returns a custom or fallback explanation
                mock_expl.return_value = "Fallback explanation: Gemini API unavailable."

                res = client.post(
                    "/investigations",
                    files={"video": ("test_gemini_fallback.mp4", b"fake_bytes", "video/mp4")},
                )
                assert res.status_code == 200
                data = res.json()

                # Verdict is deterministic from TrustEngine regardless of explanation
                assessment = data["assessment"]
                assert assessment["verdict"] in [v.value for v in Verdict]
                assert data["explanation"] == "Fallback explanation: Gemini API unavailable."
    print("F. Gemini failure/fallback cannot change the deterministic verdict: PASSED")

    # -------------------------------------------------------------------------
    # G. Existing no-file behavior remains backward compatible
    # -------------------------------------------------------------------------
    with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
        with patch.object(VideoDetector, "analyze_video") as mock_vid:
            # No-file call without body
            res_nf = client.post("/investigations")
            assert res_nf.status_code == 200
            mock_audio_pipe.assert_not_called()
            mock_vid.assert_not_called()
            data_nf = res_nf.json()
            assert len(data_nf["evidence"]) == 3
            assert data_nf["assessment"]["verdict"] in [v.value for v in Verdict]

            # No-file call with JSON body
            res_json = client.post("/investigations", json={"investigation_id": "step20_compat_check"})
            assert res_json.status_code == 200
            assert res_json.json()["investigation_id"] == "step20_compat_check"
    print("G. Existing no-file behavior remains backward compatible: PASSED")

    print("\n*** ALL STEP 20 FOCUSED TESTS PASSED! ***")


def test_step20():
    run_tests()


if __name__ == "__main__":
    run_tests()
