"""Local filesystem & JSON persistence module for TrustLayer investigations.

Ensures real investigations are persisted separately from demo data,
surviving requests and server restarts in compliance with the PRD.

Directory layout:
data/
├── uploads/
├── processed/
├── investigations/
└── demo/
"""

import json
import os
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional

# Base directory for data storage
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
PROCESSED_DIR = DATA_DIR / "processed"
INVESTIGATIONS_DIR = DATA_DIR / "investigations"
DEMO_DIR = DATA_DIR / "demo"


def init_storage() -> None:
    """Ensure all required data directories exist."""
    for path in (DATA_DIR, UPLOADS_DIR, PROCESSED_DIR, INVESTIGATIONS_DIR, DEMO_DIR):
        path.mkdir(parents=True, exist_ok=True)


# Initialize on import
init_storage()


def save_investigation(investigation_id: str, data: Dict[str, Any]) -> str:
    """Persist an investigation record to JSON storage."""
    init_storage()
    file_path = INVESTIGATIONS_DIR / f"{investigation_id}.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)
    return str(file_path)


def get_investigation(investigation_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve an investigation by ID from local storage."""
    init_storage()
    file_path = INVESTIGATIONS_DIR / f"{investigation_id}.json"
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def list_investigations() -> List[Dict[str, Any]]:
    """List all persisted real investigations, sorted newest first."""
    init_storage()
    results = []
    for p in sorted(INVESTIGATIONS_DIR.glob("*.json"), key=os.path.getmtime, reverse=True):
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
                results.append(data)
        except Exception:
            continue
    return results


def save_uploaded_media(source_path: str, filename: str, investigation_id: str) -> str:
    """Copy an uploaded file to data/uploads with stable path."""
    init_storage()
    _, ext = os.path.splitext(filename)
    safe_name = f"{investigation_id}_{filename}"
    target_path = UPLOADS_DIR / safe_name
    shutil.copy2(source_path, target_path)
    return str(target_path)
