import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WardrobeItem, OutfitRecommendation, Season, ItemStyle } from '../types';
import { useWardrobe } from './WardrobeContext';
import { generateOutfitFromItem, calculateOutfitMatchScore } from '../utils/colorUtils';

interface RecommendationContextType {
  recommendations: OutfitRecommendation[];
  loading: boolean;
  error: string | null;
  generateRecommendations: (count?: number) => Promise<OutfitRecommendation[]>;
  getRecommendationsForItem: (item: WardrobeItem) => Promise<OutfitRecommendation>;
  getRecommendationsForOccasion: (occasion: string, count?: number) => Promise<OutfitRecommendation[]>;
  getRecommendationsForSeason: (season: Season, count?: number) => Promise<OutfitRecommendation[]>;
  getRecommendationsForStyle: (style: ItemStyle, count?: number) => Promise<OutfitRecommendation[]>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const useRecommendation = (): RecommendationContextType => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendation must be used within a RecommendationProvider');
  }
  return context;
};

interface RecommendationProviderProps {
  children: ReactNode;
}

export const RecommendationProvider: React.FC<RecommendationProviderProps> = ({ children }) => {
  const { wardrobeItems } = useWardrobe();
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate random ID for recommendation
  const generateId = (): string => {
    return `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Get current season based on date
  const getCurrentSeason = (): Season => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return Season.Spring;
    if (month >= 5 && month <= 7) return Season.Summer;
    if (month >= 8 && month <= 10) return Season.Fall;
    return Season.Winter;
  };

  // Filter wardrobe items by season
  const filterItemsBySeason = (items: WardrobeItem[], season: Season): WardrobeItem[] => {
    return items.filter(item => item.season.includes(season) || item.season.includes(Season.AllYear));
  };

  // Generate outfit recommendations
  const generateRecommendations = async (count: number = 3): Promise<OutfitRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);

      if (wardrobeItems.length < 2) {
        throw new Error('Not enough items in wardrobe to generate recommendations');
      }

      // Get current season
      const currentSeason = getCurrentSeason();
      
      // Filter items by current season
      const seasonalItems = filterItemsBySeason(wardrobeItems, currentSeason);
      
      if (seasonalItems.length < 2) {
        throw new Error(`Not enough items for ${currentSeason} season`);
      }

      // Group items by category to ensure we create diverse outfits
      const topItems = seasonalItems.filter(item => item.category === 'top');
      const bottomItems = seasonalItems.filter(item => item.category === 'bottom');
      const footwearItems = seasonalItems.filter(item => item.category === 'footwear');
      
      // Ensure we have enough items to generate outfits
      if (topItems.length === 0 || bottomItems.length === 0 || footwearItems.length === 0) {
        throw new Error('Need at least one top, bottom, and footwear item');
      }

      // Create recommendations
      const newRecommendations: OutfitRecommendation[] = [];

      // Try creating outfits starting from different base items
      const baseItems = [...topItems, ...bottomItems].slice(0, count * 2);
      
      for (const baseItem of baseItems) {
        if (newRecommendations.length >= count) break;
        
        const outfitItems = generateOutfitFromItem(baseItem, seasonalItems);
        
        // Only add if we have at least 3 items and a good match score
        if (outfitItems.length >= 3) {
          const matchScore = calculateOutfitMatchScore(outfitItems);
          
          if (matchScore > 0.7) {
            newRecommendations.push({
              id: generateId(),
              name: `${baseItem.style} Outfit`,
              items: outfitItems,
              occasion: baseItem.style === 'formal' ? 'Work' : 'Casual',
              confidence: matchScore,
            });
          }
        }
      }

      // If we still don't have enough recommendations, create some generic ones
      while (newRecommendations.length < count && topItems.length > 0 && bottomItems.length > 0 && footwearItems.length > 0) {
        const top = topItems[Math.floor(Math.random() * topItems.length)];
        const bottom = bottomItems[Math.floor(Math.random() * bottomItems.length)];
        const footwear = footwearItems[Math.floor(Math.random() * footwearItems.length)];
        
        const outfitItems = [top, bottom, footwear];
        const matchScore = calculateOutfitMatchScore(outfitItems);
        
        newRecommendations.push({
          id: generateId(),
          name: `${top.style} Outfit`,
          items: outfitItems,
          occasion: top.style === 'formal' ? 'Work' : 'Casual',
          confidence: matchScore,
        });
      }

      // Update state with new recommendations
      setRecommendations(newRecommendations);
      return newRecommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate a recommendation based on a specific item
  const getRecommendationsForItem = async (item: WardrobeItem): Promise<OutfitRecommendation> => {
    try {
      setLoading(true);
      setError(null);

      const outfitItems = generateOutfitFromItem(item, wardrobeItems);
      const matchScore = calculateOutfitMatchScore(outfitItems);

      const recommendation: OutfitRecommendation = {
        id: generateId(),
        name: `${item.name} Outfit`,
        items: outfitItems,
        occasion: item.style === 'formal' ? 'Work' : 'Casual',
        confidence: matchScore,
      };

      return recommendation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get recommendations for a specific occasion
  const getRecommendationsForOccasion = async (occasion: string, count: number = 3): Promise<OutfitRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);

      // Map occasion to styles
      let styles: ItemStyle[] = [];
      
      switch (occasion.toLowerCase()) {
        case 'work':
        case 'business':
        case 'office':
          styles = ['formal', 'business'] as ItemStyle[];
          break;
        case 'casual':
        case 'everyday':
        case 'weekend':
          styles = ['casual', 'streetwear'] as ItemStyle[];
          break;
        case 'party':
        case 'evening':
          styles = ['glam', 'formal'] as ItemStyle[];
          break;
        default:
          styles = ['casual'] as ItemStyle[];
      }

      // Filter items by style
      const occasionItems = wardrobeItems.filter(item => styles.includes(item.style));
      
      if (occasionItems.length < 3) {
        throw new Error(`Not enough items for ${occasion} occasion`);
      }

      // Generate recommendations using the filtered items
      const newRecommendations: OutfitRecommendation[] = [];
      
      // Group items by category
      const topItems = occasionItems.filter(item => item.category === 'top');
      const bottomItems = occasionItems.filter(item => item.category === 'bottom');
      const footwearItems = occasionItems.filter(item => item.category === 'footwear');
      
      // Create outfits
      for (let i = 0; i < count && i < topItems.length; i++) {
        const top = topItems[i];
        const bottom = bottomItems[i % bottomItems.length];
        const footwear = footwearItems[i % footwearItems.length];
        
        const outfitItems = [top, bottom, footwear];
        const matchScore = calculateOutfitMatchScore(outfitItems);
        
        newRecommendations.push({
          id: generateId(),
          name: `${occasion} Outfit ${i + 1}`,
          items: outfitItems,
          occasion,
          confidence: matchScore,
        });
      }

      return newRecommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get recommendations for a specific season
  const getRecommendationsForSeason = async (season: Season, count: number = 3): Promise<OutfitRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);

      // Filter items by season
      const seasonalItems = filterItemsBySeason(wardrobeItems, season);
      
      if (seasonalItems.length < 3) {
        throw new Error(`Not enough items for ${season} season`);
      }

      // Generate recommendations using the filtered items
      const newRecommendations: OutfitRecommendation[] = [];
      
      // Group items by category
      const topItems = seasonalItems.filter(item => item.category === 'top');
      const bottomItems = seasonalItems.filter(item => item.category === 'bottom');
      const footwearItems = seasonalItems.filter(item => item.category === 'footwear');
      
      // Create outfits
      for (let i = 0; i < count && i < Math.min(topItems.length, bottomItems.length, footwearItems.length); i++) {
        const top = topItems[i % topItems.length];
        const bottom = bottomItems[i % bottomItems.length];
        const footwear = footwearItems[i % footwearItems.length];
        
        const outfitItems = [top, bottom, footwear];
        const matchScore = calculateOutfitMatchScore(outfitItems);
        
        newRecommendations.push({
          id: generateId(),
          name: `${season} Outfit ${i + 1}`,
          items: outfitItems,
          occasion: `${season} day`,
          confidence: matchScore,
        });
      }

      return newRecommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get recommendations for a specific style
  const getRecommendationsForStyle = async (style: ItemStyle, count: number = 3): Promise<OutfitRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);

      // Filter items by style
      const styleItems = wardrobeItems.filter(item => item.style === style);
      
      if (styleItems.length < 3) {
        throw new Error(`Not enough items for ${style} style`);
      }

      // Generate recommendations using the filtered items
      const newRecommendations: OutfitRecommendation[] = [];
      
      // Group items by category
      const topItems = styleItems.filter(item => item.category === 'top');
      const bottomItems = styleItems.filter(item => item.category === 'bottom');
      const footwearItems = styleItems.filter(item => item.category === 'footwear');
      
      // If we have enough items of each category, create outfits
      if (topItems.length > 0 && bottomItems.length > 0 && footwearItems.length > 0) {
        for (let i = 0; i < count; i++) {
          const top = topItems[i % topItems.length];
          const bottom = bottomItems[i % bottomItems.length];
          const footwear = footwearItems[i % footwearItems.length];
          
          const outfitItems = [top, bottom, footwear];
          const matchScore = calculateOutfitMatchScore(outfitItems);
          
          newRecommendations.push({
            id: generateId(),
            name: `${style} Outfit ${i + 1}`,
            items: outfitItems,
            occasion: style === 'formal' ? 'Work' : 'Casual',
            confidence: matchScore,
          });
        }
      } else {
        // If we don't have items of all categories, use all available items
        for (const baseItem of styleItems.slice(0, count)) {
          const outfitItems = generateOutfitFromItem(baseItem, wardrobeItems);
          if (outfitItems.length >= 3) {
            const matchScore = calculateOutfitMatchScore(outfitItems);
            newRecommendations.push({
              id: generateId(),
              name: `${style} Outfit`,
              items: outfitItems,
              occasion: style === 'formal' ? 'Work' : 'Casual',
              confidence: matchScore,
            });
          }
        }
      }

      return newRecommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate initial recommendations when wardrobe items change
  useEffect(() => {
    if (wardrobeItems.length >= 3) {
      generateRecommendations().catch(err => {
        console.error('Failed to generate initial recommendations', err);
      });
    }
  }, [wardrobeItems]);

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        loading,
        error,
        generateRecommendations,
        getRecommendationsForItem,
        getRecommendationsForOccasion,
        getRecommendationsForSeason,
        getRecommendationsForStyle,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}; 