// src/styles/theme.ts
export const theme = {
  colors: {
    bg:        '#0b0d10',
    surface:   '#1f2126',
    primary:   '#006fba',   // Wells color
    accent:    '#a5a5a5',
    positive:  '#34d399',
    negative:  '#f43f5e',
    text:      '#e5e7eb',
    subtext:   '#9ca3af',
    grid:      '#374151',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  spacing: (n: number) => `${n * 4}px`,
  fontSizes: {
    sm:   '0.875rem',
    md:   '1rem',
    lg:   '1.25rem',
    xl:   '1.5rem',
  },
};
