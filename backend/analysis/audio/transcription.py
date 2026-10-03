"""Speech transcription and word/segment-level timestamping module for TrustLayer.

Provides automated speech-to-text (STT) capabilities using faster-whisper,
producing structured transcriptions with precise segment timestamps.
"""

import os
from typing import Any, Dict, List, Optional


def transcribe_audio(
    audio_path: str,
    language: Optional[str] = None,
    word_timestamps: bool = True,
    model_size: str = "tiny",
) -> Dict[str, Any]:
    """Transcribe speech to text with segment-level timestamps.

    Args:
        audio_path: Path to standardized audio file (16kHz mono WAV recommended).
        language: Optional language code (e.g. 'en'). If None, automatically detected.
        word_timestamps: Whether to generate word-level onset/offset timestamps.
        model_size: Whisper model size to use (default: 'tiny').

    Returns:
        Dict conforming to TrustLayer transcription format:
            - status: str ("success" | "unavailable" | "error")
            - model: Optional[str] (e.g. "faster-whisper-tiny")
            - language: Optional[str] (e.g. "en")
            - text: str (full transcript text, or empty string if silent/failed)
            - segments: List[Dict[str, Any]] (list of segments with start, end, text)
            - message: Optional[str] (diagnostic info, especially if silent or unavailable)
    """
    if not os.path.exists(audio_path) or not os.path.isfile(audio_path):
        return {
            "status": "unavailable",
            "model": None,
            "language": None,
            "text": "",
            "segments": [],
            "message": f"Input audio file does not exist: {audio_path}",
        }

    # Verify faster_whisper is available in the environment
    try:
        import soundfile as sf
        from .model_loader import load_whisper_model
    except ImportError as err:
        return {
            "status": "unavailable",
            "model": None,
            "language": None,
            "text": "",
            "segments": [],
            "message": f"Required transcription dependencies missing: {err}",
        }

    # Inspect audio file for empty or completely silent content
    try:
        audio_data, sr = sf.read(audio_path, dtype="float32")
        if len(audio_data) == 0:
            return {
                "status": "success",
                "model": f"faster-whisper-{model_size}",
                "language": None,
                "text": "",
                "segments": [],
                "message": "Input audio file contains 0 audio frames.",
            }

        # Check for pure silence (all zeros or near-zero amplitude)
        max_amplitude = float(abs(audio_data).max())
        if max_amplitude < 1e-4:
            return {
                "status": "success",
                "model": f"faster-whisper-{model_size}",
                "language": None,
                "text": "",
                "segments": [],
                "message": "Audio is completely silent; no speech detected.",
            }
    except Exception as err:
        return {
            "status": "unavailable",
            "model": None,
            "language": None,
            "text": "",
            "segments": [],
            "message": f"Failed to read audio file: {err}",
        }

    # Load cached faster-whisper model
    try:
        model = load_whisper_model(model_size=model_size, device="cpu", compute_type="int8")
    except Exception as err:
        return {
            "status": "unavailable",
            "model": None,
            "language": None,
            "text": "",
            "segments": [],
            "message": f"Failed to load Whisper model: {err}",
        }

    # Run transcription
    try:
        # Pass loaded audio array directly (avoids PyAV metadata_errors parameter conflict in newer av versions)
        # Ensure 16kHz mono float32
        if audio_data.ndim > 1:
            import numpy as np
            audio_data = np.mean(audio_data, axis=1)

        if sr != 16000:
            import torch
            import torchaudio.transforms as T
            tensor_data = torch.from_numpy(audio_data).unsqueeze(0)
            resampler = T.Resample(sr, 16000)
            audio_data = resampler(tensor_data).squeeze(0).numpy()

        segments_gen, info = model.transcribe(
            audio_data,
            language=language,
            word_timestamps=word_timestamps,
            vad_filter=True,
        )

        formatted_segments: List[Dict[str, Any]] = []
        collected_texts: List[str] = []

        for seg in segments_gen:
            clean_text = seg.text.strip()
            if not clean_text:
                continue
            seg_dict: Dict[str, Any] = {
                "start": round(seg.start, 2),
                "end": round(seg.end, 2),
                "text": clean_text,
            }
            if word_timestamps and seg.words:
                seg_dict["words"] = [
                    {
                        "start": round(w.start, 2),
                        "end": round(w.end, 2),
                        "word": w.word.strip(),
                        "probability": round(w.probability, 3),
                    }
                    for w in seg.words
                    if w.word.strip()
                ]
            formatted_segments.append(seg_dict)
            collected_texts.append(clean_text)

        full_transcript = " ".join(collected_texts).strip()

        return {
            "status": "success",
            "model": f"faster-whisper-{model_size}",
            "language": info.language if info else language,
            "text": full_transcript,
            "segments": formatted_segments,
        }

    except Exception as err:
        return {
            "status": "unavailable",
            "model": f"faster-whisper-{model_size}",
            "language": None,
            "text": "",
            "segments": [],
            "message": f"Transcription failed during inference: {err}",
        }
