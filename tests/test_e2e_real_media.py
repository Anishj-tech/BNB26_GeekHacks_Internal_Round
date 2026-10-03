"""End-to-End Real Media Integration Test.

Tests the complete TrustLayer pipeline on actual video media:
UPLOAD
→ VALIDATION
→ EXTRACTION
→ VIDEO ANALYSIS
→ AUDIO ANALYSIS
→ TRANSCRIPTION
→ CONSISTENCY
→ EVIDENCE
→ FUSION
→ TRUST STATE
→ PERSISTENCE
→ API
"""

import hashlib
import os
import sys
from fastapi.testclient import TestClient

# Ensure root is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.storage import get_investigation


def test_real_media_e2e():
    print("\n=== TrustLayer Real Media End-to-End Pipeline Test ===")
    client = TestClient(app)

    video_path = os.path.join("data", "demo", "8135478-hd_1280_720_50fps.mp4")
    assert os.path.exists(video_path), f"Real demo video file missing at {video_path}"

    with open(video_path, "rb") as f:
        file_bytes = f.read()

    expected_sha256 = hashlib.sha256(file_bytes).hexdigest()
    print(f"Loaded real media file ({len(file_bytes)} bytes, SHA-256: {expected_sha256[:16]}...)")

    # 1. POST /api/v1/investigation/upload
    response = client.post(
        "/api/v1/investigation/upload",
        files={"video_file": ("8135478-hd_1280_720_50fps.mp4", file_bytes, "video/mp4")},
        data={"transcript_text": "Sample speech transcript for testing consistency verification."},
    )

    assert response.status_code == 200, f"Upload failed: {response.text}"
    result = response.json()

    # 2. Trace metadata and hash
    inv_id = result.get("investigation_id") or result.get("id")
    assert inv_id is not None
    assert result.get("sha256") == expected_sha256, "Computed SHA-256 must match real file bytes!"
    print(f"1. Investigation created with ID: {inv_id}, SHA-256 verified.")

    # 3. Trace Assessment
    assessment = result.get("assessment")
    assert assessment is not None
    assert "verdict" in assessment
    assert assessment["verdict"] in [
        "AUTHENTIC",
        "MANIPULATED",
        "COORDINATED SYNTHETIC",
        "INCONCLUSIVE — INSUFFICIENT EVIDENCE",
        "INCONCLUSIVE — CONFLICTING EVIDENCE",
    ]
    assert 0.0 <= assessment["synthetic_score"] <= 1.0
    assert 0.0 <= assessment["consistency_score"] <= 1.0
    assert 0.0 <= assessment["evidence_coverage"] <= 1.0
    print(f"2. TrustEngine deterministic verdict: {assessment['verdict']} (Synthetic: {assessment['synthetic_score']}, Consistency: {assessment['consistency_score']})")

    # 4. Trace Evidence & Provenance
    evidence = result.get("evidence", [])
    assert len(evidence) > 0, "Real video must generate evidence items!"
    for item in evidence:
        assert "modality" in item
        assert "signal" in item
        assert "score" in item
        assert "confidence" in item
        assert "status" in item
    print(f"3. Generated {len(evidence)} evidence items across modalities {[e['modality'] for e in evidence]}.")

    # 5. Trace Two-Axis & Coverage
    assert "twoAxis" in result
    assert "coverage" in result
    assert "conflict" in result
    print(f"4. Two-Axis and Coverage representations validated: quadrant '{result['twoAxis'].get('quadrant')}'.")

    # 6. Trace Evidence Graph
    graph = result.get("graph")
    assert graph is not None
    assert "nodes" in graph
    assert "edges" in graph
    print(f"5. Evidence Graph constructed: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges.")

    # 7. Trace Persistence to disk
    persisted = get_investigation(inv_id)
    assert persisted is not None, f"Investigation {inv_id} was not persisted to disk!"
    assert persisted.get("sha256") == expected_sha256
    print(f"6. Persistence verified: investigation saved to data/investigations/{inv_id}.json.")

    # 8. Trace Retrieval via GET /api/v1/investigation/{id}
    get_res = client.get(f"/api/v1/investigation/{inv_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved.get("assessment", {}).get("verdict") == assessment["verdict"]
    print("7. Investigation retrieved successfully via canonical GET endpoint.")

    # 9. Trace Retrieval via GET /api/v1/investigations
    list_res = client.get("/api/v1/investigations")
    assert list_res.status_code == 200
    items = list_res.json()
    assert any(item.get("id") == inv_id or item.get("investigation_id") == inv_id for item in items)
    print("8. Investigation listed successfully in investigations registry.")

    print("\n*** ALL END-TO-END REAL MEDIA PIPELINE CHECKS PASSED! ***\n")


if __name__ == "__main__":
    test_real_media_e2e()
