// Housing palette - modern colors for a room search website
export const colors = {
  primary: "#2C3E50",      // Deep blue - header backgrounds, primary actions
  secondary: "#3498DB",    // Medium blue - secondary elements
  info: "#16A085",         // Teal - informational elements
  accent: "#F39C12",       // Orange/amber - call to action, highlights
  light: "#ECF0F1",        // Light gray - backgrounds
  dark: "#2A2D34",         // Near black - text
  success: "#27AE60",      // Green - confirmations, availability
  warning: "#E74C3C",      // Red - warnings, unavailability
  white: "#FFFFFF"         // White - text on dark backgrounds
};

// Opacity variants
export const getColorWithOpacity = (colorKey, opacity) => {
  const rgb = hexToRgb(colors[colorKey]);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}