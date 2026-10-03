"""
TrustLayer - Visual Synthetic & Manipulation Detector Module
Integrates a pretrained visual deepfake/synthetic detector to analyze video frames.

ARCHITECTURE COMPLIANCE:
- Operates on sampled video frames.
- Uses a REAL pretrained model: 'dima806/deepfake_vs_real_image_detection' (Vision Transformer fine-tuned on deepfake classification).
- Separates frame preprocessing, model inference, and score aggregation.
- Produces structured evidence adhering strictly to the PRD Evidence Model.
- Does NOT decide final TrustLayer verdicts (that belongs to the Fusion Engine).
- Preserves PRD Rule: MISSING EVIDENCE IS NOT EVIDENCE OF AUTHENTICITY.
"""

from dataclasses import dataclass, asdict
from typing import List, Optional, Tuple, Dict, Any
import numpy as np
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

from backend.preprocessing.video import get_video_metadata, VideoMetadata
from backend.preprocessing.frames import sample_frames, FrameData
from backend.models.face_consistency import (
    detect_face,
    extract_face_crop,
    analyze_face_consistency,
    FaceConsistencyResult,
)


@dataclass
class FrameScore:
    frame_index: int
    timestamp: float
    fake_score: float  # Probability of synthetic/manipulated [0.0, 1.0]
    real_score: float  # Probability of authentic [0.0, 1.0]
    face_detected: bool

    def to_dict(self) -> dict:
        return asdict(self)


class VideoDetector:
    """
    Pretrained visual manipulation/synthetic content detector.
    Evaluates sampled video frames using a fine-tuned Vision Transformer.
    """

    MODEL_NAME = "dima806/deepfake_vs_real_image_detection"

    def __init__(self, device: Optional[str] = None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self._processor = None
        self._model = None
        self._is_loaded = False

    def load_model(self) -> None:
        """
        Loads the pretrained model and image processor from local cache or Hub.
        """
        if self._is_loaded:
            return

        try:
            self._processor = AutoImageProcessor.from_pretrained(self.MODEL_NAME)
            self._model = AutoModelForImageClassification.from_pretrained(self.MODEL_NAME)
            self._model.to(self.device)
            self._model.eval()
            self._is_loaded = True
        except Exception as e:
            self._is_loaded = False
            raise RuntimeError(
                f"Failed to load pretrained visual model '{self.MODEL_NAME}': {str(e)}"
            )

    # ==========================================================
    # 1. FRAME PREPROCESSING
    # ==========================================================
    def preprocess_frame(self, frame_bgr: np.ndarray) -> Tuple[Image.Image, bool]:
        """
        Preprocesses an OpenCV BGR frame for ViT input.
        If a face region is detected, crops the face with a natural boundary.
        If no face is detected, extracts a center crop.
        Returns the PIL RGB image and a boolean indicating whether a face was cropped.
        """
        bbox = detect_face(frame_bgr)
        if bbox is not None:
            crop_bgr = extract_face_crop(frame_bgr, bbox, margin_pct=0.15)
            face_detected = True
        else:
            # Fall back to center crop of full frame to focus on central visual subject
            h, w = frame_bgr.shape[:2]
            crop_dim = min(h, w)
            top = (h - crop_dim) // 2
            left = (w - crop_dim) // 2
            crop_bgr = frame_bgr[top : top + crop_dim, left : left + crop_dim]
            face_detected = False

        # Convert OpenCV BGR to RGB PIL image
        rgb_img = cv2_to_pil(crop_bgr)
        return rgb_img, face_detected

    # ==========================================================
    # 2. MODEL INFERENCE
    # ==========================================================
    def infer_frame(self, pil_image: Image.Image) -> Tuple[float, float]:
        """
        Runs model inference on a single preprocessed frame.
        Returns: (fake_prob, real_prob)
        """
        if not self._is_loaded:
            self.load_model()

        inputs = self._processor(images=pil_image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self._model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)[0]

        # Model labels: 0 -> 'Real', 1 -> 'Fake'
        real_prob = float(probs[0].cpu().item())
        fake_prob = float(probs[1].cpu().item())
        return fake_prob, real_prob

    def infer_frames(self, sampled_frames: List[FrameData]) -> List[FrameScore]:
        """
        Processes a sequence of sampled frames and computes synthetic scores for each.
        """
        frame_scores: List[FrameScore] = []

        for f_data in sampled_frames:
            pil_img, face_found = self.preprocess_frame(f_data.frame)
            fake_p, real_p = self.infer_frame(pil_img)
            frame_scores.append(
                FrameScore(
                    frame_index=f_data.frame_index,
                    timestamp=round(f_data.timestamp, 3),
                    fake_score=round(fake_p, 4),
                    real_score=round(real_p, 4),
                    face_detected=face_found,
                )
            )

        return frame_scores

    # ==========================================================
    # 3. SCORE AGGREGATION & TEMPORAL LOCALIZATION
    # ==========================================================
    @staticmethod
    def aggregate_scores(
        frame_scores: List[FrameScore],
    ) -> Tuple[float, float, str, List[Dict[str, float]]]:
        """
        Deterministic aggregation of frame-level signals:
        1. Mean synthetic score across frames.
        2. Top-25% synthetic score to detect localized temporal manipulations.
        3. Aggregated score = 0.5 * mean + 0.5 * top_25% score.
        4. Uncertainty = calculated from score variance and decision boundary margin.
        5. Suspicious intervals: contiguous frames where fake_score >= 0.60.

        Returns: (aggregated_score, uncertainty, direction, suspicious_intervals)
        """
        if not frame_scores:
            return 0.0, 1.0, "inconclusive", []

        fake_scores = np.array([fs.fake_score for fs in frame_scores], dtype=float)

        mean_score = float(np.mean(fake_scores))
        top_k_count = max(1, int(np.ceil(len(fake_scores) * 0.25)))
        sorted_scores = np.sort(fake_scores)
        top_k_mean = float(np.mean(sorted_scores[-top_k_count:]))

        # Balanced aggregation: sensitive to both clip-wide and localized manipulation
        aggregated = 0.5 * mean_score + 0.5 * top_k_mean
        aggregated_score = round(float(np.clip(aggregated, 0.0, 1.0)), 4)

        # Uncertainty estimation:
        # Higher when score is close to 0.5 (decision boundary) or standard deviation is high
        std_dev = float(np.std(fake_scores)) if len(fake_scores) > 1 else 0.15
        margin = abs(aggregated_score - 0.5)
        raw_uncertainty = (0.5 - margin) * 1.2 + 0.4 * std_dev
        uncertainty = round(float(np.clip(raw_uncertainty, 0.05, 0.95)), 3)

        # Direction classification based on model evidence
        if aggregated_score >= 0.58:
            direction = "suspicious"
        elif aggregated_score <= 0.42:
            direction = "authentic"
        else:
            direction = "inconclusive"

        # Temporal localization: detect suspicious intervals (fake_score >= 0.60)
        suspicious_intervals: List[Dict[str, float]] = []
        suspicious_frames = [fs for fs in frame_scores if fs.fake_score >= 0.60]

        if suspicious_frames:
            # Group contiguous frames within 2.0 seconds window
            current_start = suspicious_frames[0].timestamp
            current_end = suspicious_frames[0].timestamp

            for i in range(1, len(suspicious_frames)):
                curr_t = suspicious_frames[i].timestamp
                if curr_t - current_end <= 2.0:
                    current_end = curr_t
                else:
                    suspicious_intervals.append(
                        {"start": round(current_start, 2), "end": round(current_end, 2)}
                    )
                    current_start = curr_t
                    current_end = curr_t

            suspicious_intervals.append(
                {"start": round(current_start, 2), "end": round(current_end, 2)}
            )

        return aggregated_score, uncertainty, direction, suspicious_intervals

    # ==========================================================
    # 4. STRUCTURED VIDEO RESULT (PRD Integration Contract)
    # ==========================================================
    def analyze_video(
        self,
        video_path: str,
        sample_fps: float = 1.0,
        max_frames: int = 30,
        include_face_consistency: bool = True,
    ) -> Dict[str, Any]:
        """
        Primary entry point for Member 3 / Fusion Engine.
        Executes end-to-end visual analysis and returns structured evidence object.
        """
        # Validate video
        metadata: VideoMetadata = get_video_metadata(video_path)
        if not metadata.is_valid:
            return {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": None,
                "direction": "inconclusive",
                "uncertainty": 1.0,
                "time_range": None,
                "evidence": f"Video validation failed: {metadata.error_message}",
                "suspicious_intervals": [],
                "frames_analyzed": 0,
                "face_consistency": None,
                "metadata": metadata.to_dict(),
                "status": "insufficient_evidence",
                "error": metadata.error_message,
            }

        # Sample frames
        frames = sample_frames(video_path, sample_fps=sample_fps, max_frames=max_frames)
        if not frames:
            return {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": None,
                "direction": "inconclusive",
                "uncertainty": 1.0,
                "time_range": None,
                "evidence": "No decodable frames could be extracted from video",
                "suspicious_intervals": [],
                "frames_analyzed": 0,
                "face_consistency": None,
                "metadata": metadata.to_dict(),
                "status": "insufficient_evidence",
                "error": "No frames extracted",
            }

        # Model inference on frames
        try:
            frame_scores = self.infer_frames(frames)
        except Exception as e:
            return {
                "modality": "video",
                "signal_type": "visual_synthetic",
                "score": None,
                "direction": "inconclusive",
                "uncertainty": 1.0,
                "time_range": None,
                "evidence": f"Visual model inference failed: {str(e)}",
                "suspicious_intervals": [],
                "frames_analyzed": len(frames),
                "face_consistency": None,
                "metadata": metadata.to_dict(),
                "status": "error",
                "error": str(e),
            }

        # Score aggregation
        score, uncertainty, direction, intervals = self.aggregate_scores(frame_scores)

        # Primary suspicious range (if intervals detected)
        primary_time_range = intervals[0] if intervals else None

        # Build descriptive evidence string
        faces_detected_count = sum(1 for fs in frame_scores if fs.face_detected)
        if direction == "suspicious":
            evidence_desc = (
                f"Visual manipulation indicators detected (score: {score:.2f}, uncertainty: {uncertainty:.2f}) "
                f"across {len(frame_scores)} analyzed frames ({faces_detected_count} with detected faces)."
            )
            if intervals:
                range_str = ", ".join(f"{iv['start']}s-{iv['end']}s" for iv in intervals)
                evidence_desc += f" Suspicious interval(s): {range_str}."
        elif direction == "authentic":
            evidence_desc = (
                f"Visual frames appear consistent with authentic media (synthetic score: {score:.2f}, "
                f"uncertainty: {uncertainty:.2f}) across {len(frame_scores)} sampled frames."
            )
        else:
            evidence_desc = (
                f"Visual evidence is inconclusive (synthetic score: {score:.2f}, uncertainty: {uncertainty:.2f}). "
                f"Signals do not clearly separate from baseline."
            )

        # Optional P1 Face consistency analysis
        face_result_dict = None
        if include_face_consistency:
            face_res: FaceConsistencyResult = analyze_face_consistency(frames)
            face_result_dict = face_res.to_dict()

        return {
            "modality": "video",
            "signal_type": "visual_synthetic",
            "score": score,
            "direction": direction,
            "uncertainty": uncertainty,
            "time_range": primary_time_range,
            "evidence": evidence_desc,
            "suspicious_intervals": intervals,
            "frames_analyzed": len(frame_scores),
            "face_consistency": face_result_dict,
            "metadata": metadata.to_dict(),
            "status": "success",
        }


def cv2_to_pil(frame_bgr: np.ndarray) -> Image.Image:
    """Helper to convert OpenCV BGR frame to PIL RGB Image."""
    import cv2
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)


# Default detector instance
_detector = VideoDetector()


def analyze_video(
    video_path: str,
    sample_fps: float = 1.0,
    max_frames: int = 30,
    include_face_consistency: bool = True,
) -> Dict[str, Any]:
    """
    Standard interface function for Member 3 / Fusion Engine:
    analyze_video(video_path) -> Dict adhering to PRD Evidence Model.
    """
    return _detector.analyze_video(
        video_path=video_path,
        sample_fps=sample_fps,
        max_frames=max_frames,
        include_face_consistency=include_face_consistency,
    )
