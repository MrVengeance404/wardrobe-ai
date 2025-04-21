import { SkinTone, HairColor, EyeColor, Gender } from '../types';

// Define Seasonal Color Analysis types
export enum ColorSeason {
  Spring = "spring",
  Summer = "summer",
  Autumn = "autumn",
  Winter = "winter"
}

// Define color harmony types
export enum ColorHarmony {
  Analogous = "analogous",
  Complementary = "complementary",
  Triadic = "triadic",
  Monochromatic = "monochromatic",
  SplitComplementary = "split-complementary"
}

// Interface for color palette
export interface ColorPalette {
  season: ColorSeason;
  primaryColors: string[];
  neutralColors: string[];
  accentColors: string[];
}

// Interface for style recommendation
export interface StyleRecommendation {
  bodyType: string;
  recommendedStyles: string[];
  avoidStyles: string[];
  accentFeatures: string[];
}

// Determine color season based on physical attributes
export const determineColorSeason = (
  skinTone: SkinTone,
  hairColor: HairColor,
  eyeColor: EyeColor
): ColorSeason => {
  // Simplified logic - a real implementation would be more complex
  
  // Winter characteristics: high contrast, cool undertones
  if (
    (skinTone === SkinTone.Fair && (hairColor === HairColor.Black || hairColor === HairColor.Brown)) ||
    (skinTone === SkinTone.Dark && (eyeColor === EyeColor.Black || eyeColor === EyeColor.Brown))
  ) {
    return ColorSeason.Winter;
  }
  
  // Spring characteristics: warm, clear, light colors
  if (
    (skinTone === SkinTone.Fair || skinTone === SkinTone.Light) && 
    (hairColor === HairColor.Blonde || hairColor === HairColor.Red) &&
    (eyeColor === EyeColor.Blue || eyeColor === EyeColor.Green)
  ) {
    return ColorSeason.Spring;
  }
  
  // Summer characteristics: cool, soft, muted colors
  if (
    (skinTone === SkinTone.Light || skinTone === SkinTone.Medium) && 
    (hairColor === HairColor.Blonde || hairColor === HairColor.Brown) &&
    (eyeColor === EyeColor.Blue || eyeColor === EyeColor.Gray)
  ) {
    return ColorSeason.Summer;
  }
  
  // Autumn characteristics: warm, rich, golden colors
  if (
    (skinTone === SkinTone.Medium || skinTone === SkinTone.Olive || skinTone === SkinTone.Brown) && 
    (hairColor === HairColor.Brown || hairColor === HairColor.Red) &&
    (eyeColor === EyeColor.Brown || eyeColor === EyeColor.Hazel || eyeColor === EyeColor.Amber)
  ) {
    return ColorSeason.Autumn;
  }
  
  // Default fallback based on skin tone
  switch(skinTone) {
    case SkinTone.Fair:
    case SkinTone.Light:
      return ColorSeason.Summer;
    case SkinTone.Medium:
    case SkinTone.Olive:
      return ColorSeason.Autumn;
    case SkinTone.Brown:
    case SkinTone.Dark:
      return ColorSeason.Winter;
    default:
      return ColorSeason.Autumn;
  }
};

// Get color palette based on color season
export const getColorPaletteForSeason = (season: ColorSeason): ColorPalette => {
  switch(season) {
    case ColorSeason.Spring:
      return {
        season: ColorSeason.Spring,
        primaryColors: ['#ff9e2c', '#4dbd74', '#f2545b', '#ffcf40', '#93d2c2'],
        neutralColors: ['#e8d9a9', '#e6e6fa', '#f5f5dc', '#fffff0'],
        accentColors: ['#e34234', '#ff8c69', '#00bfff', '#3cb371']
      };
    case ColorSeason.Summer:
      return {
        season: ColorSeason.Summer,
        primaryColors: ['#7eb0d5', '#8fbbb9', '#9a8fb8', '#d189b9', '#c0a9bd'],
        neutralColors: ['#f0f0f0', '#d6e2e9', '#e6e6e6', '#f5f5f5'],
        accentColors: ['#cf71af', '#8673a1', '#a6bcde', '#5da9a7']
      };
    case ColorSeason.Autumn:
      return {
        season: ColorSeason.Autumn,
        primaryColors: ['#a65c32', '#9b7653', '#806b3c', '#665d4e', '#8b5a2b'],
        neutralColors: ['#f5deb3', '#d3c4a2', '#d2b48c', '#c4b298'],
        accentColors: ['#d2691e', '#cd5c5c', '#556b2f', '#8b4513']
      };
    case ColorSeason.Winter:
      return {
        season: ColorSeason.Winter,
        primaryColors: ['#0000ff', '#800080', '#ff0000', '#006400', '#000080'],
        neutralColors: ['#ffffff', '#000000', '#808080', '#f0f8ff'],
        accentColors: ['#ff00ff', '#00ffff', '#ffff00', '#ff1493']
      };
    default:
      return {
        season: ColorSeason.Autumn, // Default
        primaryColors: ['#a65c32', '#9b7653', '#806b3c', '#665d4e', '#8b5a2b'],
        neutralColors: ['#f5deb3', '#d3c4a2', '#d2b48c', '#c4b298'],
        accentColors: ['#d2691e', '#cd5c5c', '#556b2f', '#8b4513']
      };
  }
};

// Determine complementary color
export const getComplementaryColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Invert colors (complementary)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  // Convert back to hex
  return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
};

// Get color harmony based on a base color
export const getColorHarmony = (
  baseColor: string, 
  harmonyType: ColorHarmony
): string[] => {
  // For simplicity, we're using a basic approach
  // A real implementation would use proper color theory math
  
  // Convert hex to HSL for better color manipulation
  const hslColor = hexToHSL(baseColor);
  
  switch(harmonyType) {
    case ColorHarmony.Analogous:
      // Colors adjacent on the color wheel (±30°)
      return [
        baseColor,
        hslToHex({...hslColor, h: (hslColor.h + 30) % 360}),
        hslToHex({...hslColor, h: (hslColor.h - 30 + 360) % 360})
      ];
    
    case ColorHarmony.Complementary:
      // Colors opposite on the color wheel (180°)
      return [
        baseColor,
        hslToHex({...hslColor, h: (hslColor.h + 180) % 360})
      ];
    
    case ColorHarmony.Triadic:
      // Three colors evenly spaced (120°)
      return [
        baseColor,
        hslToHex({...hslColor, h: (hslColor.h + 120) % 360}),
        hslToHex({...hslColor, h: (hslColor.h + 240) % 360})
      ];
    
    case ColorHarmony.Monochromatic:
      // Same hue, different saturation/lightness
      return [
        baseColor,
        hslToHex({...hslColor, s: Math.max(0, hslColor.s - 30)}),
        hslToHex({...hslColor, l: Math.min(100, hslColor.l + 20)}),
        hslToHex({...hslColor, l: Math.max(0, hslColor.l - 20)})
      ];
    
    case ColorHarmony.SplitComplementary:
      // Base + two colors adjacent to its complement
      return [
        baseColor,
        hslToHex({...hslColor, h: (hslColor.h + 150) % 360}),
        hslToHex({...hslColor, h: (hslColor.h + 210) % 360})
      ];
    
    default:
      return [baseColor];
  }
};

// Get style recommendations based on user characteristics
export const getStyleRecommendations = (
  gender: Gender,
  height: number, // in cm
  weight: number, // in kg
  measurements: Record<string, number> // key measurements in cm
): StyleRecommendation => {
  // Simplified body type determination
  // A real implementation would use proper measurements and proportions
  
  const bmi = weight / ((height / 100) ** 2);
  let bodyType = '';
  
  if (gender === Gender.Female) {
    // Very simplified female body type classification
    if (measurements.bust && measurements.waist && measurements.hips) {
      const bustToWaist = measurements.bust - measurements.waist;
      const hipsToWaist = measurements.hips - measurements.waist;
      
      if (bustToWaist < 9 && hipsToWaist < 9) {
        bodyType = 'Rectangle';
      } else if (bustToWaist >= 9 && hipsToWaist < 9) {
        bodyType = 'Inverted Triangle';
      } else if (bustToWaist < 9 && hipsToWaist >= 9) {
        bodyType = 'Pear';
      } else {
        if (Math.abs(measurements.bust - measurements.hips) < 5) {
          bodyType = 'Hourglass';
        } else if (measurements.bust > measurements.hips) {
          bodyType = 'Apple';
        } else {
          bodyType = 'Pear';
        }
      }
    } else {
      bodyType = bmi < 18.5 ? 'Slim' : bmi < 25 ? 'Average' : 'Full';
    }
    
    // Return recommendations based on body type
    switch(bodyType) {
      case 'Hourglass':
        return {
          bodyType,
          recommendedStyles: [
            'Wrap dresses', 'Belted garments', 'High-waisted pants', 
            'Fitted jackets', 'V-neck tops'
          ],
          avoidStyles: [
            'Boxy cuts', 'Shapeless garments', 'Drop waists',
            'Overly baggy clothing'
          ],
          accentFeatures: ['Defined waist', 'Balanced proportions']
        };
      case 'Pear':
        return {
          bodyType,
          recommendedStyles: [
            'A-line skirts', 'Boot-cut jeans', 'Statement tops',
            'Structured shoulders', 'V-necks'
          ],
          avoidStyles: [
            'Skinny jeans', 'Pencil skirts', 'Tapered pants',
            'Large pockets on hips'
          ],
          accentFeatures: ['Upper body', 'Shoulders']
        };
      case 'Inverted Triangle':
        return {
          bodyType,
          recommendedStyles: [
            'Full skirts', 'Wide-leg pants', 'Layered bottoms',
            'V-neck tops', 'Empire waists'
          ],
          avoidStyles: [
            'Boat necks', 'Overly detailed tops', 'Peplum tops',
            'Shoulder pads'
          ],
          accentFeatures: ['Lower body', 'Waist']
        };
      case 'Rectangle':
        return {
          bodyType,
          recommendedStyles: [
            'Belted garments', 'Peplum tops', 'Layered clothing',
            'Cinched waists', 'Wrap dresses'
          ],
          avoidStyles: [
            'Shapeless garments', 'Straight cuts', 'Overly loose clothing'
          ],
          accentFeatures: ['Create waist definition', 'Add curves']
        };
      case 'Apple':
        return {
          bodyType,
          recommendedStyles: [
            'Empire waists', 'A-line dresses', 'Vertical patterns',
            'V-necks', 'Flared bottoms'
          ],
          avoidStyles: [
            'Clingy fabrics', 'Belts at natural waist', 'Overly tight tops',
            'Pleated pants'
          ],
          accentFeatures: ['Legs', 'Bust', 'Arms']
        };
      default:
        return {
          bodyType: 'Average',
          recommendedStyles: [
            'Balanced proportions', 'Well-fitted clothing',
            'Classical cuts', 'Layered outfits'
          ],
          avoidStyles: [
            'Extremely oversized', 'Extremely fitted'
          ],
          accentFeatures: ['Overall balanced look']
        };
    }
  } else {
    // Simplified male body type classification
    if (measurements.shoulders && measurements.waist) {
      const shoulderToWaist = measurements.shoulders - measurements.waist;
      
      if (shoulderToWaist >= 20) {
        bodyType = 'V-Shape';
      } else if (shoulderToWaist >= 10) {
        bodyType = 'Athletic';
      } else if (measurements.waist > measurements.shoulders) {
        bodyType = 'Oval';
      } else {
        bodyType = 'Rectangle';
      }
    } else {
      bodyType = bmi < 18.5 ? 'Slim' : bmi < 25 ? 'Athletic' : 'Full';
    }
    
    // Return recommendations based on body type
    switch(bodyType) {
      case 'V-Shape':
        return {
          bodyType,
          recommendedStyles: [
            'Fitted shirts', 'Structured jackets', 'Straight-leg pants',
            'Layered tops', 'Well-tailored suits'
          ],
          avoidStyles: [
            'Overly slim pants', 'Oversized tops', 'Excessively tight shirts'
          ],
          accentFeatures: ['Broad shoulders', 'Chest']
        };
      case 'Athletic':
        return {
          bodyType,
          recommendedStyles: [
            'Tailored clothing', 'Structured garments', 'Fitted shirts',
            'Classic cuts', 'Slim-fit jeans'
          ],
          avoidStyles: [
            'Extremely loose clothing', 'Shapeless garments'
          ],
          accentFeatures: ['Overall proportioned physique']
        };
      case 'Rectangle':
        return {
          bodyType,
          recommendedStyles: [
            'Layered looks', 'Structured shoulders', 'Textured fabrics',
            'Horizontal patterns', 'Pocket details'
          ],
          avoidStyles: [
            'Vertical stripes', 'Monochromatic looks', 'Overly fitted shirts'
          ],
          accentFeatures: ['Create visual interest', 'Add dimension']
        };
      case 'Oval':
        return {
          bodyType,
          recommendedStyles: [
            'Structured jackets', 'Vertical patterns', 'Dark colors',
            'V-neck tops', 'Well-fitted (not tight) clothing'
          ],
          avoidStyles: [
            'Tight-fitting clothes', 'Horizontal stripes', 'Bulky layers',
            'Low-rise pants'
          ],
          accentFeatures: ['Create vertical lines', 'Elongate silhouette']
        };
      default:
        return {
          bodyType: 'Average',
          recommendedStyles: [
            'Well-fitted clothing', 'Classic cuts', 'Balanced proportions'
          ],
          avoidStyles: [
            'Extremely oversized', 'Extremely fitted'
          ],
          accentFeatures: ['Overall balanced look']
        };
    }
  }
};

// Utility function to convert hex color to HSL
interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

const hexToHSL = (hex: string): HSL => {
  // Remove # if present
  const hexColor = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hexColor.substring(0, 2), 16) / 255;
  const g = parseInt(hexColor.substring(2, 4), 16) / 255;
  const b = parseInt(hexColor.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / d + 2;
        break;
      case b:
        hue = (r - g) / d + 4;
        break;
    }
    
    hue /= 6;
  }
  
  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100)
  };
};

// Utility function to convert HSL to hex
const hslToHex = (hsl: HSL): string => {
  const { h, s, l } = hsl;
  const h1 = h / 360;
  const s1 = s / 100;
  const l1 = l / 100;
  
  let r, g, b;
  
  if (s1 === 0) {
    r = g = b = l1;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1;
    const p = 2 * l1 - q;
    
    r = hue2rgb(p, q, h1 + 1/3);
    g = hue2rgb(p, q, h1);
    b = hue2rgb(p, q, h1 - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate color matches from wardrobe based on color theory
export const generateColorMatches = (
  baseColor: string,
  allColors: string[],
  matchType: ColorHarmony = ColorHarmony.Complementary
): string[] => {
  const targetColors = getColorHarmony(baseColor, matchType);
  
  // Find colors in the wardrobe that are close to the target harmony colors
  const matches: string[] = [];
  
  targetColors.forEach(targetColor => {
    // Skip the base color itself
    if (targetColor === baseColor) return;
    
    // Find the closest match in the wardrobe
    let closestColor = '';
    let closestDistance = Number.MAX_VALUE;
    
    allColors.forEach(color => {
      const distance = getColorDistance(targetColor, color);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = color;
      }
    });
    
    if (closestColor && closestDistance < 150) { // Threshold for "close enough"
      matches.push(closestColor);
    }
  });
  
  return matches;
};

// Calculate color distance (using RGB Euclidean distance)
const getColorDistance = (color1: string, color2: string): number => {
  // Remove # if present
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  // Parse colors
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  // Calculate Euclidean distance
  return Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
  );
}; 