export const COLORS = {
  'ut-burnt-orange': '#BF5700',
  'ut-grey': '#333F48',
  'ut-grey-dark-mode': '#9CA3AF',
  'status-open': '#22c55e',
  'status-closed': '#ef4444',
};

// Colorblind-friendly colors (improved contrast and distinguishability)
export const COLORBLIND_COLORS = {
  'ut-burnt-orange': '#BF5700', // Blue instead of orange - more distinguishable for deuteranopia/protanopia
  'ut-grey': '#333F48',
  'ut-grey-dark-mode': '#9CA3AF',
  'status-open': '#005AB5', // Dark blue for "open" status (instead of green)
  'status-closed': '#8F0000', // Dark red for "closed" status - more distinguishable
};

// Helper function to get the appropriate color based on settings
export function getColor(colorName: keyof typeof COLORS, isColorBlindMode: boolean): string {
  if (isColorBlindMode && colorName in COLORBLIND_COLORS) {
    return COLORBLIND_COLORS[colorName as keyof typeof COLORBLIND_COLORS];
  }
  return COLORS[colorName];
}
