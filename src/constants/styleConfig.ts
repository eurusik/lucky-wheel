/**
 * Style constants for the wheel components
 */

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1280,
};

/**
 * Color constants
 */
export const COLORS = {
  // Wheel colors
  POINTER: '#e91e63',
  POINTER_SHADOW: 'rgba(0, 0, 0, 0.3)',
  STROKE: 'white',
  STROKE_WIDTH: 2,
  STAR_BACKGROUND: '#ffd54f',
  STAR_BACKGROUND_HOVER: '#ffca28',
  TEXT: '#212121',
  TEXT_SECONDARY: '#757575',
  EMPTY_WHEEL_BORDER: '#ccc',
  
  // Vibrant color palette for wheel sectors
  WHEEL_PALETTE: [
    '#ffcdd2', // Red
    '#f8bbd0', // Pink
    '#e1bee7', // Purple
    '#d1c4e9', // Deep Purple
    '#c5cae9', // Indigo
    '#bbdefb', // Blue
    '#b3e5fc', // Light Blue
    '#b2ebf2', // Cyan
    '#b2dfdb', // Teal
    '#c8e6c9', // Green
    '#dcedc8', // Light Green
    '#f0f4c3', // Lime
    '#fff9c4', // Yellow
    '#ffecb3', // Amber
    '#ffe0b2', // Orange
    '#ffccbc', // Deep Orange
  ],
  
  // Background colors
  BACKGROUND: '#f8f9fa',
  WHEEL_CONTAINER_BG: '#ffffff',
  WHEEL_SHADOW: '0 10px 25px rgba(0, 0, 0, 0.1)'
};

/**
 * Size constants for responsive design
 */
export const SIZES = {
  POINTER_WIDTH: { mobile: 28, tablet: 32, desktop: 35 },
  POINTER_HEIGHT: { mobile: 44, tablet: 50, desktop: 56 },
  STROKE_WIDTH: { mobile: 2, tablet: 2.5, desktop: 4 },
  FONT_SIZE: { mobile: 13, tablet: 14, desktop: 22 },
  FONT_WEIGHT: 600,
  LEGEND_FONT_SIZE: { mobile: '0.875rem', tablet: '0.925rem', desktop: '1.25rem' },
  LEGEND_ICON_SIZE: { mobile: '1.25rem', tablet: '1.35rem', desktop: '2rem' },
  WHEEL_SIZE: { mobile: 260, tablet: 420, desktop: 480 },
  INNER_RADIUS_RATIO: 0.38,
  WHEEL_CONTAINER_PADDING: { mobile: 2, tablet: 3, desktop: 5 },
  WHEEL_CONTAINER_BORDER_RADIUS: { mobile: 8, tablet: 12, desktop: 24 },
};

/**
 * Animation constants for wheel spinning and transitions
 */
export const ANIMATION = {
  OUTER_WHEEL_TRANSITION: 'transform 5.5s cubic-bezier(0.16, 1, 0.3, 1)',
  INNER_WHEEL_TRANSITION: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)',
  SPIN_DURATION: 5000, // ms
  SPIN_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)', // Expo.out easing
};

/**
 * Layout constants for settings page with responsive values
 */
export const SETTINGS = {
  MAX_WIDTH: { mobile: '100%', tablet: 540, desktop: 600 },
  COLOR_SWATCH_SIZE: { mobile: 24, tablet: 28, desktop: 32 },
  SPACING: {
    ITEM_GAP: { mobile: 1, tablet: 1.5, desktop: 2 },
    ITEM_MARGIN: { mobile: 0.5, tablet: 0.75, desktop: 1 },
    PAGE_PADDING: { mobile: 1, tablet: 2, desktop: 3 },
    CONTENT_PADDING: { mobile: 1.5, tablet: 2, desktop: 3 },
    ACTIONS_PADDING: { mobile: 1, tablet: 1.5, desktop: 2 },
  },
  BORDER_RADIUS: { mobile: 0.5, tablet: 0.75, desktop: 1 },
};
