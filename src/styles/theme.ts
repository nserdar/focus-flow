// Global Theme Configuration
import { Colors, Shadows } from './colors';
import { Spacing, FontSizes, FontWeights, BorderRadius, Durations } from './spacing';

export const Theme = {
  colors: Colors,
  shadows: Shadows,
  spacing: Spacing,
  fontSize: FontSizes,
  fontWeight: FontWeights,
  borderRadius: BorderRadius,
  durations: Durations,
};

export type ThemeType = typeof Theme;

export default Theme;
