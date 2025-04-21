import { SkinTone, HairColor, EyeColor, WardrobeItem, ItemCategory } from '../types';
import { colorPaletteRecommendations } from '../data/mockData';

/**
 * Determine if two colors are complementary
 * @param color1 - Hex color code
 * @param color2 - Hex color code
 * @returns Boolean indicating if colors complement each other
 */
export const areColorsComplementary = (color1: string, color2: string): boolean => {
  // Simple implementation - in a real app, would use more sophisticated color theory
  const neutralColors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#000000', '#1f2937', '#6b7280'];
  
  // Neutral colors go with anything
  if (neutralColors.includes(color1) || neutralColors.includes(color2)) {
    return true;
  }

  // Basic color groups that work well together
  const colorGroups = [
    ['#3b82f6', '#06b6d4', '#0284c7', '#0ea5e9'], // Blue family
    ['#10b981', '#84cc16', '#22c55e', '#16a34a'], // Green family
    ['#f97316', '#f59e0b', '#eab308', '#facc15'], // Orange/Yellow family
    ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899'], // Purple/Pink family
    ['#7c2d12', '#92400e', '#a16207', '#b45309']  // Brown family
  ];

  // Check if colors are in the same family
  for (const group of colorGroups) {
    if (group.includes(color1) && group.includes(color2)) {
      return true;
    }
  }

  // Classic complementary pairs
  const complementaryPairs = [
    ['#3b82f6', '#f97316'], // Blue & Orange
    ['#10b981', '#f43f5e'], // Green & Red
    ['#8b5cf6', '#f59e0b'], // Purple & Yellow
    ['#06b6d4', '#f97316'], // Cyan & Orange
    ['#84cc16', '#8b5cf6']  // Lime & Purple
  ];

  for (const pair of complementaryPairs) {
    if ((pair[0] === color1 && pair[1] === color2) || (pair[0] === color2 && pair[1] === color1)) {
      return true;
    }
  }

  return false;
};

/**
 * Get recommended color palette based on physical traits
 * @param skinTone - User's skin tone
 * @param hairColor - User's hair color
 * @param eyeColor - User's eye color
 * @returns Array of hex color codes
 */
export const getRecommendedColorPalette = (
  skinTone: SkinTone,
  hairColor: HairColor,
  eyeColor: EyeColor
): string[] => {
  const key = `${skinTone}-${hairColor}-${eyeColor}`;
  
  return colorPaletteRecommendations[key] || colorPaletteRecommendations['default'];
};

/**
 * Check if outfit items match well together
 * @param items - Array of wardrobe items
 * @returns Score from 0-1 indicating how well the outfit matches
 */
export const calculateOutfitMatchScore = (items: WardrobeItem[]): number => {
  if (items.length < 2) return 1; // Single item always matches
  
  let totalPairs = 0;
  let matchingPairs = 0;
  
  // Compare each item with every other item
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];
      
      // Skip comparing items in the same category
      if (item1.category === item2.category) continue;
      
      totalPairs++;
      
      // Check if any color from item1 complements any color from item2
      let colorsMatch = false;
      for (const color1 of item1.colors) {
        for (const color2 of item2.colors) {
          if (areColorsComplementary(color1, color2)) {
            colorsMatch = true;
            break;
          }
        }
        if (colorsMatch) break;
      }
      
      if (colorsMatch) {
        matchingPairs++;
      }
    }
  }
  
  return totalPairs > 0 ? matchingPairs / totalPairs : 1;
};

/**
 * Get item matches from wardrobe
 * @param item - Item to find matches for
 * @param wardrobeItems - All wardrobe items
 * @returns Array of matching items with match scores
 */
export const getItemMatches = (
  item: WardrobeItem,
  wardrobeItems: WardrobeItem[]
): { item: WardrobeItem; score: number }[] => {
  const matches: { item: WardrobeItem; score: number }[] = [];
  
  for (const wardrobeItem of wardrobeItems) {
    // Skip comparing with itself or items in the same category
    if (wardrobeItem.id === item.id || wardrobeItem.category === item.category) {
      continue;
    }
    
    let totalComparisons = 0;
    let matchingComparisons = 0;
    
    // Compare each color from the item with each color from the wardrobe item
    for (const color1 of item.colors) {
      for (const color2 of wardrobeItem.colors) {
        totalComparisons++;
        if (areColorsComplementary(color1, color2)) {
          matchingComparisons++;
        }
      }
    }
    
    const score = totalComparisons > 0 ? matchingComparisons / totalComparisons : 0;
    
    matches.push({
      item: wardrobeItem,
      score
    });
  }
  
  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
};

/**
 * Generate a complete outfit based on a single item
 * @param baseItem - Item to build outfit around
 * @param wardrobeItems - All wardrobe items
 * @returns Array of items forming a complete outfit
 */
export const generateOutfitFromItem = (
  baseItem: WardrobeItem,
  wardrobeItems: WardrobeItem[]
): WardrobeItem[] => {
  const outfit: WardrobeItem[] = [baseItem];
  const matches = getItemMatches(baseItem, wardrobeItems);
  
  // Categories we want in a complete outfit
  const desiredCategories = [
    ItemCategory.Top,
    ItemCategory.Bottom,
    ItemCategory.Footwear,
    ItemCategory.Outerwear
  ];
  
  // If the base item is a dress, adjust desired categories
  if (baseItem.category === ItemCategory.Dress) {
    desiredCategories.splice(desiredCategories.indexOf(ItemCategory.Top), 1);
    desiredCategories.splice(desiredCategories.indexOf(ItemCategory.Bottom), 1);
  }
  
  // Remove the base item's category from desired categories
  const index = desiredCategories.indexOf(baseItem.category);
  if (index !== -1) {
    desiredCategories.splice(index, 1);
  }
  
  // Add highest scoring items for each desired category
  for (const category of desiredCategories) {
    const categoryMatches = matches.filter(match => match.item.category === category);
    if (categoryMatches.length > 0) {
      outfit.push(categoryMatches[0].item);
    }
  }
  
  // Add an accessory if available and matches well
  const accessoryMatches = matches.filter(match => match.item.category === ItemCategory.Accessory);
  if (accessoryMatches.length > 0 && accessoryMatches[0].score > 0.7) {
    outfit.push(accessoryMatches[0].item);
  }
  
  return outfit;
}; 