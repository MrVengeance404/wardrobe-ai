import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WardrobeItem, Outfit } from '../types';
import { mockWardrobeItems, mockOutfits } from '../data/mockData';
import { useAuth } from './AuthContext';

interface WardrobeContextType {
  wardrobeItems: WardrobeItem[];
  outfits: Outfit[];
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<WardrobeItem>;
  updateItem: (id: string, item: Partial<WardrobeItem>) => Promise<WardrobeItem>;
  deleteItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<WardrobeItem>;
  addOutfit: (outfit: Omit<Outfit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'likes'>) => Promise<Outfit>;
  updateOutfit: (id: string, outfit: Partial<Outfit>) => Promise<Outfit>;
  deleteOutfit: (id: string) => Promise<void>;
  toggleOutfitPublic: (id: string) => Promise<Outfit>;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const useWardrobe = (): WardrobeContextType => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};

interface WardrobeProviderProps {
  children: ReactNode;
}

export const WardrobeProvider: React.FC<WardrobeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWardrobeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, we would fetch from an API
        // For demo, using mock data
        await new Promise(resolve => setTimeout(resolve, 500));

        // Only load data if we have a user
        if (user) {
          setWardrobeItems(mockWardrobeItems);
          setOutfits(mockOutfits);
        } else {
          setWardrobeItems([]);
          setOutfits([]);
        }
      } catch (err) {
        setError('Failed to load wardrobe data');
      } finally {
        setLoading(false);
      }
    };

    fetchWardrobeData();
  }, [user]);

  const addItem = async (
    item: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<WardrobeItem> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));

      const newItem: WardrobeItem = {
        ...item,
        id: `item-${Date.now()}`,
        userId: user?.id || '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setWardrobeItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError('Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (
    id: string,
    item: Partial<WardrobeItem>
  ): Promise<WardrobeItem> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedItems = wardrobeItems.map(existingItem => {
        if (existingItem.id === id) {
          return {
            ...existingItem,
            ...item,
            updatedAt: new Date(),
          };
        }
        return existingItem;
      });

      setWardrobeItems(updatedItems);
      const updatedItem = updatedItems.find(item => item.id === id);

      if (!updatedItem) {
        throw new Error('Item not found');
      }

      return updatedItem;
    } catch (err) {
      setError('Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));

      setWardrobeItems(prev => prev.filter(item => item.id !== id));

      // Also remove the item from any outfits
      setOutfits(prev =>
        prev.map(outfit => ({
          ...outfit,
          items: outfit.items.filter(item => item.id !== id),
          updatedAt: new Date(),
        }))
      );
    } catch (err) {
      setError('Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string): Promise<WardrobeItem> => {
    try {
      const item = wardrobeItems.find(item => item.id === id);
      if (!item) {
        throw new Error('Item not found');
      }

      return await updateItem(id, { isFavorite: !item.isFavorite });
    } catch (err) {
      setError('Failed to toggle favorite');
      throw err;
    }
  };

  const addOutfit = async (
    outfit: Omit<Outfit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'likes'>
  ): Promise<Outfit> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));

      const newOutfit: Outfit = {
        ...outfit,
        id: `outfit-${Date.now()}`,
        userId: user?.id || '1',
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setOutfits(prev => [...prev, newOutfit]);
      return newOutfit;
    } catch (err) {
      setError('Failed to add outfit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOutfit = async (
    id: string,
    outfit: Partial<Outfit>
  ): Promise<Outfit> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedOutfits = outfits.map(existingOutfit => {
        if (existingOutfit.id === id) {
          return {
            ...existingOutfit,
            ...outfit,
            updatedAt: new Date(),
          };
        }
        return existingOutfit;
      });

      setOutfits(updatedOutfits);
      const updatedOutfit = updatedOutfits.find(outfit => outfit.id === id);

      if (!updatedOutfit) {
        throw new Error('Outfit not found');
      }

      return updatedOutfit;
    } catch (err) {
      setError('Failed to update outfit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOutfit = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));

      setOutfits(prev => prev.filter(outfit => outfit.id !== id));
    } catch (err) {
      setError('Failed to delete outfit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleOutfitPublic = async (id: string): Promise<Outfit> => {
    try {
      const outfit = outfits.find(outfit => outfit.id === id);
      if (!outfit) {
        throw new Error('Outfit not found');
      }

      return await updateOutfit(id, { isPublic: !outfit.isPublic });
    } catch (err) {
      setError('Failed to toggle outfit visibility');
      throw err;
    }
  };

  return (
    <WardrobeContext.Provider
      value={{
        wardrobeItems,
        outfits,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        toggleFavorite,
        addOutfit,
        updateOutfit,
        deleteOutfit,
        toggleOutfitPublic,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}; 