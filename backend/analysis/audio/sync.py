"""Audio-Visual synchronization and lip-sync mismatch detection module.

Analyzes temporal synchronization between spoken speech audio and facial/mouth
video movements using the Oxford VGG SyncNet model.
"""

import math
import os
import tempfile
from typing import Any, Dict, List, Optional, Tuple

import numpy as np


def _calc_pdist(feat1, feat2, vshift: int = 15):
    """Compute pairwise L2 distances across temporal shifts."""
    import torch
    import torch.nn.functional as F

    win_size = vshift * 2 + 1
    feat2p = F.pad(feat2, (0, 0, vshift, vshift))

    dists = []
    for i in range(len(feat1)):
        dists.append(
            F.pairwise_distance(feat1[[i], :].repeat(win_size, 1), feat2p[i : i + win_size, :])
        )
    return dists


def _extract_aligned_frames_and_audio(
    video_path: str, audio_path: Optional[str] = None
) -> Tuple[List[np.ndarray], np.ndarray, int]:
    """Read 25 fps video frames and 16 kHz audio for SyncNet."""
    import cv2
    import soundfile as sf
    from .extraction import extract_audio_from_video

    # 1. Resolve Audio (16 kHz mono)
    if audio_path is None or not os.path.exists(audio_path):
        ext_res = extract_audio_from_video(video_path)
        audio_file = ext_res["audio_path"]
    else:
        audio_file = audio_path

    audio_data, sr = sf.read(audio_file, dtype="float32")
    if audio_data.ndim > 1:
        audio_data = np.mean(audio_data, axis=1)

    if sr != 16000:
        import torch
        import torchaudio.transforms as T

        t_data = torch.from_numpy(audio_data).unsqueeze(0)
        resampler = T.Resample(sr, 16000)
        audio_data = resampler(t_data).squeeze(0).numpy()
        sr = 16000

    # 2. Read Video Frames and crop face/mouth
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video file: {video_path}")

    # Face detector initialization (optional fallback to central ROI if CascadeClassifier is unavailable)
    face_cascade = None
    if hasattr(cv2, "CascadeClassifier") and hasattr(cv2, "data") and hasattr(cv2.data, "haarcascades"):
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        if os.path.exists(cascade_path):
            try:
                face_cascade = cv2.CascadeClassifier(cascade_path)
            except Exception:
                face_cascade = None

    raw_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        raw_frames.append(frame)
    cap.release()

    if not raw_frames:
        raise RuntimeError(f"Video file contains no frames: {video_path}")

    # Detect face bounding box (or use center fallback)
    last_box = None
    cropped_frames = []
    for frame in raw_frames:
        h, w = frame.shape[:2]
        faces = ()
        if face_cascade is not None:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4)

        if len(faces) > 0:
            # Pick largest face
            faces = sorted(faces, key=lambda b: b[2] * b[3], reverse=True)
            x, y, fw, fh = faces[0]
            last_box = (x, y, fw, fh)
        elif last_box is not None:
            x, y, fw, fh = last_box
        else:
            # Fallback center crop (standard bounding region)
            fw = int(w * 0.6)
            fh = int(h * 0.6)
            x = (w - fw) // 2
            y = (h - fh) // 2

        # Crop to face/mouth region (224x224 RGB/BGR)
        face_img = frame[max(0, y) : min(h, y + fh), max(0, x) : min(w, x + fw)]
        if face_img.size == 0:
            face_img = frame
        resized = cv2.resize(face_img, (224, 224))
        cropped_frames.append(resized)

    return cropped_frames, audio_data, sr


def check_av_sync(
    video_path: str,
    audio_path: Optional[str] = None,
    face_landmarks_data: Optional[Any] = None,
    vshift: int = 15,
    batch_size: int = 20,
) -> Dict[str, Any]:
    """Evaluate audio-visual synchronization and detect lip-sync anomalies.

    Uses pretrained Oxford VGG SyncNet to measure temporal correlation between
    speech MFCC features and video lip movements.

    Args:
        video_path: Path to target video file.
        audio_path: Optional path to extracted 16kHz WAV file.
        face_landmarks_data: Optional visual landmarks (if passed by vision pipeline).
        vshift: Number of frame shifts (+/-) to search for optimal synchronization (default: 15 frames = +/-0.6s).
        batch_size: Evaluation batch size.

    Returns:
        Dict adhering to TrustLayer schema:
            - status: str ("success" | "unavailable")
            - model: Optional[str] ("SyncNet-v2")
            - lip_sync_score: Optional[float] (0.0 to 1.0; 1.0 = perfectly synced, 0.0 = desynced)
            - detected_offset_seconds: Optional[float] (estimated audio lead/lag in seconds)
            - time_ranges: List[Dict[str, Any]] (suspicious unsynchronized intervals)
            - message: str
    """
    if not os.path.exists(video_path) or not os.path.isfile(video_path):
        return {
            "status": "unavailable",
            "model": None,
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "time_ranges": [],
            "message": f"Video file does not exist: {video_path}",
        }

    # Verify dependencies
    try:
        import cv2  # noqa: F401
        import python_speech_features
        import torch
        from scipy import signal
        from .model_loader import load_syncnet_model
    except ImportError as err:
        return {
            "status": "unavailable",
            "model": None,
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "time_ranges": [],
            "message": f"SyncNet dependency missing: {err}",
        }

    # Load cached SyncNet model
    try:
        model = load_syncnet_model(device="cpu")
    except Exception as err:
        return {
            "status": "unavailable",
            "model": None,
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "time_ranges": [],
            "message": f"Failed to load SyncNet weights: {err}",
        }

    # Extract aligned video and audio
    try:
        frames, audio_data, sr = _extract_aligned_frames_and_audio(video_path, audio_path)
    except Exception as err:
        return {
            "status": "unavailable",
            "model": "SyncNet-v2",
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "time_ranges": [],
            "message": f"Failed to extract video/audio frames for sync analysis: {err}",
        }

    # Check minimum length (requires at least 5 frames = 0.2s)
    min_length = min(len(frames), math.floor(len(audio_data) / 640))
    if min_length < 6:
        return {
            "status": "unavailable",
            "model": "SyncNet-v2",
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "time_ranges": [],
            "message": "Input video/audio duration is too short for sync analysis (min 6 frames required).",
        }

    try:
        # Prepare video tensor: shape (1, 3, T, 224, 224)
        im = np.stack(frames[:min_length], axis=3)
        im = np.expand_dims(im, axis=0)
        im = np.transpose(im, (0, 3, 4, 1, 2))  # (1, C, T, H, W)
        imtv = torch.from_numpy(im.astype(float)).float()

        # Prepare audio MFCC tensor (13 mfcc coefficients across 4 steps per video frame)
        # Convert float32 [-1, 1] to 16-bit PCM scale expected by python_speech_features
        pcm16_audio = (audio_data * 32767.0).astype(np.int16)
        mfcc = zip(*python_speech_features.mfcc(pcm16_audio, sr))
        mfcc = np.stack([np.array(i) for i in mfcc])
        cc = np.expand_dims(np.expand_dims(mfcc, axis=0), axis=0)
        cct = torch.from_numpy(cc.astype(float)).float()

        lastframe = min_length - 5
        im_feat = []
        cc_feat = []

        with torch.no_grad():
            for i in range(0, lastframe, batch_size):
                cur_batch_end = min(lastframe, i + batch_size)

                im_batch = [imtv[:, :, vframe : vframe + 5, :, :] for vframe in range(i, cur_batch_end)]
                im_in = torch.cat(im_batch, 0)
                im_out = model.forward_lip(im_in)
                im_feat.append(im_out.data.cpu())

                cc_batch = [cct[:, :, :, vframe * 4 : vframe * 4 + 20] for vframe in range(i, cur_batch_end)]
                cc_in = torch.cat(cc_batch, 0)
                cc_out = model.forward_aud(cc_in)
                cc_feat.append(cc_out.data.cpu())

            im_feat = torch.cat(im_feat, 0)
            cc_feat = torch.cat(cc_feat, 0)

            # Compute pairwise distance cross correlation across vshift
            vshift_actual = min(vshift, max(1, lastframe - 1))
            dists = _calc_pdist(im_feat, cc_feat, vshift=vshift_actual)
            mdist = torch.mean(torch.stack(dists, 1), 1)

            minval, minidx = torch.min(mdist, 0)
            offset_frames = int(vshift_actual - minidx.item())

            # 25 fps assumed in standard SyncNet pipeline
            detected_offset_sec = round(float(offset_frames) / 25.0, 3)

            # Raw distance: typically ~4.0 to ~6.0 for genuine sync, >8.0 for desynced
            # Confidence metric: median distance - min distance
            conf = float(torch.median(mdist).item() - minval.item())
            min_dist = float(minval.item())

            # Normalize lip sync score to [0.0, 1.0] where 1.0 = strong sync, 0.0 = desync
            # Standard SyncNet threshold: min_dist <= 6.0 and conf >= 2.0 indicates strong sync
            raw_sync_metric = (10.0 - min_dist) / 5.0
            if abs(detected_offset_sec) > 0.12:  # audio/video lag > 3 frames
                raw_sync_metric -= min(0.5, abs(detected_offset_sec))
            lip_sync_score = round(float(max(0.0, min(1.0, raw_sync_metric))), 4)

            # Detect suspicious intervals (framewise distance anomaly)
            time_ranges: List[Dict[str, Any]] = []
            if len(dists) > 0:
                fdist = np.stack([dist[minidx].numpy() for dist in dists])
                fconf = float(torch.median(mdist).numpy()) - fdist
                filt_conf = signal.medfilt(fconf, kernel_size=min(9, max(3, len(fconf) if len(fconf) % 2 == 1 else len(fconf) - 1)))

                # Suspicious segments where local confidence drops below 0.5
                suspicious_indices = np.where(filt_conf < 0.5)[0]
                if len(suspicious_indices) > 0:
                    start_idx = suspicious_indices[0]
                    prev_idx = start_idx
                    for cur_idx in suspicious_indices[1:]:
                        if cur_idx == prev_idx + 1:
                            prev_idx = cur_idx
                        else:
                            start_t = round(float(start_idx) / 25.0, 2)
                            end_t = round(float(prev_idx + 5) / 25.0, 2)
                            if end_t - start_t >= 0.2:
                                time_ranges.append(
                                    {
                                        "start": start_t,
                                        "end": end_t,
                                        "reason": "Lip-sync anomaly: mouth movement does not match audio phonemes",
                                    }
                                )
                            start_idx = cur_idx
                            prev_idx = cur_idx
                    # append trailing
                    start_t = round(float(start_idx) / 25.0, 2)
                    end_t = round(float(prev_idx + 5) / 25.0, 2)
                    if end_t - start_t >= 0.2:
                        time_ranges.append(
                            {
                                "start": start_t,
                                "end": end_t,
                                "reason": "Lip-sync anomaly: mouth movement does not match audio phonemes",
                            }
                        )

            msg = (
                f"SyncNet evaluation completed. Lip sync score: {lip_sync_score:.4f}, "
                f"estimated AV offset: {detected_offset_sec:+.3f}s (min dist: {min_dist:.2f}, conf: {conf:.2f})."
            )

            # Normalize confidence: SyncNet conf typically ranges 0.0 to 4.0+ where >= 2.0 is high confidence
            norm_confidence = round(float(max(0.0, min(1.0, conf / 2.0))), 4)

            # If confidence is below statistical threshold, AV sync cannot be reliably verified
            # Treat as unavailable rather than falsely asserting 100% desync manipulation
            if conf < 1.5 and min_dist > 7.5:
                return {
                    "status": "unavailable",
                    "model": "SyncNet-v2",
                    "lip_sync_score": None,
                    "confidence": norm_confidence,
                    "detected_offset_seconds": None,
                    "time_ranges": [],
                    "message": (
                        f"SyncNet correlation below threshold (min dist: {min_dist:.2f}, conf: {conf:.2f}). "
                        f"Audio-visual alignment unverified."
                    ),
                }

            return {
                "status": "success",
                "model": "SyncNet-v2",
                "lip_sync_score": lip_sync_score,
                "confidence": norm_confidence,
                "detected_offset_seconds": detected_offset_sec,
                "time_ranges": time_ranges,
                "message": msg,
            }

    except Exception as err:
        return {
            "status": "unavailable",
            "model": "SyncNet-v2",
            "lip_sync_score": None,
            "detected_offset_seconds": None,
            "time_ranges": [],
            "message": f"SyncNet inference failed: {err}",
        }
