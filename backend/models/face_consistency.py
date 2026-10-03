"""
TrustLayer - Face Consistency & Detection Module (Supporting P1)
Provides face detection and face appearance consistency analysis across sampled video frames.

IMPORTANT DESIGN RULE (from PRD Section 11):
The face-consistency signal is treated as evidence, NOT as independent proof
of deepfake generation or authenticity. Face appearance can vary due to pose,
lighting, occlusion, and legitimate camera motion.
"""

import logging
import os
import threading
import urllib.request
from dataclasses import dataclass
from typing import List, Optional, Tuple
import cv2
import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class DetectedFace:
    frame_index: int
    timestamp: float
    bbox: Tuple[int, int, int, int]  # (x, y, w, h)
    face_crop: np.ndarray


@dataclass
class FaceConsistencyResult:
    face_detected: bool
    faces_analyzed: int
    consistency_score: Optional[float]  # [0.0, 1.0] or None if < 2 faces
    evidence: str
    face_regions: List[dict]

    def to_dict(self) -> dict:
        return {
            "face_detected": self.face_detected,
            "faces_analyzed": self.faces_analyzed,
            "consistency_score": self.consistency_score,
            "evidence": self.evidence,
            "face_regions": self.face_regions,
        }


class FaceConsistencyDetector:
    """
    Detects faces across video frames and evaluates face appearance consistency
    across frames using standardized feature representations.
    Uses OpenCV's neural YuNet face detector with local caching.
    """

    YUNET_URLS = [
        "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
        "https://raw.githubusercontent.com/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
    ]
    # Backward compatibility attribute
    YUNET_URL = YUNET_URLS[0]

    def __init__(self, cache_dir: Optional[str] = None):
        self.cache_dir = cache_dir or os.path.expanduser("~/.cache/trustlayer")
        os.makedirs(self.cache_dir, exist_ok=True)
        self.model_path = os.path.join(self.cache_dir, "face_detection_yunet_2023mar.onnx")
        self._detector = None
        self._detector_input_size = None
        self._init_lock = threading.Lock()
        self._is_initialized = False

    def _ensure_weights(self) -> bool:
        """Ensures YuNet model weights are downloaded, verified, and available."""
        # Expected YuNet 2023mar ONNX size is ~232 KB (> 150 KB)
        if os.path.exists(self.model_path) and os.path.getsize(self.model_path) > 150000:
            return True

        temp_path = self.model_path + ".tmp"
        for url in self.YUNET_URLS:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "TrustLayer/1.0"})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()

                if len(data) > 150000:
                    with open(temp_path, "wb") as f:
                        f.write(data)
                    os.replace(temp_path, self.model_path)
                    logger.info("Successfully downloaded YuNet weights to %s", self.model_path)
                    return True
            except Exception as e:
                logger.warning("Failed to download YuNet weights from %s: %s", url, str(e))
                if os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except OSError:
                        pass
        return False

    def _get_detector(self):
        """Lazily initializes and returns FaceDetectorYN instance in a thread-safe manner."""
        if self._is_initialized:
            return self._detector

        with self._init_lock:
            if self._is_initialized:
                return self._detector

            if not hasattr(cv2, "FaceDetectorYN_create"):
                logger.warning("cv2.FaceDetectorYN_create not available in this OpenCV environment")
                self._is_initialized = True
                return None

            if self._ensure_weights():
                try:
                    self._detector = cv2.FaceDetectorYN_create(
                        self.model_path,
                        "",
                        (320, 240),
                        score_threshold=0.6,
                        nms_threshold=0.3,
                        top_k=5000,
                    )
                    self._detector_input_size = (320, 240)
                except Exception as e:
                    logger.warning("Failed to load YuNet ONNX model from %s: %s", self.model_path, str(e))
                    if os.path.exists(self.model_path):
                        try:
                            os.remove(self.model_path)
                        except OSError:
                            pass
                    self._detector = None
            else:
                logger.warning("YuNet weights unavailable; face detection will operate in fallback mode")
                self._detector = None

            self._is_initialized = True
            return self._detector

    def detect_face(self, frame_bgr: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
        """
        Detects primary face bounding box (x, y, w, h) in a single BGR frame.
        Returns the largest detected face box, or None if no face is found.
        """
        if frame_bgr is None or frame_bgr.size == 0:
            return None

        detector = self._get_detector()
        if detector is None:
            return None

        h, w = frame_bgr.shape[:2]
        if (w, h) != self._detector_input_size:
            detector.setInputSize((w, h))
            self._detector_input_size = (w, h)

        try:
            _, faces = detector.detect(frame_bgr)
            if faces is None or len(faces) == 0:
                return None

            # faces is ndarray: [[x, y, w, h, ...]]
            # Find largest face by area
            largest_face = max(faces, key=lambda f: float(f[2] * f[3]))
            x = max(0, int(largest_face[0]))
            y = max(0, int(largest_face[1]))
            bw = min(w - x, int(largest_face[2]))
            bh = min(h - y, int(largest_face[3]))

            if bw <= 10 or bh <= 10:
                return None

            return (x, y, bw, bh)
        except Exception:
            return None

    def extract_face_crop(
        self, frame_bgr: np.ndarray, bbox: Tuple[int, int, int, int], margin_pct: float = 0.15
    ) -> np.ndarray:
        """
        Extracts cropped face with proportional margin.
        """
        h_img, w_img = frame_bgr.shape[:2]
        x, y, w, h = bbox

        mx = int(w * margin_pct)
        my = int(h * margin_pct)

        x1 = max(0, x - mx)
        y1 = max(0, y - my)
        x2 = min(w_img, x + w + mx)
        y2 = min(h_img, y + h + my)

        crop = frame_bgr[y1:y2, x1:x2]
        if crop.size == 0:
            return frame_bgr
        return crop

    def _compute_face_feature_vector(self, face_crop: np.ndarray) -> np.ndarray:
        """
        Computes standardized color and texture feature vector for comparing face consistency.
        """
        resized = cv2.resize(face_crop, (96, 96))
        hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)

        # 3D HSV histogram normalized
        hist = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])
        cv2.normalize(hist, hist)
        return hist.flatten()

    def analyze_consistency(self, sampled_frames: List) -> FaceConsistencyResult:
        """
        Analyzes face presence and consistency across a list of FrameData items.
        """
        detected_faces: List[DetectedFace] = []

        for item in sampled_frames:
            if isinstance(item, dict):
                frame = item.get("frame")
                idx = item.get("frame_index", 0)
                t = item.get("timestamp", 0.0)
            else:
                frame = getattr(item, "frame", None)
                idx = getattr(item, "frame_index", 0)
                t = getattr(item, "timestamp", 0.0)

            if frame is None:
                continue

            bbox = self.detect_face(frame)
            if bbox is not None:
                crop = self.extract_face_crop(frame, bbox)
                detected_faces.append(
                    DetectedFace(
                        frame_index=idx,
                        timestamp=t,
                        bbox=bbox,
                        face_crop=crop,
                    )
                )

        if not detected_faces:
            return FaceConsistencyResult(
                face_detected=False,
                faces_analyzed=0,
                consistency_score=None,
                evidence="No face detected in sampled video frames (content may be non-facial or occluded)",
                face_regions=[],
            )

        if len(detected_faces) == 1:
            return FaceConsistencyResult(
                face_detected=True,
                faces_analyzed=1,
                consistency_score=1.0,
                evidence="Single face instance detected; temporal cross-frame comparison unavailable",
                face_regions=[
                    {
                        "frame_index": detected_faces[0].frame_index,
                        "timestamp": detected_faces[0].timestamp,
                        "bbox": detected_faces[0].bbox,
                    }
                ],
            )

        # Compute pairwise consecutive correlation across detected faces
        similarities = []
        vectors = [self._compute_face_feature_vector(df.face_crop) for df in detected_faces]

        for i in range(len(vectors) - 1):
            sim = cv2.compareHist(vectors[i], vectors[i + 1], cv2.HISTCMP_CORREL)
            clamped_sim = max(0.0, min(1.0, float(sim)))
            similarities.append(clamped_sim)

        avg_consistency = float(np.mean(similarities)) if similarities else 1.0

        if avg_consistency >= 0.70:
            evidence_desc = (
                f"Face appearance exhibits high consistency ({avg_consistency:.2f}) "
                f"across {len(detected_faces)} sampled frames"
            )
        elif avg_consistency >= 0.40:
            evidence_desc = (
                f"Face appearance exhibits moderate consistency ({avg_consistency:.2f}); "
                f"variations may stem from lighting or pose"
            )
        else:
            evidence_desc = (
                f"Face appearance exhibits low consistency ({avg_consistency:.2f}) "
                f"indicating potential visual anomalies or identity shifts"
            )

        face_regions_summary = [
            {
                "frame_index": df.frame_index,
                "timestamp": round(df.timestamp, 3),
                "bbox": df.bbox,
            }
            for df in detected_faces
        ]

        return FaceConsistencyResult(
            face_detected=True,
            faces_analyzed=len(detected_faces),
            consistency_score=round(avg_consistency, 3),
            evidence=evidence_desc,
            face_regions=face_regions_summary,
        )


_face_detector = FaceConsistencyDetector()


def detect_face(frame_bgr: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    """Helper to detect face in a single frame."""
    return _face_detector.detect_face(frame_bgr)


def extract_face_crop(
    frame_bgr: np.ndarray, bbox: Tuple[int, int, int, int], margin_pct: float = 0.15
) -> np.ndarray:
    """Helper to crop detected face."""
    return _face_detector.extract_face_crop(frame_bgr, bbox, margin_pct=margin_pct)


def analyze_face_consistency(sampled_frames: List) -> FaceConsistencyResult:
    """Helper to analyze face consistency across frames."""
    return _face_detector.analyze_consistency(sampled_frames)
