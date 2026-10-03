"""Model loader helper for AASIST audio anti-spoofing detection.

Handles lazy loading, checkpoint resolution, and CPU caching of AASIST-L weights.
"""

import os
from typing import Any, Dict, Optional

# Lazy-loaded singleton cache
_AASIST_MODEL = None
_AASIST_DEVICE = None

AASIST_CONFIG: Dict[str, Any] = {
    "architecture": "AASIST",
    "nb_samp": 64600,
    "first_conv": 128,
    "filts": [70, [1, 32], [32, 32], [32, 24], [24, 24]],
    "gat_dims": [24, 32],
    "pool_ratios": [0.4, 0.5, 0.7, 0.5],
    "temperatures": [2.0, 2.0, 100.0, 100.0],
}


def get_weights_path() -> str:
    """Return the absolute path to the local AASIST-L weights file."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "weights", "AASIST-L.pth")


def load_aasist_model(device: Optional[str] = "cpu"):
    """Lazily load and cache the AASIST-L PyTorch model on the specified device.

    Args:
        device: Device string ("cpu" or "cuda"). Defaults to "cpu".

    Returns:
        Loaded PyTorch Model in eval() mode.

    Raises:
        FileNotFoundError: If the AASIST-L checkpoint weights file is missing.
        RuntimeError: If model instantiation or state dict loading fails.
    """
    global _AASIST_MODEL, _AASIST_DEVICE

    if _AASIST_MODEL is not None and _AASIST_DEVICE == device:
        return _AASIST_MODEL

    import torch
    from .aasist_arch import Model

    weights_path = get_weights_path()
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"AASIST-L weights not found at path: {weights_path}")

    model = Model(AASIST_CONFIG)
    checkpoint = torch.load(weights_path, map_location=device)
    model.load_state_dict(checkpoint)
    model.to(device)
    model.eval()

    _AASIST_MODEL = model
    _AASIST_DEVICE = device
    return _AASIST_MODEL
