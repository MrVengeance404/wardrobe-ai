// User types
export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  skinTone: SkinTone;
  hairColor: HairColor;
  eyeColor: EyeColor;
  gender: Gender;
  sizes: UserSizes;
  colorPalette: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum SkinTone {
  Fair = "fair",
  Light = "light",
  Medium = "medium",
  Olive = "olive",
  Brown = "brown",
  Dark = "dark"
}

export enum HairColor {
  Black = "black",
  Brown = "brown",
  Blonde = "blonde",
  Red = "red",
  Gray = "gray"
}

export enum EyeColor {
  Brown = "brown",
  Blue = "blue",
  Green = "green",
  Hazel = "hazel",
  Gray = "gray",
  Amber = "amber",
  Black = "black"
}

export enum Gender {
  Male = "male",
  Female = "female",
  NonBinary = "non-binary",
  Other = "other",
  PreferNotToSay = "prefer-not-to-say"
}

export interface UserSizes {
  shirt: string;
  pants: string;
  shoes: string;
  [key: string]: string;
}

// Wardrobe types
export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: ItemCategory;
  subcategory?: string;
  fabric?: string;
  style: ItemStyle;
  colors: string[];
  imageUrl?: string;
  isFavorite: boolean;
  season: Season[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ItemCategory {
  Top = "top",
  Bottom = "bottom",
  Footwear = "footwear",
  Outerwear = "outerwear",
  Accessory = "accessory",
  Dress = "dress",
  Underwear = "underwear",
  Loungewear = "loungewear",
  Sportswear = "sportswear",
  Formal = "formal"
}

export enum ItemStyle {
  Casual = "casual",
  Formal = "formal",
  Business = "business",
  Sporty = "sporty",
  Streetwear = "streetwear",
  Vintage = "vintage",
  Boho = "boho",
  Preppy = "preppy",
  Minimal = "minimal",
  Glam = "glam"
}

export enum Season {
  Spring = "spring",
  Summer = "summer",
  Fall = "fall",
  Winter = "winter",
  AllYear = "all-year"
}

// Outfit types
export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: WardrobeItem[];
  style: ItemStyle;
  season: Season[];
  occasion?: string;
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Theme types
export interface ThemeOutfit {
  id: string;
  name: string;
  description: string;
  character: string;
  items: ThemeItem[];
  imageUrl?: string;
  style: ItemStyle;
  season: Season[];
}

export interface ThemeItem {
  category: ItemCategory;
  subcategory?: string;
  description: string;
  colors: string[];
  imageUrl?: string;
}

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Recommendation types
export interface OutfitRecommendation {
  id: string;
  name: string;
  items: WardrobeItem[];
  missingItems?: ThemeItem[];
  occasion?: string;
  confidence: number;
} 