// src/styles/useStyles.ts
import { createUseStyles } from 'react-jss';
import { theme } from './theme';

export const useStyles = createUseStyles({
  card: {
    background: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing(6),
    color: theme.colors.text,
  },
  header: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primary,
    marginBottom: theme.spacing(4),
  },
  title: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.accent,
    marginBottom: theme.spacing(2),
  },
  sparkline: {
    height: '40px',
    '& svg': {
      overflow: 'visible !important',
    },
  },
});
