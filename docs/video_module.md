# TrustLayer - Video / Visual ML Module

## Overview
The Video / Visual ML module implements the primary visual manipulation and synthetic content detection pipeline for TrustLayer (Member 1 scope). It operates on input video files, validates stream integrity, samples frames with precise temporal timestamps, extracts face regions, runs pretrained Vision Transformer deepfake inference, and aggregates frame signals into a structured visual evidence object conforming to the PRD Evidence Model.

---

## Architecture & Data Flow

```
Input Video (.mp4, .avi, .mov, .webm)
  ↓
[VideoPreprocessor] (backend/preprocessing/video.py)
  - File validation (existence, size, container format)
  - Stream metadata extraction (FPS, duration, resolution, frame count)
  ↓
[FrameExtractor] (backend/preprocessing/frames.py)
  - Memory-bounded frame sampling (configurable sample_fps & max_frames)
  - Accurate frame_index and timestamp preservation (timestamp = frame_index / fps)
  ↓
[FaceConsistencyDetector] (backend/models/face_consistency.py) - Supporting P1
  - YuNet neural face detection
  - Multi-frame appearance consistency analysis (normalized HSV & gradient correlation)
  ↓
[VideoDetector] (backend/models/video_detector.py) - P0 Core
  - Frame preprocessing (adaptive face crop or center framing to 224x224 RGB)
  - Pretrained ViT inference (`dima806/deepfake_vs_real_image_detection`)
  - Deterministic score aggregation (mean + top-25% localized manipulation detection)
  - Uncertainty estimation & temporal localization of suspicious intervals
  ↓
Structured Evidence Object (PRD Common Evidence Format)
```

---

## Model Selection

- **Pretrained Architecture**: `dima806/deepfake_vs_real_image_detection`
- **Backbone**: Vision Transformer (`google/vit-base-patch16-224-in21k`) fine-tuned for real vs. synthetic/deepfake classification.
- **Why Selected**:
  1. Fast CPU/GPU inference suitable for 24-hour hackathon constraints and short video clips (<= 60s).
  2. Proven Hugging Face pretrained weights; no training from scratch required.
  3. Evaluates high-frequency blending and generative artifacts across individual frames.
  4. Fully modular: replaceable with other vision backbones without modifying the TrustLayer architecture.

---

## Integration Contract: How to Call from Backend

Member 3 (Fusion Engine / FastAPI) can call the video pipeline via a single clean function:

```python
from backend.models.video_detector import analyze_video

# Run full visual analysis
result = analyze_video(
    video_path="path/to/video.mp4",
    sample_fps=1.0,           # Sample 1 frame per second
    max_frames=30,            # Bounded for memory efficiency
    include_face_consistency=True  # Optional P1 signal
)
```

### Output Schema (PRD Evidence Model Compliant)

```json
{
  "modality": "video",
  "signal_type": "visual_synthetic",
  "score": 0.7245,
  "direction": "suspicious",
  "uncertainty": 0.182,
  "time_range": {
    "start": 14.0,
    "end": 18.5
  },
  "evidence": "Visual manipulation indicators detected (score: 0.72, uncertainty: 0.18) across 20 analyzed frames (18 with detected faces). Suspicious interval(s): 14.0s-18.5s.",
  "suspicious_intervals": [
    {
      "start": 14.0,
      "end": 18.5
    }
  ],
  "frames_analyzed": 20,
  "face_consistency": {
    "face_detected": true,
    "faces_analyzed": 18,
    "consistency_score": 0.88,
    "evidence": "Face appearance exhibits high consistency (0.88) across 18 sampled frames"
  },
  "metadata": {
    "duration_seconds": 20.0,
    "fps": 25.0,
    "frame_count": 500,
    "width": 1280,
    "height": 720,
    "is_valid": true
  },
  "status": "success"
}
```

---

## Score Interpretation & Uncertainty Handling

1. **Deterministic Aggregation**:
   - `mean_score`: Global average synthetic probability across sampled frames.
   - `top_25%_score`: Average of highest 25% synthetic frames to detect localized temporal splicing.
   - `aggregated_score = 0.5 * mean_score + 0.5 * top_25%_score`.

2. **Direction**:
   - `score >= 0.58`: `"suspicious"`
   - `score <= 0.42`: `"authentic"`
   - `0.42 < score < 0.58`: `"inconclusive"`

3. **Uncertainty**:
   - Explicitly calculated from distance to decision boundary and inter-frame score variance (`std_dev`).
   - Higher when frames disagree or predictions cluster around 0.50.

4. **Missing Evidence Rule (PRD Section 18)**:
   - Missing or corrupt video does NOT return `"authentic"`.
   - Returns `status="insufficient_evidence"`, `score=None`, `uncertainty=1.0`, and `direction="inconclusive"`.

5. **Face Consistency Rule (PRD Section 11)**:
   - Treated strictly as supporting evidence, NOT as proof of authenticity or manipulation.
   - If no face is detected, gracefully reports `face_detected=False` without failing the pipeline.

---

## Limitations

1. Vision Transformer operates on static frame representations; fine-grained temporal micro-jitter is best complemented by Audio-Visual Lip-Sync (SyncNet) in the Fusion Engine.
2. Highly compressed or heavily re-encoded videos may produce elevated uncertainty due to compression artifacts.
