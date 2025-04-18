/**
 * Style constants for the wheel components
 */

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
 * Size constants
 */
export const SIZES = {
  POINTER_WIDTH: 35,
  POINTER_HEIGHT: 55,
  STROKE_WIDTH: 3,
  FONT_SIZE: 16,
  FONT_WEIGHT: 600,
  LEGEND_FONT_SIZE: '1rem',
  LEGEND_ICON_SIZE: '1.5rem',
  WHEEL_SIZE: 550,
  INNER_RADIUS_RATIO: 0.38, // Inner radius as a ratio of outer radius
  WHEEL_CONTAINER_PADDING: 4,
  WHEEL_CONTAINER_BORDER_RADIUS: 16,
};

/**
 * Animation constants
 */
export const ANIMATION = {
  OUTER_WHEEL_TRANSITION: 'transform 5.5s cubic-bezier(0.16, 1, 0.3, 1)',
  INNER_WHEEL_TRANSITION: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)',
  SPIN_DURATION: 5000, // ms
  SPIN_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)', // Expo.out easing
};

/**
 * Layout constants for settings page
 */
export const SETTINGS = {
  MAX_WIDTH: 600,
  COLOR_SWATCH_SIZE: 32,
  SPACING: {
    ITEM_GAP: 2,
    ITEM_MARGIN: 1,
    PAGE_PADDING: 3,
    CONTENT_PADDING: 3,
    ACTIONS_PADDING: 2,
  },
  BORDER_RADIUS: 1,
};
