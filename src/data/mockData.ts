import { 
  User, 
  SkinTone, 
  HairColor, 
  EyeColor, 
  Gender,
  WardrobeItem,
  ItemCategory,
  ItemStyle,
  Season,
  Outfit,
  ThemeOutfit
} from '../types';

// Mock user data
export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  username: 'fashionista',
  profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
  skinTone: SkinTone.Medium,
  hairColor: HairColor.Brown,
  eyeColor: EyeColor.Brown,
  gender: Gender.Male,
  sizes: {
    shirt: 'M',
    pants: '32',
    shoes: '10'
  },
  colorPalette: ['#3b82f6', '#10b981', '#f59e0b', '#6b7280', '#1f2937'],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock wardrobe items
export const mockWardrobeItems: WardrobeItem[] = [
  {
    id: '1',
    userId: '1',
    name: 'White Button-Up Shirt',
    category: ItemCategory.Top,
    subcategory: 'Button-Up',
    fabric: 'Cotton',
    style: ItemStyle.Formal,
    colors: ['#ffffff'],
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
    isFavorite: true,
    season: [Season.Spring, Season.Summer, Season.Fall, Season.Winter],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: '1',
    name: 'Navy Blue Chinos',
    category: ItemCategory.Bottom,
    subcategory: 'Pants',
    fabric: 'Cotton',
    style: ItemStyle.Business,
    colors: ['#1f2937'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
    isFavorite: true,
    season: [Season.Spring, Season.Fall, Season.Winter],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    userId: '1',
    name: 'Brown Leather Shoes',
    category: ItemCategory.Footwear,
    subcategory: 'Oxfords',
    fabric: 'Leather',
    style: ItemStyle.Formal,
    colors: ['#92400e'],
    imageUrl: 'https://images.unsplash.com/photo-1614253440448-45782271e6c0',
    isFavorite: false,
    season: [Season.Fall, Season.Winter],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    userId: '1',
    name: 'Black T-Shirt',
    category: ItemCategory.Top,
    subcategory: 'T-Shirt',
    fabric: 'Cotton',
    style: ItemStyle.Casual,
    colors: ['#000000'],
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    isFavorite: true,
    season: [Season.Spring, Season.Summer, Season.Fall],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    userId: '1',
    name: 'Blue Jeans',
    category: ItemCategory.Bottom,
    subcategory: 'Jeans',
    fabric: 'Denim',
    style: ItemStyle.Casual,
    colors: ['#3b82f6'],
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    isFavorite: true,
    season: [Season.Spring, Season.Fall, Season.Winter],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    userId: '1',
    name: 'White Sneakers',
    category: ItemCategory.Footwear,
    subcategory: 'Sneakers',
    fabric: 'Canvas',
    style: ItemStyle.Casual,
    colors: ['#ffffff'],
    imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28',
    isFavorite: false,
    season: [Season.Spring, Season.Summer],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    userId: '1',
    name: 'Navy Blue Blazer',
    category: ItemCategory.Outerwear,
    subcategory: 'Blazer',
    fabric: 'Wool',
    style: ItemStyle.Formal,
    colors: ['#1e3a8a'],
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
    isFavorite: true,
    season: [Season.Fall, Season.Winter],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock outfits
export const mockOutfits: Outfit[] = [
  {
    id: '1',
    userId: '1',
    name: 'Business Casual',
    description: 'Great for office and meetings',
    items: [
      mockWardrobeItems[0], // White Button-Up Shirt
      mockWardrobeItems[1], // Navy Blue Chinos
      mockWardrobeItems[2], // Brown Leather Shoes
    ],
    style: ItemStyle.Business,
    season: [Season.Spring, Season.Fall],
    occasion: 'Work',
    isPublic: true,
    likes: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: '1',
    name: 'Weekend Casual',
    description: 'Comfortable everyday outfit',
    items: [
      mockWardrobeItems[3], // Black T-Shirt
      mockWardrobeItems[4], // Blue Jeans
      mockWardrobeItems[5], // White Sneakers
    ],
    style: ItemStyle.Casual,
    season: [Season.Spring, Season.Summer],
    occasion: 'Casual',
    isPublic: true,
    likes: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock theme outfits
export const mockThemeOutfits: ThemeOutfit[] = [
  {
    id: '1',
    name: 'Bruce Wayne Business Look',
    description: 'Look sharp and successful like Bruce Wayne',
    character: 'Bruce Wayne',
    items: [
      {
        category: ItemCategory.Top,
        subcategory: 'Dress Shirt',
        description: 'Crisp white or light blue dress shirt',
        colors: ['#ffffff', '#e0f2fe'],
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10'
      },
      {
        category: ItemCategory.Bottom,
        subcategory: 'Dress Pants',
        description: 'Dark charcoal or navy dress pants',
        colors: ['#1f2937', '#0f172a'],
        imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a'
      },
      {
        category: ItemCategory.Outerwear,
        subcategory: 'Suit Jacket',
        description: 'Perfectly tailored navy or charcoal suit jacket',
        colors: ['#1e3a8a', '#1f2937'],
        imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22'
      },
      {
        category: ItemCategory.Footwear,
        subcategory: 'Oxford Shoes',
        description: 'Polished black or dark brown Oxford shoes',
        colors: ['#000000', '#3f2305'],
        imageUrl: 'https://images.unsplash.com/photo-1614253440448-45782271e6c0'
      },
      {
        category: ItemCategory.Accessory,
        subcategory: 'Watch',
        description: 'Luxury watch with leather or metal band',
        colors: ['#000000', '#6b7280'],
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d'
      }
    ],
    imageUrl: 'https://www.themoviedb.org/t/p/original/xOFW7jcXEFID7EwM25IvSEGWpWx.jpg',
    style: ItemStyle.Formal,
    season: [Season.Fall, Season.Winter, Season.Spring]
  },
  {
    id: '2',
    name: 'Ken Summer Vibe',
    description: 'Bright and fun like Ken from Barbie',
    character: 'Ken',
    items: [
      {
        category: ItemCategory.Top,
        subcategory: 'Polo Shirt',
        description: 'Pastel colored polo shirt',
        colors: ['#fda4af', '#67e8f9', '#fef08a'],
        imageUrl: 'https://images.unsplash.com/photo-1626266079421-9b9ae6ddbf77'
      },
      {
        category: ItemCategory.Bottom,
        subcategory: 'Shorts',
        description: 'Light colored shorts',
        colors: ['#ffffff', '#e0f2fe', '#fef9c3'],
        imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475'
      },
      {
        category: ItemCategory.Footwear,
        subcategory: 'Loafers',
        description: 'Preppy loafers or boat shoes',
        colors: ['#fef9c3', '#ffffff', '#f87171'],
        imageUrl: 'https://images.unsplash.com/photo-1573100925118-870b8efc799d'
      },
      {
        category: ItemCategory.Accessory,
        subcategory: 'Sunglasses',
        description: 'Bright or pastel colored sunglasses',
        colors: ['#f97316', '#3b82f6', '#fef08a'],
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083'
      }
    ],
    imageUrl: 'https://www.themoviedb.org/t/p/original/iQsLY4JxJ0fz2N9NBX9Y4TKcJaJ.jpg',
    style: ItemStyle.Preppy,
    season: [Season.Summer]
  },
  {
    id: '3',
    name: 'Peter Parker Budget Look',
    description: 'Simple, practical and budget-friendly like Peter Parker',
    character: 'Peter Parker',
    items: [
      {
        category: ItemCategory.Top,
        subcategory: 'T-Shirt',
        description: 'Simple graphic tee or plain colored t-shirt',
        colors: ['#3b82f6', '#000000', '#6b7280'],
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'
      },
      {
        category: ItemCategory.Bottom,
        subcategory: 'Jeans',
        description: 'Classic blue jeans, slightly worn',
        colors: ['#1d4ed8'],
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d'
      },
      {
        category: ItemCategory.Outerwear,
        subcategory: 'Hoodie',
        description: 'Simple zip-up or pullover hoodie',
        colors: ['#6b7280', '#0ea5e9', '#1f2937'],
        imageUrl: 'https://images.unsplash.com/photo-1565693413579-8a73ffa8de15'
      },
      {
        category: ItemCategory.Footwear,
        subcategory: 'Sneakers',
        description: 'Classic sneakers, well worn',
        colors: ['#ffffff', '#000000', '#6b7280'],
        imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28'
      },
      {
        category: ItemCategory.Accessory,
        subcategory: 'Backpack',
        description: 'Simple practical backpack',
        colors: ['#0ea5e9', '#1f2937', '#6b7280'],
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
      }
    ],
    imageUrl: 'https://www.themoviedb.org/t/p/original/15ozYdreUG2Ad60RJXLbPXceW5u.jpg',
    style: ItemStyle.Casual,
    season: [Season.Spring, Season.Fall]
  }
];

// Color palette based on skin tone, hair color, and eye color
export const colorPaletteRecommendations: Record<string, string[]> = {
  // Medium skin + Brown hair + Brown eyes
  'medium-brown-brown': [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#6b7280', // Gray
    '#1f2937'  // Dark Gray
  ],
  // Fair skin + Blonde hair + Blue eyes
  'fair-blonde-blue': [
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#f43f5e', // Rose
    '#0f172a'  // Navy
  ],
  // Olive skin + Black hair + Brown eyes
  'olive-black-brown': [
    '#f97316', // Orange
    '#0891b2', // Cyan
    '#a16207', // Amber
    '#84cc16', // Lime
    '#7c2d12'  // Brown
  ],
  // Default palette
  'default': [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#6b7280', // Gray
    '#1f2937'  // Dark Gray
  ]
}; 