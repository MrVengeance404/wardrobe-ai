import React, { useState } from 'react';
import { useWardrobe } from '../../context/WardrobeContext';
import { 
  WardrobeItem, 
  ItemCategory, 
  ItemStyle, 
  Season 
} from '../../types';

// Define new enum for patterns
export enum Pattern {
  Solid = "solid",
  Striped = "striped",
  Polka = "polka",
  Floral = "floral",
  Checked = "checked",
  AnimalPrint = "animal print",
  Graphic = "graphic",
  Other = "other"
}

// Define new enum for fabric
export enum Fabric {
  Cotton = "cotton",
  Silk = "silk",
  Denim = "denim",
  Linen = "linen",
  Chiffon = "chiffon",
  Leather = "leather",
  Wool = "wool",
  Synthetic = "synthetic",
  Polyester = "polyester",
  Nylon = "nylon",
  Spandex = "spandex",
  Other = "other"
}

// Define new enum for size
export enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL"
}

// Define new enum for fit
export enum Fit {
  Slim = "slim",
  Regular = "regular",
  Oversized = "oversized",
  Loose = "loose",
  Tight = "tight"
}

// Define new enum for condition
export enum Condition {
  New = "new",
  UsedOnce = "worn once",
  UsedFew = "worn a few times",
  Used = "used",
  WornOut = "worn out"
}

// Define extended item properties
export interface ExtendedItemProperties {
  pattern: Pattern;
  fabric: Fabric;
  size: string;
  fit: Fit;
  brand?: string;
  condition: Condition;
  lastWornDate?: Date;
  primaryColor: string;
  secondaryColor?: string;
  occasions: string[];
}

interface AddItemFormProps {
  onItemAdded: () => void;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onItemAdded, onCancel }) => {
  const { addItem } = useWardrobe();

  // Basic WardrobeItem properties
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.Top);
  const [subcategory, setSubcategory] = useState('');
  const [style, setStyle] = useState<ItemStyle>(ItemStyle.Casual);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Extended properties
  const [pattern, setPattern] = useState<Pattern>(Pattern.Solid);
  const [fabric, setFabric] = useState<Fabric>(Fabric.Cotton);
  const [size, setSize] = useState('');
  const [fit, setFit] = useState<Fit>(Fit.Regular);
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<Condition>(Condition.New);
  const [lastWornDate, setLastWornDate] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [occasions, setOccasions] = useState<string[]>([]);
  const [customOccasion, setCustomOccasion] = useState('');
  
  // Form states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedOccasions = [
    'Casual', 'Formal', 'Wedding', 'Interview', 'Travel', 
    'Work', 'Party', 'Sport', 'Beach', 'Loungewear'
  ];

  const handleSeasonToggle = (season: Season) => {
    setSeasons(prev => 
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };

  const handleOccasionToggle = (occasion: string) => {
    setOccasions(prev => 
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const handleAddCustomOccasion = () => {
    if (customOccasion.trim() && !occasions.includes(customOccasion.trim())) {
      setOccasions(prev => [...prev, customOccasion.trim()]);
      setCustomOccasion('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Validate form
      if (!name.trim()) {
        throw new Error('Item name is required');
      }
      
      if (seasons.length === 0) {
        throw new Error('Please select at least one season');
      }
      
      // In a real app, we would upload the image to a server/cloud storage
      // and get back a URL. For this demo, we'll use the local preview or a placeholder
      const finalImageUrl = imageUrl || 'https://via.placeholder.com/300?text=No+Image';
      
      // Combine colors, making sure primaryColor is always first
      const colors = [primaryColor];
      if (secondaryColor) {
        colors.push(secondaryColor);
      }
      
      // Create metadata object with extended properties
      const metadata: Record<string, any> = {
        pattern,
        fabric,
        size,
        fit,
        brand: brand || undefined,
        condition,
        lastWornDate: lastWornDate ? new Date(lastWornDate) : undefined,
        occasions,
        primaryColor,
        secondaryColor: secondaryColor || undefined,
        // Generate style vector - this would be more sophisticated in a real app
        styleVector: {
          formality: style === ItemStyle.Formal ? 1.0 : style === ItemStyle.Business ? 0.8 : 0.3,
          casualness: style === ItemStyle.Casual ? 1.0 : style === ItemStyle.Streetwear ? 0.8 : 0.2,
          brightness: primaryColor.startsWith('#f') || primaryColor.startsWith('#e') ? 0.9 : 0.4,
          patternComplexity: pattern === Pattern.Solid ? 0.1 : pattern === Pattern.Graphic ? 0.9 : 0.5
        }
      };
      
      // Call addItem from WardrobeContext
      await addItem({
        name,
        category,
        subcategory,
        fabric: fabric.toString(),
        style,
        colors,
        imageUrl: finalImageUrl,
        isFavorite: false,
        season: seasons,
        metadata: metadata, // In a real app, we'd have to extend the types
      } as any); // Using any because we're extending the type
      
      // Handle success
      onItemAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-form" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Add New Item to Wardrobe</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Item Name*
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Category*
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              >
                {Object.values(ItemCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="subcategory" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Subcategory
              </label>
              <input
                id="subcategory"
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="E.g., T-Shirt, Jeans, Sneakers"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="primaryColor" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Primary Color*
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{ width: '50px', height: '30px' }}
                  required
                />
                <input 
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#000000"
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="secondaryColor" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Secondary Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor || '#ffffff'}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  style={{ width: '50px', height: '30px' }}
                />
                <input 
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#000000 (optional)"
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="pattern" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Pattern*
              </label>
              <select
                id="pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value as Pattern)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              >
                {Object.values(Pattern).map(pat => (
                  <option key={pat} value={pat}>{pat}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="fabric" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Fabric/Material*
              </label>
              <select
                id="fabric"
                value={fabric}
                onChange={(e) => setFabric(e.target.value as Fabric)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              >
                {Object.values(Fabric).map(fab => (
                  <option key={fab} value={fab}>{fab}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="size" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Size*
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  required
                >
                  <option value="">Select Size</option>
                  {Object.values(Size).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="numeric">Numeric Size</option>
                </select>
                {size === 'numeric' && (
                  <input
                    type="text"
                    placeholder="Enter numeric size"
                    onChange={(e) => setSize(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                )}
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="fit" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Fit Type*
              </label>
              <select
                id="fit"
                value={fit}
                onChange={(e) => setFit(e.target.value as Fit)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              >
                {Object.values(Fit).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="brand" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Brand
              </label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand name (optional)"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="style" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Style*
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as ItemStyle)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              >
                {Object.values(ItemStyle).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="condition" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Condition*
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              >
                {Object.values(Condition).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="lastWornDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Date Last Worn
              </label>
              <input
                id="lastWornDate"
                type="date"
                value={lastWornDate}
                onChange={(e) => setLastWornDate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          </div>
        </div>
        
        {/* Full Width Elements */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Season Suitability*
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.values(Season).map(season => (
              <label key={season} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={seasons.includes(season)}
                  onChange={() => handleSeasonToggle(season)}
                />
                {season}
              </label>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Occasions
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            {predefinedOccasions.map(occasion => (
              <label key={occasion} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={occasions.includes(occasion)}
                  onChange={() => handleOccasionToggle(occasion)}
                />
                {occasion}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
              placeholder="Add custom occasion"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button
              type="button"
              onClick={handleAddCustomOccasion}
              style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
            {occasions.map(occasion => (
              <span 
                key={occasion} 
                style={{ 
                  backgroundColor: '#e0f2fe', 
                  padding: '5px 10px', 
                  borderRadius: '20px', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {occasion}
                <button
                  type="button"
                  onClick={() => setOccasions(prev => prev.filter(o => o !== occasion))}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    cursor: 'pointer', 
                    fontSize: '14px',
                    color: '#4b5563',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '20px',
                    width: '20px'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="imageUpload" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Image Upload
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          {imageUrl && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={imageUrl}
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm; 