/**
 * TrustLayer Design System - Core Tokens
 * 
 * Strict palette & semantic mapping:
 * - Blue (#5B8DEF): Brand / System / Primary interaction
 * - Teal (#4FB3A5): MATCH / Agreement / Consistency
 * - Red (#E06C75):  MISMATCH / Suspicious / Conflict
 * - Amber (#D6A85F): Uncertainty / Insufficient evidence
 */

export const colors = {
  // Core palette
  bg: '#0B0F14',
  textPrimary: '#F4F6F8',
  brand: '#5B8DEF',
  match: '#4FB3A5',
  conflict: '#E06C75',
  uncertainty: '#D6A85F',

  // Surfaces & borders
  surface: '#111820',
  surfaceElevated: '#17212B',
  border: '#26323D',
  borderSubtle: '#1C2630',
  borderHighlight: '#344453',

  // Typography
  textSecondary: '#9AA6B2',
  textMuted: '#65717D',

  // Semantic mappings (PRD aligned)
  semantics: {
    brand: {
      color: '#5B8DEF',
      bgSubtle: 'rgba(91, 141, 239, 0.08)',
      border: 'rgba(91, 141, 239, 0.28)',
      glow: 'rgba(91, 141, 239, 0.15)',
      label: 'System / Brand',
    },
    match: {
      color: '#4FB3A5',
      bgSubtle: 'rgba(79, 179, 165, 0.08)',
      border: 'rgba(79, 179, 165, 0.28)',
      glow: 'rgba(79, 179, 165, 0.15)',
      label: 'Match / Consistency',
    },
    conflict: {
      color: '#E06C75',
      bgSubtle: 'rgba(224, 108, 117, 0.08)',
      border: 'rgba(224, 108, 117, 0.28)',
      glow: 'rgba(224, 108, 117, 0.15)',
      label: 'Conflict / Suspicious',
    },
    uncertainty: {
      color: '#D6A85F',
      bgSubtle: 'rgba(214, 168, 95, 0.08)',
      border: 'rgba(214, 168, 95, 0.28)',
      glow: 'rgba(214, 168, 95, 0.15)',
      label: 'Uncertainty / Low Confidence',
    },
    neutral: {
      color: '#9AA6B2',
      bgSubtle: 'rgba(154, 166, 178, 0.06)',
      border: '#26323D',
      glow: 'none',
      label: 'Neutral',
    },
  },
};

export const typography = {
  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
};

export const radii = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
  md: '0 4px 12px 0 rgba(0, 0, 0, 0.45)',
  lg: '0 12px 28px -4px rgba(0, 0, 0, 0.65)',
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  innerGlow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  base: '240ms cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
};
