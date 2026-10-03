"""Audio analysis pipeline coordinator for TrustLayer.

Orchestrates the complete audio/speech/sync ML analysis workflow:
1. Audio extraction & standardizing from input video
2. AASIST-L audio spoof / synthetic speech detection
3. faster-whisper speech-to-text transcription with timestamps
4. SyncNet-v2 audio-visual lip-sync verification
"""

import os
from typing import Any, Dict, Optional

from .extraction import extract_audio_from_video, AudioExtractionError, NoAudioStreamError, VideoNotFoundError
from .spoof_detection import detect_audio_spoof
from .transcription import transcribe_audio
from .sync import check_av_sync


def run_audio_pipeline(
    video_path: Optional[str] = None,
    audio_path: Optional[str] = None,
    face_landmarks_data: Optional[Any] = None,
    cleanup_temp_audio: bool = False,
) -> Dict[str, Any]:
    """Execute the full end-to-end audio ML analysis pipeline.

    Processes input media through audio extraction, AASIST synthetic voice detection,
    faster-whisper transcription, and SyncNet lip-synchronization analysis, aggregating
    results into a structured JSON response.

    Args:
        video_path: Path to target video file (recommended for full AV analysis).
        audio_path: Optional direct audio file path. If None and video_path is provided,
                    audio is extracted from the video file.
        face_landmarks_data: Optional visual landmarks passed from the vision pipeline.
        cleanup_temp_audio: Whether to delete the extracted WAV file after pipeline execution.

    Returns:
        Structured Dict containing:
            - status: str ("success" | "partial" | "error")
            - audio: Dict[str, Any] (synthetic_score, confidence, model, time_ranges, status)
            - transcription: Dict[str, Any] (text, language, segments, status, model)
            - sync: Dict[str, Any] (lip_sync_score, detected_offset_seconds, model, time_ranges, status)
            - message: Optional[str] (overall summary or error info)
    """
    if not video_path and not audio_path:
        return {
            "status": "error",
            "audio": {
                "synthetic_score": None,
                "confidence": None,
                "model": None,
                "status": "unavailable",
                "time_ranges": [],
                "message": "Neither video_path nor audio_path was provided.",
            },
            "transcription": {
                "text": "",
                "language": None,
                "model": None,
                "segments": [],
                "status": "unavailable",
                "message": "Neither video_path nor audio_path was provided.",
            },
            "sync": {
                "lip_sync_score": None,
                "detected_offset_seconds": None,
                "model": None,
                "status": "unavailable",
                "time_ranges": [],
                "message": "Video path required for lip-sync analysis.",
            },
            "message": "No media inputs provided to audio analysis pipeline.",
        }

    extracted_temp_audio = None
    target_audio_path = audio_path

    # Step 1: Extract Audio if not directly supplied
    if not target_audio_path and video_path:
        try:
            ext_res = extract_audio_from_video(video_path)
            target_audio_path = ext_res["audio_path"]
            extracted_temp_audio = target_audio_path
        except (VideoNotFoundError, NoAudioStreamError, AudioExtractionError, Exception) as err:
            target_audio_path = None
            extraction_err_msg = str(err)
        else:
            extraction_err_msg = None
    else:
        extraction_err_msg = None

    # Step 2: AASIST Spoof / Synthetic Detection
    if target_audio_path and os.path.exists(target_audio_path):
        spoof_raw = detect_audio_spoof(target_audio_path)
        audio_section = {
            "synthetic_score": spoof_raw.get("synthetic_score"),
            "confidence": spoof_raw.get("confidence"),
            "model": spoof_raw.get("model"),
            "status": spoof_raw.get("status", "unavailable"),
            "time_ranges": spoof_raw.get("time_ranges", []),
            "message": spoof_raw.get("message", ""),
        }
    else:
        audio_section = {
            "synthetic_score": None,
            "confidence": None,
            "model": None,
            "status": "unavailable",
            "time_ranges": [],
            "message": extraction_err_msg or "Audio unavailable for synthetic detection.",
        }

    # Step 3: faster-whisper Transcription
    if target_audio_path and os.path.exists(target_audio_path):
        transcribe_raw = transcribe_audio(target_audio_path)
        transcription_section = {
            "text": transcribe_raw.get("text", ""),
            "language": transcribe_raw.get("language"),
            "model": transcribe_raw.get("model"),
            "segments": transcribe_raw.get("segments", []),
            "status": transcribe_raw.get("status", "unavailable"),
            "message": transcribe_raw.get("message", ""),
        }
    else:
        transcription_section = {
            "text": "",
            "language": None,
            "model": None,
            "segments": [],
            "status": "unavailable",
            "message": extraction_err_msg or "Audio unavailable for transcription.",
        }

    # Step 4: SyncNet Lip-Sync Analysis
    if video_path and os.path.exists(video_path):
        sync_raw = check_av_sync(
            video_path=video_path,
            audio_path=target_audio_path,
            face_landmarks_data=face_landmarks_data,
        )
        sync_section = {
            "lip_sync_score": sync_raw.get("lip_sync_score"),
            "detected_offset_seconds": sync_raw.get("detected_offset_seconds"),
            "model": sync_raw.get("model"),
            "status": sync_raw.get("status", "unavailable"),
            "time_ranges": sync_raw.get("time_ranges", []),
            "message": sync_raw.get("message", ""),
        }
    else:
        sync_section = {
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "model": None,
            "status": "unavailable",
            "time_ranges": [],
            "message": "Video input is required for audio-visual lip synchronization analysis.",
        }

    # Clean up temporary extracted audio file if requested
    if cleanup_temp_audio and extracted_temp_audio and os.path.exists(extracted_temp_audio):
        try:
            os.remove(extracted_temp_audio)
        except OSError:
            pass

    # Determine overall status
    statuses = [audio_section["status"], transcription_section["status"], sync_section["status"]]
    if all(s == "success" for s in statuses):
        overall_status = "success"
        overall_msg = "Complete audio, speech, and lip-sync analysis succeeded."
    elif any(s == "success" for s in statuses):
        overall_status = "partial"
        overall_msg = "Partial audio analysis completed with some module alerts/unavailability."
    else:
        overall_status = "error"
        overall_msg = "Audio analysis pipeline could not produce results."

    return {
        "status": overall_status,
        "audio": audio_section,
        "transcription": transcription_section,
        "sync": sync_section,
        "message": overall_msg,
    }
