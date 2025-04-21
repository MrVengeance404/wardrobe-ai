import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeOutfit, WardrobeItem } from '../types';
import { mockThemeOutfits } from '../data/mockData';
import { useWardrobe } from './WardrobeContext';

interface ThemeContextType {
  themeOutfits: ThemeOutfit[];
  loading: boolean;
  error: string | null;
  getThemeById: (id: string) => ThemeOutfit | undefined;
  findMatchingItems: (themeOutfit: ThemeOutfit) => { 
    matchedItems: {
      themeItem: ThemeOutfit['items'][0];
      wardrobeItem: WardrobeItem;
      matchScore: number;
    }[];
    missingItems: ThemeOutfit['items'];
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { wardrobeItems } = useWardrobe();
  const [themeOutfits, setThemeOutfits] = useState<ThemeOutfit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, we would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 500));

        setThemeOutfits(mockThemeOutfits);
      } catch (err) {
        setError('Failed to load theme outfits');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const getThemeById = (id: string): ThemeOutfit | undefined => {
    return themeOutfits.find(theme => theme.id === id);
  };

  // Function to check if a color is similar to another color
  const areColorsSimilar = (color1: string, color2: string): boolean => {
    // This is a simplified implementation
    // In a real app, we would use more sophisticated color distance calculation
    return color1.toLowerCase() === color2.toLowerCase();
  };

  // Function to calculate match score between theme item and wardrobe item
  const calculateMatchScore = (
    themeItem: ThemeOutfit['items'][0],
    wardrobeItem: WardrobeItem
  ): number => {
    // Check if category matches
    if (themeItem.category !== wardrobeItem.category) {
      return 0;
    }

    // Check subcategory match if both have it (optional)
    let subcategoryScore = 1;
    if (themeItem.subcategory && wardrobeItem.subcategory) {
      subcategoryScore = themeItem.subcategory.toLowerCase() === wardrobeItem.subcategory.toLowerCase() ? 1 : 0.5;
    }

    // Check color match
    let colorScore = 0;
    if (themeItem.colors.length > 0 && wardrobeItem.colors.length > 0) {
      let colorMatches = 0;
      for (const themeColor of themeItem.colors) {
        for (const wardrobeColor of wardrobeItem.colors) {
          if (areColorsSimilar(themeColor, wardrobeColor)) {
            colorMatches++;
          }
        }
      }
      colorScore = colorMatches > 0 ? Math.min(1, colorMatches / themeItem.colors.length) : 0;
    } else {
      colorScore = 0.5; // Neutral score if no colors to compare
    }

    // Final score is weighted average
    return (subcategoryScore * 0.4) + (colorScore * 0.6);
  };

  // Find matching items in user's wardrobe for a given theme outfit
  const findMatchingItems = (themeOutfit: ThemeOutfit) => {
    const matchedItems: {
      themeItem: ThemeOutfit['items'][0];
      wardrobeItem: WardrobeItem;
      matchScore: number;
    }[] = [];

    const missingItems: ThemeOutfit['items'] = [];

    // For each theme item, find the best matching wardrobe item
    for (const themeItem of themeOutfit.items) {
      let bestMatch: { wardrobeItem: WardrobeItem; score: number } | null = null;

      for (const wardrobeItem of wardrobeItems) {
        const score = calculateMatchScore(themeItem, wardrobeItem);
        if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { wardrobeItem, score };
        }
      }

      if (bestMatch) {
        matchedItems.push({
          themeItem,
          wardrobeItem: bestMatch.wardrobeItem,
          matchScore: bestMatch.score,
        });
      } else {
        missingItems.push(themeItem);
      }
    }

    return {
      matchedItems,
      missingItems,
    };
  };

  return (
    <ThemeContext.Provider
      value={{
        themeOutfits,
        loading,
        error,
        getThemeById,
        findMatchingItems,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 