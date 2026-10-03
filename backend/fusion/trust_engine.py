"""Deterministic Trust Engine for the TrustLayer framework.

Combines two core forensic dimensions:
1. Synthetic Signal — anomaly and synthetic scores across available modalities.
2. Cross-Modal Consistency — agreement between modalities (e.g., audio-visual sync).

Produces one of the five PRD assessment states:
- AUTHENTIC
- MANIPULATED
- COORDINATED SYNTHETIC
- INCONCLUSIVE — INSUFFICIENT EVIDENCE
- INCONCLUSIVE — CONFLICTING EVIDENCE
"""

from typing import Optional

try:
    from backend.analysis.evidence import Assessment, Evidence, Verdict
except ImportError:
    from analysis.evidence import Assessment, Evidence, Verdict


class TrustEngine:
    """Deterministic multi-modal trust and authenticity assessment engine."""

    # Configurable evaluation thresholds
    SYNTHETIC_HIGH_THRESHOLD: float = 0.65       # Score threshold indicating strong synthetic signal
    SYNTHETIC_LOW_THRESHOLD: float = 0.35        # Score threshold indicating normal/authentic signal
    CONSISTENCY_HIGH_THRESHOLD: float = 0.70     # High consistency required for COORDINATED SYNTHETIC or AUTHENTIC
    MIN_COVERAGE_FOR_AUTHENTIC: float = 0.50     # Minimum modality coverage required to declare AUTHENTIC
    CONFIDENCE_THRESHOLD: float = 0.60           # Minimum confidence for strong signals and conflict detection
    SYNTHETIC_MAX_WEIGHT: float = 0.75           # Weight on peak anomaly to prevent dilution by authentic modalities
    DEFAULT_CONSISTENCY: float = 0.50            # Neutral default when cross-modal consistency is unmeasured
    CORE_MODALITIES: tuple[str, ...] = ("video", "audio", "text")

    def __init__(
        self,
        synthetic_high_threshold: float = SYNTHETIC_HIGH_THRESHOLD,
        synthetic_low_threshold: float = SYNTHETIC_LOW_THRESHOLD,
        consistency_high_threshold: float = CONSISTENCY_HIGH_THRESHOLD,
        min_coverage_for_authentic: float = MIN_COVERAGE_FOR_AUTHENTIC,
        confidence_threshold: float = CONFIDENCE_THRESHOLD,
        synthetic_max_weight: float = SYNTHETIC_MAX_WEIGHT,
        default_consistency: float = DEFAULT_CONSISTENCY,
    ):
        self.synthetic_high_threshold = synthetic_high_threshold
        self.synthetic_low_threshold = synthetic_low_threshold
        self.consistency_high_threshold = consistency_high_threshold
        self.min_coverage_for_authentic = min_coverage_for_authentic
        self.confidence_threshold = confidence_threshold
        self.synthetic_max_weight = synthetic_max_weight
        self.default_consistency = default_consistency

    def assess(
        self,
        evidence: list[Evidence],
        consistency_score: Optional[float] = None,
    ) -> Assessment:
        """Perform a deterministic assessment on the provided evidence items.

        Args:
            evidence: List of forensic evidence items across modalities.
            consistency_score: Optional cross-modal consistency score (0.0 to 1.0).

        Returns:
            Assessment containing verdict, synthetic_score, consistency_score,
            evidence_coverage, and conflict flag.
        """
        # 1. Handle empty evidence explicitly
        if not evidence:
            eff_consistency = (
                0.0 if consistency_score is None else max(0.0, min(1.0, float(consistency_score)))
            )
            return Assessment(
                verdict=Verdict.INCONCLUSIVE_INSUFFICIENT_EVIDENCE,
                synthetic_score=0.0,
                consistency_score=eff_consistency,
                evidence_coverage=0.0,
                conflict=False,
            )

        # 2. Check for explicit conflict in evidence
        conflict = self._detect_conflict(evidence)

        # 3. Separate forensic modality evidence from consistency items
        forensic_evidence = [e for e in evidence if e.modality.lower() != "consistency"]
        if not forensic_evidence:
            forensic_evidence = evidence

        # Group evidence by modality
        by_modality: dict[str, list[Evidence]] = {}
        for item in forensic_evidence:
            by_modality.setdefault(item.modality.lower(), []).append(item)

        # Compute peak anomaly score for each modality
        modality_scores: dict[str, float] = {
            mod: max(item.score for item in items)
            for mod, items in by_modality.items()
        }

        # 4. Compute overall synthetic score
        # Genuine modalities must not dilute strong suspicious signals in another modality.
        # We blend the peak modality anomaly with the mean across modalities.
        max_mod_score = max(modality_scores.values())
        mean_mod_score = sum(modality_scores.values()) / len(modality_scores)
        synthetic_score = (
            self.synthetic_max_weight * max_mod_score
            + (1.0 - self.synthetic_max_weight) * mean_mod_score
        )
        synthetic_score = max(0.0, min(1.0, synthetic_score))

        # 5. Determine effective cross-modal consistency
        if consistency_score is not None:
            eff_consistency = max(0.0, min(1.0, float(consistency_score)))
        else:
            consistency_items = [e for e in evidence if e.modality.lower() == "consistency"]
            if consistency_items:
                eff_consistency = max(0.0, min(1.0, float(consistency_items[0].score)))
            else:
                eff_consistency = self.default_consistency

        # 6. Calculate modality coverage (0.0 to 1.0)
        present_modalities = set(by_modality.keys())
        coverage = min(1.0, len(present_modalities) / float(len(self.CORE_MODALITIES)))
        coverage = max(0.0, min(1.0, coverage))

        # 7. Decision Logic
        if conflict:
            # Contradictory high-confidence signals require conflicting evidence status
            verdict = Verdict.INCONCLUSIVE_CONFLICTING_EVIDENCE

        elif synthetic_score >= self.synthetic_high_threshold or max_mod_score >= self.synthetic_high_threshold:
            # Strong synthetic signals present
            suspicious_modalities = [
                m for m, s in modality_scores.items() if s >= self.synthetic_high_threshold
            ]
            if len(suspicious_modalities) >= 2 and eff_consistency >= self.consistency_high_threshold:
                # Coordinated multi-modal generation (e.g., matching synthetic video and voice)
                verdict = Verdict.COORDINATED_SYNTHETIC
            else:
                # Spliced, isolated synthetic, or cross-modally inconsistent manipulation
                verdict = Verdict.MANIPULATED

        elif synthetic_score <= self.synthetic_low_threshold and max_mod_score <= self.synthetic_low_threshold:
            # Low synthetic scores; check coverage and consistency
            # Missing evidence must NOT be treated as evidence of authenticity
            if coverage >= self.min_coverage_for_authentic and eff_consistency >= self.consistency_high_threshold:
                verdict = Verdict.AUTHENTIC
            else:
                verdict = Verdict.INCONCLUSIVE_INSUFFICIENT_EVIDENCE

        else:
            # Ambiguous / borderline scores
            verdict = Verdict.INCONCLUSIVE_INSUFFICIENT_EVIDENCE

        return Assessment(
            verdict=verdict,
            synthetic_score=round(synthetic_score, 4),
            consistency_score=round(eff_consistency, 4),
            evidence_coverage=round(coverage, 4),
            conflict=conflict,
        )

    def _detect_conflict(self, evidence: list[Evidence]) -> bool:
        """Detect explicit contradictions within the evidence set.

        Returns True if:
        - Any item explicitly flags a 'conflict' status or signal.
        - The same modality contains high-confidence contradictory items
          (e.g., one model reports synthetic while another reports normal).
        """
        for item in evidence:
            if item.status.lower() == "conflict" or "conflict" in item.signal.lower():
                return True

        by_modality: dict[str, list[Evidence]] = {}
        for item in evidence:
            by_modality.setdefault(item.modality.lower(), []).append(item)

        for mod, items in by_modality.items():
            if len(items) < 2:
                continue
            has_confident_suspicious = any(
                (e.status.lower() == "suspicious" or e.score >= self.synthetic_high_threshold)
                and e.confidence >= self.confidence_threshold
                for e in items
            )
            has_confident_normal = any(
                (e.status.lower() == "normal" or e.score <= self.synthetic_low_threshold)
                and e.confidence >= self.confidence_threshold
                for e in items
            )
            if has_confident_suspicious and has_confident_normal:
                return True

        return False
