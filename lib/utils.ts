/**
 * Formats a number for display using compact notation
 * e.g. 1500 -> 1.5K, 1500000 -> 1.5M
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
};

/**
 * Formats a number as a percentage
 */
export const formatPercent = (num: number): string => {
  return `${(num * 100).toFixed(1)}%`;
};

/**
 * Formats a number with specified decimal places
 */
export const formatDecimal = (num: number, places: number = 2): string => {
  return num.toFixed(places);
};

/**
 * Capitalizes the first letter of each word in a string
 */
export const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

/**
 * Calculates average value from an array of objects based on a specific key
 */
export const calculateAverage = <T>(
  items: T[],
  key: keyof T,
  defaultValue: number = 0
): number => {
  if (!items || items.length === 0) return defaultValue;
  const sum = items.reduce((total, item) => {
    const value = Number(item[key]);
    return total + (isNaN(value) ? 0 : value);
  }, 0);
  return sum / items.length;
};

/**
 * Converts RGB to hex color code
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Creates a gradient of colors between two hex colors
 */
export const createColorGradient = (
  startColor: string,
  endColor: string,
  steps: number
): string[] => {
  const start = {
    r: parseInt(startColor.slice(1, 3), 16),
    g: parseInt(startColor.slice(3, 5), 16),
    b: parseInt(startColor.slice(5, 7), 16),
  };

  const end = {
    r: parseInt(endColor.slice(1, 3), 16),
    g: parseInt(endColor.slice(3, 5), 16),
    b: parseInt(endColor.slice(5, 7), 16),
  };

  const gradient = [];

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(start.r + ratio * (end.r - start.r));
    const g = Math.round(start.g + ratio * (end.g - start.g));
    const b = Math.round(start.b + ratio * (end.b - start.b));
    gradient.push(rgbToHex(r, g, b));
  }

  return gradient;
};
