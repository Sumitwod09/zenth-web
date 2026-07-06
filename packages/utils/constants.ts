// ─── Design Tokens ───────────────────────────────────────────────────
// Single source of truth for the Zenth design system.
// Used by both the mobile app (React Native) and the landing page (Next.js).

export const colors = {
  background: '#0f0f12',
  secondary: '#1a1a1f',
  accent: '#7c5cff',
  accentGlow: 'rgba(124, 92, 255, 0.12)',
  accentMuted: 'rgba(124, 92, 255, 0.7)',
  textPrimary: '#f2f2f5',
  textSecondary: '#9a9aa5',
  success: '#4ade80',
  successGlow: 'rgba(74, 222, 128, 0.15)',
  border: '#2a2a30',
  danger: '#ef4444',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    heading: 'SpaceGrotesk_500Medium',
    headingSemiBold: 'SpaceGrotesk_600SemiBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
  },
  fontSize: {
    caption: 12,
    captionLg: 13,
    body: 14,
    bodyLg: 16,
    heading: 20,
    headingLg: 24,
    headingXl: 28,
    display: 36,
  },
  lineHeight: {
    caption: 16,
    body: 20,
    bodyLg: 24,
    heading: 28,
    headingLg: 32,
    headingXl: 36,
    display: 44,
  },
} as const;

// ─── Timer ───────────────────────────────────────────────────────────

export const timer = {
  defaultDuration: 25, // minutes
  minDuration: 10,
  maxDuration: 25,
  stepDuration: 5,
} as const;

// ─── Animations ──────────────────────────────────────────────────────

export const animation = {
  fast: 150,
  normal: 300,
  slow: 400,
} as const;
