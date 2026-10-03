"""Step 22 focused test suite: PRD Evidence Graph additive API feature.

Validates that:
A. graph exists in investigation response
B. video/audio/text nodes appear when corresponding evidence exists
C. signal nodes contain score/confidence/status
D. SyncNet creates synchronization relationship
E. conflicting evidence creates conflict relationship
F. missing modality does not create a fabricated node
G. no evidence returns empty graph
H. graph fields stay within schema bounds
I. face evidence integration (derived_from when present, omitted when missing/insufficient)
"""

import os
import sys
from unittest.mock import patch
from fastapi.testclient import TestClient

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.analysis.evidence import (
    Assessment,
    Evidence,
    EvidenceGraph,
    GraphEdge,
    GraphNode,
    TimeRange,
    Verdict,
)
from backend.api.routes.investigation import build_evidence_graph
from backend.models.video_detector import VideoDetector
from backend.analysis.conflict import ConflictDetector


def run_tests():
    print("=== Test Suite: Step 22 PRD Evidence Graph ===")

    client = TestClient(app)

    # -------------------------------------------------------------------------
    # A. Graph exists in investigation response
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": 0.85,
                "uncertainty": 0.10,
                "direction": "suspicious",
                "time_range": {"start": 0.0, "end": 3.0},
                "status": "success",
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.80,
                    "confidence": 0.90,
                    "status": "suspicious",
                    "time_ranges": [{"start": 1.0, "end": 2.5}],
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_graph.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            assert "graph" in data, "Response missing 'graph' field"
            assert data["graph"] is not None, "Response 'graph' must not be None"
            assert "nodes" in data["graph"], "'graph' missing 'nodes'"
            assert "edges" in data["graph"], "'graph' missing 'edges'"
            assert isinstance(data["graph"]["nodes"], list)
            assert isinstance(data["graph"]["edges"], list)
    print("A. Graph exists in investigation response: PASSED")

    # -------------------------------------------------------------------------
    # B. Video/audio/text nodes appear when corresponding evidence exists
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": 0.88,
                "uncertainty": 0.12,
                "direction": "suspicious",
                "time_range": {"start": 0.0, "end": 4.0},
                "status": "success",
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.82,
                    "confidence": 0.88,
                    "status": "suspicious",
                    "time_ranges": [{"start": 1.0, "end": 3.0}],
                },
                "transcription": {
                    "status": "success",
                    "text": "Checking multimodal evidence graph generation.",
                    "segments": [{"start": 0.0, "end": 3.0, "text": "Checking multimodal evidence graph generation."}],
                },
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.85,
                    "confidence": 0.90,
                    "time_ranges": [],
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("multimodal_graph.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            nodes = data["graph"]["nodes"]
            modality_nodes = {n["id"]: n for n in nodes if n["type"] == "modality"}

            assert "mod_video" in modality_nodes, "Missing 'mod_video' modality node"
            assert "mod_audio" in modality_nodes, "Missing 'mod_audio' modality node"
            assert "mod_text" in modality_nodes, "Missing 'mod_text' modality node"
            assert "mod_audio_video" in modality_nodes, "Missing 'mod_audio_video' modality node"

            assert modality_nodes["mod_video"]["label"] == "Video"
            assert modality_nodes["mod_audio"]["label"] == "Audio"
            assert modality_nodes["mod_text"]["label"] == "Text"
            assert modality_nodes["mod_audio_video"]["label"] == "Audio-Video Consistency"
    print("B. Video/audio/text/audio_video modality nodes appear: PASSED")

    # -------------------------------------------------------------------------
    # C. Signal nodes contain score/confidence/status and time_range metadata
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.91,
                "uncertainty": 0.09,
                "direction": "suspicious",
                "time_range": {"start": 0.5, "end": 2.5},
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.79,
                    "confidence": 0.85,
                    "status": "suspicious",
                    "time_ranges": [{"start": 1.0, "end": 3.0}],
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("test_signals.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            signal_nodes = [n for n in data["graph"]["nodes"] if n["type"] == "signal"]
            assert len(signal_nodes) >= 2

            for sn in signal_nodes:
                assert sn["score"] is not None and 0.0 <= sn["score"] <= 1.0
                assert sn["confidence"] is not None and 0.0 <= sn["confidence"] <= 1.0
                assert sn["status"] in ("suspicious", "normal", "inconclusive")
                assert sn["label"] != ""

            # Check time_range metadata on video signal
            vid_sig = next(n for n in signal_nodes if "video" in n["id"])
            assert "time_range" in vid_sig["metadata"]
            assert vid_sig["metadata"]["time_range"]["start"] == 0.5
            assert vid_sig["metadata"]["time_range"]["end"] == 2.5
    print("C. Signal nodes contain score/confidence/status and time_range metadata: PASSED")

    # -------------------------------------------------------------------------
    # D. SyncNet creates synchronization relationship
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.75,
                "uncertainty": 0.15,
                "direction": "suspicious",
                "time_range": {"start": 0.0, "end": 2.0},
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.80,
                    "confidence": 0.85,
                    "status": "suspicious",
                    "time_ranges": [],
                },
                "transcription": {"status": "unavailable"},
                "sync": {
                    "status": "success",
                    "lip_sync_score": 0.90,
                    "confidence": 0.88,
                    "time_ranges": [],
                },
            }

            res = client.post(
                "/investigations",
                files={"video": ("sync_rel.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            edges = data["graph"]["edges"]
            sync_edges = [e for e in edges if e["relation"] == "synchronizes_with"]
            assert len(sync_edges) >= 1, "Expected at least one 'synchronizes_with' edge"

            sync_targets = {e["target"] for e in sync_edges}
            assert "mod_audio_video" in sync_targets
    print("D. SyncNet creates synchronization relationship: PASSED")

    # -------------------------------------------------------------------------
    # E. Conflicting evidence creates conflict relationship
    # -------------------------------------------------------------------------
    # Direct evidence graph conflict check
    ev_vid_conf = Evidence(modality="video", signal="visual_synthetic", score=0.92, confidence=0.90, status="suspicious")
    ev_aud_conf = Evidence(modality="audio", signal="synthetic_voice", score=0.10, confidence=0.90, status="normal")
    conflict_assess = Assessment(
        verdict=Verdict.INCONCLUSIVE_CONFLICTING_EVIDENCE.value,
        synthetic_score=0.51,
        consistency_score=0.20,
        evidence_coverage=0.66,
        conflict=True,
    )
    graph_conf = build_evidence_graph([ev_vid_conf, ev_aud_conf], conflict_assess)
    c_edges = [e for e in graph_conf.edges if e.relation == "conflicts_with" and e.is_conflict]
    assert len(c_edges) >= 1, "Direct graph call must generate conflict edge"

    # API route integration check
    with patch.object(ConflictDetector, "detect_conflict", return_value=True):
        with patch.object(VideoDetector, "analyze_video") as mock_vid:
            with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
                mock_vid.return_value = {
                    "modality": "video",
                    "score": 0.90,
                    "uncertainty": 0.10,
                    "direction": "suspicious",
                    "time_range": {"start": 0.0, "end": 2.0},
                }
                mock_audio_pipe.return_value = {
                    "status": "success",
                    "audio": {
                        "synthetic_score": 0.10,
                        "confidence": 0.90,
                        "status": "normal",
                        "time_ranges": [],
                    },
                    "transcription": {"status": "unavailable"},
                    "sync": {"status": "unavailable"},
                }

                res = client.post(
                    "/investigations",
                    files={"video": ("conflict_graph.mp4", b"fake_bytes", "video/mp4")},
                )
                assert res.status_code == 200
                data = res.json()
                assert data["assessment"]["conflict"] is True

                edges = data["graph"]["edges"]
                conflict_edges = [e for e in edges if e["relation"] == "conflicts_with" and e["is_conflict"] is True]
                assert len(conflict_edges) >= 1, "Expected at least one conflict edge in API response"
                c_edge = conflict_edges[0]
                assert c_edge["is_conflict"] is True
                assert c_edge["relation"] == "conflicts_with"
    print("E. Conflicting evidence creates conflict relationship: PASSED")

    # -------------------------------------------------------------------------
    # F. Missing modality does not create a fabricated node
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.20,
                "uncertainty": 0.10,
                "direction": "authentic",
                "time_range": None,
            }
            # Audio pipeline returns unavailable for all modules
            mock_audio_pipe.return_value = {
                "status": "unavailable",
                "audio": {"status": "unavailable"},
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("missing_modalities.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            node_ids = {n["id"] for n in data["graph"]["nodes"]}
            assert "mod_video" in node_ids
            assert "mod_audio" not in node_ids, "Missing audio must not create 'mod_audio'"
            assert "mod_text" not in node_ids, "Missing text must not create 'mod_text'"
            assert "mod_audio_video" not in node_ids, "Missing sync must not create 'mod_audio_video'"
    print("F. Missing modality does not create a fabricated node: PASSED")

    # -------------------------------------------------------------------------
    # G. No evidence returns empty graph
    # -------------------------------------------------------------------------
    empty_assessment = Assessment(
        verdict=Verdict.INCONCLUSIVE_INSUFFICIENT_EVIDENCE.value,
        synthetic_score=0.0,
        consistency_score=0.5,
        evidence_coverage=0.0,
        conflict=False,
    )
    empty_graph = build_evidence_graph([], empty_assessment)
    assert isinstance(empty_graph, EvidenceGraph)
    assert len(empty_graph.nodes) == 0, f"Expected 0 nodes, got {len(empty_graph.nodes)}"
    assert len(empty_graph.edges) == 0, f"Expected 0 edges, got {len(empty_graph.edges)}"
    print("G. No evidence returns empty graph: PASSED")

    # -------------------------------------------------------------------------
    # H. Graph fields stay within schema bounds
    # -------------------------------------------------------------------------
    with patch.object(VideoDetector, "analyze_video") as mock_vid:
        with patch("backend.api.routes.investigation.run_audio_pipeline") as mock_audio_pipe:
            mock_vid.return_value = {
                "modality": "video",
                "score": 0.70,
                "uncertainty": 0.20,
                "direction": "suspicious",
                "time_range": {"start": 1.0, "end": 3.0},
            }
            mock_audio_pipe.return_value = {
                "status": "success",
                "audio": {
                    "synthetic_score": 0.75,
                    "confidence": 0.85,
                    "status": "suspicious",
                    "time_ranges": [{"start": 1.0, "end": 2.5}],
                },
                "transcription": {"status": "unavailable"},
                "sync": {"status": "unavailable"},
            }

            res = client.post(
                "/investigations",
                files={"video": ("bounds_test.mp4", b"fake_bytes", "video/mp4")},
            )
            assert res.status_code == 200
            data = res.json()
            for node in data["graph"]["nodes"]:
                assert isinstance(node["id"], str) and len(node["id"]) > 0
                assert isinstance(node["label"], str) and len(node["label"]) > 0
                if node["score"] is not None:
                    assert 0.0 <= node["score"] <= 1.0
                if node["confidence"] is not None:
                    assert 0.0 <= node["confidence"] <= 1.0
                assert isinstance(node["metadata"], dict)

            for edge in data["graph"]["edges"]:
                assert isinstance(edge["source"], str) and len(edge["source"]) > 0
                assert isinstance(edge["target"], str) and len(edge["target"]) > 0
                assert edge["relation"] in ("corroborates", "conflicts_with", "derived_from", "synchronizes_with")
                assert 0.0 <= edge["weight"] <= 1.0
                assert isinstance(edge["is_conflict"], bool)
    print("H. Graph fields stay within schema bounds: PASSED")

    # -------------------------------------------------------------------------
    # I. Face evidence integration when reliable vs unreliable
    # -------------------------------------------------------------------------
    # 1. Reliable face consistency creates video <-> face edge
    vid_ev = Evidence(modality="video", signal="visual_synthetic", score=0.85, confidence=0.85, status="suspicious")
    test_assessment = Assessment(
        verdict=Verdict.MANIPULATED.value,
        synthetic_score=0.85,
        consistency_score=0.80,
        evidence_coverage=0.66,
        conflict=False,
    )
    reliable_face = {
        "status": "inconsistent",
        "num_faces_detected": 4,
        "mean_embedding_similarity": 0.42,
        "is_consistent": False,
    }
    graph_with_face = build_evidence_graph([vid_ev], test_assessment, face_info=reliable_face)
    face_nodes = [n for n in graph_with_face.nodes if "face" in n.id]
    assert len(face_nodes) == 1
    assert face_nodes[0].status == "suspicious"
    face_edges = [e for e in graph_with_face.edges if e.target == "node_face"]
    assert len(face_edges) == 1
    assert face_edges[0].source == "mod_video"

    # 2. Insufficient faces does NOT fabricate face node
    insufficient_face = {
        "status": "insufficient_faces",
        "num_faces_detected": 1,
        "mean_embedding_similarity": None,
        "is_consistent": None,
    }
    graph_no_face = build_evidence_graph([vid_ev], test_assessment, face_info=insufficient_face)
    assert not any("face" in n.id for n in graph_no_face.nodes)
    print("I. Face evidence integration when reliable vs unreliable: PASSED")

    print("\n*** ALL STEP 22 EVIDENCE GRAPH TESTS PASSED! ***")


def test_step22():
    run_tests()


if __name__ == "__main__":
    run_tests()
