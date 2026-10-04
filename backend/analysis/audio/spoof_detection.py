"""Audio spoof and synthetic speech detection module for TrustLayer.

Analyzes extracted speech/audio tracks using an AASIST-family anti-spoofing model
to produce real synthetic probability scores and confidence metrics.
"""

import os
from typing import Any, Dict, List, Optional

import numpy as np


def _prepare_audio_waveform(audio_path: str, target_sr: int = 16000, nb_samp: int = 64600) -> np.ndarray:
    """Load and format audio waveform to 16kHz mono and pad/tile to required sample length."""
    import soundfile as sf

    data, sr = sf.read(audio_path, dtype="float32")

    # If stereo/multichannel, downmix to mono
    if data.ndim > 1:
        data = np.mean(data, axis=1)

    # Resample if sample rate does not match target_sr
    if sr != target_sr:
        import torch
        import torchaudio.transforms as T

        tensor_data = torch.from_numpy(data).unsqueeze(0)
        resampler = T.Resample(sr, target_sr)
        resampled_tensor = resampler(tensor_data)
        data = resampled_tensor.squeeze(0).numpy()

    # Normalize peak amplitude to standard ASVspoof reference level (0.025) to prevent filter saturation
    peak = float(np.max(np.abs(data)))
    if peak > 0:
        data = (data / peak) * 0.025

    # AASIST standard tiling/padding strategy for length normalization (approx 4.0375 seconds)
    x_len = data.shape[0]
    if x_len < nb_samp:
        num_repeats = int(nb_samp / max(1, x_len)) + 1
        data = np.tile(data, num_repeats)[:nb_samp]
    elif x_len > nb_samp:
        data = data[:nb_samp]

    return data


def detect_audio_spoof(
    audio_path: str,
    threshold: float = 0.5,
) -> Dict[str, Any]:
    """Analyze audio for synthetic/cloned speech or deepfake characteristics.

    Uses a pretrained AASIST-L (Audio Anti-Spoofing using Integrated Spectro-Temporal
    Graph Attention Networks) model to evaluate raw audio waveforms.

    Args:
        audio_path: Path to the processed WAV/audio file (16kHz mono recommended).
        threshold: Confidence threshold for classifying an audio sample as synthetic.

    Returns:
        Dict adhering to the TrustLayer schema:
            - synthetic_score: float (0.0 to 1.0; HIGH indicates more suspicious/synthetic)
            - confidence: float (0.0 to 1.0; distance from neutral decision boundary)
            - status: str ("success" | "unavailable" | "error")
            - model: Optional[str] (e.g. "AASIST-L")
            - message: str (informative description of result or error)
            - time_ranges: List[Dict[str, Any]] (suspicious segment timestamps if applicable)
    """
    if not os.path.exists(audio_path) or not os.path.isfile(audio_path):
        return {
            "synthetic_score": None,
            "confidence": None,
            "status": "unavailable",
            "model": None,
            "message": f"Input audio file does not exist: {audio_path}",
        }

    # Verify runtime dependencies are installed
    try:
        import torch
        import soundfile  # noqa: F401
    except ImportError as err:
        return {
            "synthetic_score": None,
            "confidence": None,
            "status": "unavailable",
            "model": None,
            "message": f"Required audio spoof detection dependencies missing: {err}",
        }

    # Attempt to load pretrained AASIST model lazily
    try:
        from .model_loader import load_aasist_model

        model = load_aasist_model(device="cpu")
    except Exception as err:
        return {
            "synthetic_score": None,
            "confidence": None,
            "status": "unavailable",
            "model": None,
            "message": f"Failed to load AASIST pretrained weights: {err}",
        }

    # Preprocess audio and perform inference
    try:
        waveform = _prepare_audio_waveform(audio_path, target_sr=16000, nb_samp=64600)
        x_tensor = torch.from_numpy(waveform).unsqueeze(0).to(torch.float32)

        with torch.no_grad():
            _, logits = model(x_tensor)

        # In AASIST ASVspoof protocol:
        # logits[:, 0] = spoof/synthetic class
        # logits[:, 1] = bonafide/genuine human class
        probs = torch.softmax(logits, dim=1).squeeze(0)
        spoof_prob = float(probs[0].item())
        bonafide_prob = float(probs[1].item())

        # Ensure clean bounded range [0.0, 1.0]
        synthetic_score = round(max(0.0, min(1.0, spoof_prob)), 4)
        # Confidence reflects how decisively the model chose spoof vs bonafide
        confidence = round(max(0.0, min(1.0, abs(spoof_prob - bonafide_prob))), 4)

        is_suspicious = synthetic_score >= threshold
        msg = (
            f"Audio analysis completed with AASIST-L. "
            f"Synthetic probability is {synthetic_score * 100:.1f}% "
            f"({'SUSPICIOUS / SYNTHETIC' if is_suspicious else 'GENUINE / BONAFIDE'})."
        )

        return {
            "synthetic_score": synthetic_score,
            "confidence": confidence,
            "status": "success",
            "model": "AASIST-L",
            "message": msg,
            "time_ranges": [],
        }

    except Exception as err:
        return {
            "synthetic_score": None,
            "confidence": None,
            "status": "unavailable",
            "model": None,
            "message": f"Error during AASIST spoof inference: {err}",
        }
