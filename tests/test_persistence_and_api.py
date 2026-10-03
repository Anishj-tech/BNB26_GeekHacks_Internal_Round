"""Integration tests for persistence and canonical API routes.

Validates:
1. POST /api/v1/investigation/upload returns normalized investigation result.
2. The investigation is persisted to data/investigations/{id}.json.
3. GET /api/v1/investigation/{id} retrieves the persisted investigation accurately.
4. GET /api/v1/investigations lists persisted investigations.
5. 404 is returned cleanly for non-existent IDs.
"""

import os
import sys
from fastapi.testclient import TestClient

# Ensure repo root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.storage import get_investigation


def test_api_persistence_flow():
    client = TestClient(app)

    # 1. No-file upload / backward compatible trigger with custom ID
    test_id = "INV-TEST-999"
    res = client.post("/api/v1/investigation/upload", json={"investigation_id": test_id})
    assert res.status_code == 200, f"Upload failed: {res.text}"
    data = res.json()
    assert data["investigation_id"] == test_id
    assert "assessment" in data
    assert "verdict" in data["assessment"]
    assert "twoAxis" in data
    assert "coverage" in data
    assert "conflict" in data
    assert "timeline" in data
    assert "graph" in data

    # 2. Check persistence to disk
    stored = get_investigation(test_id)
    assert stored is not None
    assert stored["investigation_id"] == test_id

    # 3. Retrieve via GET /api/v1/investigation/{id}
    get_res = client.get(f"/api/v1/investigation/{test_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["investigation_id"] == test_id
    assert get_data["assessment"]["verdict"] == data["assessment"]["verdict"]

    # 4. List via GET /api/v1/investigations
    list_res = client.get("/api/v1/investigations")
    assert list_res.status_code == 200
    items = list_res.json()
    assert isinstance(items, list)
    assert any(item.get("investigation_id") == test_id or item.get("id") == test_id for item in items)

    # 5. Non-existent ID returns 404
    non_existent = client.get("/api/v1/investigation/INV-NON-EXISTENT-XYZ")
    assert non_existent.status_code == 404

    print("All persistence and canonical API route integration tests PASSED!")


if __name__ == "__main__":
    test_api_persistence_flow()
