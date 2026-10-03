"""Conflict detection for forensic evidence in TrustLayer.

Detects explicit or contradictory evidence signals across the evidence set.
Missing evidence is never treated as conflict.
"""

try:
    from backend.analysis.evidence import Evidence
except ImportError:
    from analysis.evidence import Evidence


class ConflictDetector:
    """Deterministic conflict detector for forensic evidence."""

    CONFIDENCE_THRESHOLD: float = 0.60
    SUSPICIOUS_THRESHOLD: float = 0.65
    NORMAL_THRESHOLD: float = 0.35

    def __init__(
        self,
        confidence_threshold: float = CONFIDENCE_THRESHOLD,
        suspicious_threshold: float = SUSPICIOUS_THRESHOLD,
        normal_threshold: float = NORMAL_THRESHOLD,
    ):
        self.confidence_threshold = confidence_threshold
        self.suspicious_threshold = suspicious_threshold
        self.normal_threshold = normal_threshold

    def detect_conflict(self, evidence: list[Evidence]) -> bool:
        """Detect whether evidence contains contradictory high-confidence items.

        Returns:
            True if explicit conflict or contradictory same-modality signals exist.
            False otherwise (including when evidence is empty or missing).
        """
        # Missing evidence is NOT treated as conflict
        if not evidence:
            return False

        # 1. Check for explicit conflict status or signal
        for item in evidence:
            if (
                item.status.lower() == "conflict"
                or "conflict" in item.signal.lower()
                or "conflicting" in item.status.lower()
            ):
                return True

        # 2. Check for contradictory high-confidence evidence within the same modality
        by_modality: dict[str, list[Evidence]] = {}
        for item in evidence:
            by_modality.setdefault(item.modality.lower(), []).append(item)

        for mod, items in by_modality.items():
            if len(items) < 2:
                continue
            has_confident_suspicious = any(
                (e.status.lower() == "suspicious" or e.score >= self.suspicious_threshold)
                and e.confidence >= self.confidence_threshold
                for e in items
            )
            has_confident_normal = any(
                (e.status.lower() == "normal" or e.score <= self.normal_threshold)
                and e.confidence >= self.confidence_threshold
                for e in items
            )
            if has_confident_suspicious and has_confident_normal:
                return True

        return False

    def has_conflict(self, evidence: list[Evidence]) -> bool:
        """Alias for detect_conflict."""
        return self.detect_conflict(evidence)


def detect_conflict(evidence: list[Evidence]) -> bool:
    """Convenience function to detect conflict in evidence items."""
    return ConflictDetector().detect_conflict(evidence)


def has_conflict(evidence: list[Evidence]) -> bool:
    """Alias convenience function for detect_conflict."""
    return detect_conflict(evidence)
