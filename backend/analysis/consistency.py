"""Cross-modal consistency analysis for TrustLayer.

Calculates how well available modalities (e.g. video, audio, text) agree with each other.
Returns a score between 0.0 (high discordance/mismatch) and 1.0 (high cross-modal agreement).
When evidence is insufficient or missing, returns a neutral default (0.50) rather than
assuming authenticity.
"""

from itertools import combinations
from typing import Optional

try:
    from backend.analysis.evidence import Evidence
except ImportError:
    from analysis.evidence import Evidence


class ConsistencyAnalyzer:
    """Deterministic analyzer for cross-modal consistency."""

    DEFAULT_CONSISTENCY: float = 0.50

    def __init__(self, default_consistency: float = DEFAULT_CONSISTENCY):
        self.default_consistency = default_consistency

    def calculate_consistency(self, evidence: list[Evidence]) -> float:
        """Calculate cross-modal consistency across evidence items.

        Args:
            evidence: List of forensic evidence items.

        Returns:
            Consistency score between 0.0 and 1.0.
        """
        if not evidence:
            return self.default_consistency

        # 1. Handle explicit consistency modality items (e.g., AV-sync / alignment detectors)
        consistency_items = [
            e for e in evidence
            if e.modality.lower() in ("consistency", "audio_video")
            or e.signal.lower() in ("lip_sync", "av_sync")
        ]
        if consistency_items:
            scores: list[float] = []
            for item in consistency_items:
                if (
                    "mismatch" in item.signal.lower()
                    or "inconsistency" in item.signal.lower()
                    or item.signal.lower() in ("lip_sync", "av_sync")
                    or item.modality.lower() == "audio_video"
                ):
                    # High mismatch score means low consistency
                    scores.append(1.0 - item.score)
                else:
                    scores.append(item.score)
            avg_score = sum(scores) / len(scores)
            return round(max(0.0, min(1.0, float(avg_score))), 4)

        # 2. Group forensic evidence by modality
        forensic_evidence = [
            e for e in evidence
            if e.modality.lower() not in ("consistency", "audio_video")
            and e.signal.lower() not in ("lip_sync", "av_sync")
        ]
        by_modality: dict[str, list[Evidence]] = {}
        for item in forensic_evidence:
            by_modality.setdefault(item.modality.lower(), []).append(item)

        # Insufficient modality coverage to measure cross-modal agreement
        if len(by_modality) < 2:
            return self.default_consistency

        # 3. Compute representative score per modality (peak anomaly)
        modality_scores = {
            mod: max(item.score for item in items)
            for mod, items in by_modality.items()
        }

        # 4. Compute pairwise agreement across modalities: agreement = 1.0 - |s1 - s2|
        scores = list(modality_scores.values())
        pairs = list(combinations(scores, 2))
        if not pairs:
            return self.default_consistency

        agreements = [1.0 - abs(s1 - s2) for s1, s2 in pairs]
        mean_consistency = sum(agreements) / len(agreements)
        return round(max(0.0, min(1.0, float(mean_consistency))), 4)


def calculate_consistency(
    evidence: list[Evidence],
    default: float = ConsistencyAnalyzer.DEFAULT_CONSISTENCY,
) -> float:
    """Convenience function to calculate cross-modal consistency."""
    return ConsistencyAnalyzer(default_consistency=default).calculate_consistency(evidence)
