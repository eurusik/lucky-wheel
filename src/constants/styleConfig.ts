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
    '#fff9c4', // Yellow
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
  WHEEL_TRANSITION: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)', // unified for both wheels
  OUTER_WHEEL_TRANSITION: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)', // alias for legacy code
  INNER_WHEEL_TRANSITION: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)', // alias for legacy code
  SPIN_DURATION: 5000, // ms
  SPIN_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)', // Expo.out easing
};

/**
 * Layout constants for settings page with responsive values
 */
// Universal button style for all project buttons. Extend or override via sx in components if needed.
// Responsive chip style for mobile, tablet, desktop
// Responsive gap for Stack components (chips, buttons, etc.)
export const STACK_GAP = { xs: 2.5, sm: 1.5, md: 0.8 }; // 20px, 12px, 6.4px

export const CHIP = {
  borderRadius: 8,
  fontWeight: 600,
  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
  height: { xs: 28, sm: 32, md: 36 },
  padding: '0 10px',
  backgroundColor: '#fffbe6',
  color: '#ad8e00',
  boxShadow: '0 1px 4px rgba(255, 213, 79, 0.10)',
  letterSpacing: 0.2,
  transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
  '&:hover': {
    backgroundColor: '#fff3c0',
    color: '#c59d00',
    boxShadow: '0 2px 8px rgba(255, 213, 79, 0.18)'
  },
  '& .MuiChip-label': {
    padding: '0 8px',
    fontWeight: 600,
  },
};

export const BUTTONS = {
  border: 'none',
  borderRadius: 8,
  fontWeight: 600,
  textTransform: 'none',
  minWidth: 120,
  padding: '8px 24px',
  color: '#222',
  backgroundColor: COLORS.STAR_BACKGROUND,
  boxShadow: '0 2px 8px rgba(60, 80, 180, 0.10)',
  transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
  '&:hover': {
    backgroundColor: COLORS.STAR_BACKGROUND_HOVER,
    color: '#ad8e00',
    boxShadow: '0 4px 12px rgba(255, 213, 79, 0.18)'
  },
  '&:disabled': {
    backgroundColor: 'rgba(255, 213, 79, 0.5)',
    color: 'rgba(0,0,0,0.38)'
  }
};

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
