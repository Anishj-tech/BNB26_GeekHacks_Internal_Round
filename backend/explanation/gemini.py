"""Gemini Explanation Service for TrustLayer.

Transforms structured forensic assessment data and evidence into a concise,
human-readable explanation.

CRITICAL ARCHITECTURAL BOUNDARY:
Gemini NEVER determines or overrides the forensic verdict.
Verdict and scores originate exclusively from the deterministic TrustEngine.
Gemini only articulates the findings based on supplied evidence.
"""

import json
import logging
from typing import Optional, Union

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    genai = None
    genai_types = None

try:
    from backend.analysis.evidence import Assessment, Evidence, TimelineItem
    from backend.core.config import settings
except ImportError:
    from analysis.evidence import Assessment, Evidence, TimelineItem
    from core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = (
    "You are the TrustLayer Forensic Explanation Assistant.\n"
    "Your sole purpose is to convert pre-determined, structured forensic assessment data into "
    "a clear, concise, objective explanation for human review.\n\n"
    "CRITICAL CONSTRAINTS:\n"
    "1. The supplied verdict is FINAL and DETERMINISTIC. You must NEVER change, override, or dispute it.\n"
    "2. Do NOT invent evidence or assume facts outside the provided structured data.\n"
    "3. Explain clearly which evidence signals contributed to the final assessment.\n"
    "4. Explicitly mention uncertainty, inconclusive findings, or conflicting evidence when present.\n"
    "5. Clearly distinguish missing evidence from evidence of authenticity (missing evidence is NOT proof of authenticity).\n"
    "6. Do not claim legal or official forensic certification.\n"
    "7. Do not make unsupported claims.\n"
    "8. Keep the explanation concise (2 to 4 sentences), professional, and factual."
)


class GeminiExplanationService:
    """Service to generate human-readable explanations using Gemini, with deterministic fallback."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.api_key = api_key or settings.get_gemini_api_key()
        self.model = model or settings.GEMINI_MODEL

    def build_structured_payload(
        self,
        assessment: Union[Assessment, dict],
        evidence: list[Evidence],
        timeline: Optional[list[TimelineItem]] = None,
    ) -> dict:
        """Serialize assessment, evidence, and timeline into a structured dict."""
        if hasattr(assessment, "model_dump"):
            assessment_data = assessment.model_dump()
        elif isinstance(assessment, dict):
            assessment_data = assessment
        else:
            assessment_data = {"verdict": str(assessment)}

        evidence_data = [
            e.model_dump() if hasattr(e, "model_dump") else e
            for e in (evidence or [])
        ]

        timeline_data = [
            t.model_dump() if hasattr(t, "model_dump") else t
            for t in (timeline or [])
        ]

        return {
            "assessment": assessment_data,
            "evidence": evidence_data,
            "timeline": timeline_data,
        }

    def build_fallback_explanation(
        self,
        assessment: Union[Assessment, dict],
        evidence: list[Evidence],
        timeline: Optional[list[TimelineItem]] = None,
    ) -> str:
        """Generate a deterministic fallback explanation when Gemini is unavailable or fails."""
        if hasattr(assessment, "model_dump"):
            ass_dict = assessment.model_dump()
        elif isinstance(assessment, dict):
            ass_dict = assessment
        else:
            ass_dict = {"verdict": str(assessment)}

        verdict = ass_dict.get("verdict", "INCONCLUSIVE — INSUFFICIENT EVIDENCE")
        synthetic_score = float(ass_dict.get("synthetic_score", 0.0))
        consistency_score = float(ass_dict.get("consistency_score", 0.50))
        evidence_coverage = float(ass_dict.get("evidence_coverage", 0.0))
        conflict = bool(ass_dict.get("conflict", False))

        evidence_items = evidence or []
        suspicious_modalities = list(
            dict.fromkeys(
                e.modality
                for e in evidence_items
                if e.status.lower() == "suspicious" or e.score >= 0.65
            )
        )

        if conflict:
            return (
                f"Forensic assessment returned {verdict}. Contradictory evidence signals were "
                "detected within the analyzed modalities, resulting in an inconclusive assessment. "
                "Further investigation is recommended."
            )

        if not evidence_items or evidence_coverage < 0.50:
            return (
                f"Forensic assessment returned {verdict}. Available multi-modal evidence coverage "
                f"({evidence_coverage:.0%}) is insufficient for a conclusive determination. "
                "Missing evidence is not treated as evidence of authenticity."
            )

        if verdict == "COORDINATED SYNTHETIC":
            mods = ", ".join(suspicious_modalities) if suspicious_modalities else "multiple modalities"
            return (
                f"Forensic assessment returned {verdict}. Strong synthetic signals were detected across "
                f"{mods} (synthetic score: {synthetic_score:.2f}) alongside high cross-modal "
                f"consistency ({consistency_score:.2f}), indicating an end-to-end coordinated synthetic asset."
            )

        if verdict == "MANIPULATED":
            mods = ", ".join(suspicious_modalities) if suspicious_modalities else "the analyzed modalities"
            return (
                f"Forensic assessment returned {verdict}. Significant synthetic anomalies were detected in "
                f"{mods} (synthetic score: {synthetic_score:.2f}) with cross-modal consistency of "
                f"{consistency_score:.2f}, indicating localized tampering or media manipulation."
            )

        if verdict == "AUTHENTIC":
            return (
                f"Forensic assessment returned {verdict}. Analyzed evidence showed low synthetic indicators "
                f"(synthetic score: {synthetic_score:.2f}) across sufficient modality coverage "
                f"({evidence_coverage:.0%}) and high cross-modal consistency ({consistency_score:.2f})."
            )

        return (
            f"Forensic assessment returned {verdict} with synthetic score {synthetic_score:.2f} "
            f"and cross-modal consistency {consistency_score:.2f} across {len(evidence_items)} evidence item(s)."
        )

    def generate_explanation(
        self,
        assessment: Union[Assessment, dict],
        evidence: list[Evidence],
        timeline: Optional[list[TimelineItem]] = None,
    ) -> str:
        """Generate a concise forensic explanation for the given assessment and evidence.

        Fails gracefully to a deterministic fallback if:
        - API key is missing
        - Network/Gemini request fails
        - Gemini returns invalid or empty output
        """
        payload = self.build_structured_payload(assessment, evidence, timeline)
        structured_json = json.dumps(payload, indent=2)

        # 1. Graceful fallback if no API key is configured
        if not self.api_key:
            return self.build_fallback_explanation(assessment, evidence, timeline)

        prompt = (
            f"Please explain the following forensic investigation result.\n"
            f"STRUCTURED EVIDENCE DATA:\n{structured_json}"
        )

        # 2. Call Gemini using google-genai SDK
        if genai is not None:
            candidate_models = [self.model, "gemini-flash-lite-latest", "gemini-flash-latest"]
            seen_models = set()
            for mod_name in candidate_models:
                if not mod_name or mod_name in seen_models:
                    continue
                seen_models.add(mod_name)
                try:
                    client = genai.Client(api_key=self.api_key)
                    response = client.models.generate_content(
                        model=mod_name,
                        contents=prompt,
                        config=genai_types.GenerateContentConfig(
                            system_instruction=SYSTEM_INSTRUCTION,
                            temperature=0.2,
                            max_output_tokens=350,
                        ),
                    )
                    if response and response.text and response.text.strip():
                        return response.text.strip()
                except Exception as e:
                    logger.warning("Gemini SDK call to %s failed: %s", mod_name, e)

        # 3. Deterministic fallback as the final failure path
        return self.build_fallback_explanation(assessment, evidence, timeline)


def generate_explanation(
    assessment: Union[Assessment, dict],
    evidence: list[Evidence],
    timeline: Optional[list[TimelineItem]] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> str:
    """Convenience function to generate a forensic explanation."""
    service = GeminiExplanationService(api_key=api_key, model=model)
    return service.generate_explanation(assessment, evidence, timeline)


__all__ = [
    "GeminiExplanationService",
    "SYSTEM_INSTRUCTION",
    "generate_explanation",
]
