/**
 * TrustLayer Design System - Core Tokens
 * Based on DESIGN-claude.md: Warm cream canvas, coral accent, dark product surfaces.
 */

export const colors = {
  // Brand & Accent
  primary: '#cc785c',          // Warm coral
  primaryActive: '#a9583e',    // Coral pressed/active
  primaryDisabled: '#e6dfd8',  // Desaturated cream-tinted disabled
  accentTeal: '#5db8a6',       // Balanced teal for consistency/agreement
  accentAmber: '#e8a55a',      // Warm amber for uncertainty / caveats

  // Neutral ink / text
  ink: '#141413',              // Primary headline/display text
  bodyStrong: '#252523',       // Emphasized lead text
  body: '#3d3d3a',             // Running text
  muted: '#6c6a64',            // Secondary text, breadcrumbs, labels
  mutedSoft: '#8e8b82',        // Captions, subtle metadata

  // Canvas & Light Surfaces
  canvas: '#faf9f5',           // Warm tinted cream canvas
  surfaceSoft: '#f5f0e8',      // Subtle section background
  surfaceCard: '#efe9de',      // Light cream feature cards
  surfaceCreamStrong: '#e8e0d2', // Emphasized category tabs/selected bands
  hairline: '#e6dfd8',         // 1px hairline border on cream surfaces
  hairlineSoft: '#ebe6df',     // Inner dividers

  // Dark Product Surfaces (Forensic artifacts, terminal, code, metrics)
  surfaceDark: '#181715',         // Dominant dark surface
  surfaceDarkElevated: '#252320', // Elevated cards inside dark panels
  surfaceDarkSoft: '#1f1e1b',     // Inner code / data blocks
  onDark: '#faf9f5',              // Cream-tinted text on dark
  onDarkSoft: '#a09d96',          // Secondary text on dark
  onPrimary: '#ffffff',           // Text on coral buttons

  // Forensic & Semantic states
  success: '#5db872',          // Verified authentic / consistent
  warning: '#d4a017',          // Caution / conflicting signals
  error: '#c64545',            // Detected manipulation / high risk
  info: '#5db8a6',             // Telemetry / informational

  // Semantic TrustLayer Mappings
  trustStates: {
    trusted: {
      label: 'TRUSTED',
      color: '#5db872',
      bgSubtle: 'rgba(93, 184, 114, 0.10)',
      border: 'rgba(93, 184, 114, 0.28)',
      description: 'High cross-modal consistency, low synthetic signals.',
    },
    probablyTrusted: {
      label: 'PROBABLY TRUSTED',
      color: '#5db8a6',
      bgSubtle: 'rgba(93, 184, 166, 0.10)',
      border: 'rgba(93, 184, 166, 0.28)',
      description: 'Evidence largely agrees; minor compression or baseline noise.',
    },
    uncertain: {
      label: 'UNCERTAIN',
      color: '#e8a55a',
      bgSubtle: 'rgba(232, 165, 90, 0.12)',
      border: 'rgba(232, 165, 90, 0.32)',
      description: 'Insufficient coverage, conflicting modalities, or poor signal quality.',
    },
    probablyManipulated: {
      label: 'PROBABLY MANIPULATED',
      color: '#d4a017',
      bgSubtle: 'rgba(212, 160, 23, 0.12)',
      border: 'rgba(212, 160, 23, 0.32)',
      description: 'Significant synthetic traces or cross-modal discrepancies detected.',
    },
    manipulated: {
      label: 'MANIPULATED',
      color: '#c64545',
      bgSubtle: 'rgba(198, 69, 69, 0.12)',
      border: 'rgba(198, 69, 69, 0.32)',
      description: 'Definitive generative artifacts and critical cross-modal conflict.',
    },
  },
};

export const typography = {
  fontDisplay: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
};

export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  section: '96px',
};

export const radii = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '9999px',
  full: '9999px',
};

export const shadows = {
  subtle: '0 1px 3px rgba(20, 20, 19, 0.06)',
  card: '0 2px 8px rgba(20, 20, 19, 0.04)',
  elevated: '0 4px 16px rgba(20, 20, 19, 0.08)',
  darkCard: '0 4px 20px rgba(0, 0, 0, 0.3)',
};

export const transitions = {
  instant: '80ms cubic-bezier(0.16, 1, 0.3, 1)',
  fast: '140ms cubic-bezier(0.16, 1, 0.3, 1)',
  base: '220ms cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: '360ms cubic-bezier(0.16, 1, 0.3, 1)',
};
