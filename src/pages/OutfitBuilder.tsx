import React, { useState, useEffect } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { WardrobeItem, ItemCategory, Season, ItemStyle, Outfit } from '../types';

const OutfitBuilder: React.FC = () => {
  const { wardrobeItems, loading, error, addOutfit } = useWardrobe();
  
  // State for the outfit being created
  const [outfitName, setOutfitName] = useState('');
  const [outfitDescription, setOutfitDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ItemStyle>(ItemStyle.Casual);
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  // State for selected items by category
  const [selectedItems, setSelectedItems] = useState<{[key: string]: WardrobeItem | null}>({
    [ItemCategory.Top]: null,
    [ItemCategory.Bottom]: null,
    [ItemCategory.Footwear]: null,
    [ItemCategory.Outerwear]: null,
    [ItemCategory.Accessory]: null,
  });
  
  // State for filtered items
  const [filteredItems, setFilteredItems] = useState<{[key: string]: WardrobeItem[]}>({
    [ItemCategory.Top]: [],
    [ItemCategory.Bottom]: [],
    [ItemCategory.Footwear]: [],
    [ItemCategory.Outerwear]: [],
    [ItemCategory.Accessory]: [],
  });
  
  // Current category being viewed
  const [currentCategory, setCurrentCategory] = useState<ItemCategory>(ItemCategory.Top);
  
  // Error message for form validation
  const [formError, setFormError] = useState('');
  
  // Filter wardrobe items by category
  useEffect(() => {
    if (wardrobeItems.length > 0) {
      const categorizedItems: {[key: string]: WardrobeItem[]} = {
        [ItemCategory.Top]: [],
        [ItemCategory.Bottom]: [],
        [ItemCategory.Footwear]: [],
        [ItemCategory.Outerwear]: [],
        [ItemCategory.Accessory]: [],
      };
      
      wardrobeItems.forEach(item => {
        if (categorizedItems[item.category]) {
          categorizedItems[item.category].push(item);
        }
      });
      
      setFilteredItems(categorizedItems);
    }
  }, [wardrobeItems]);
  
  // Handle item selection
  const handleSelectItem = (item: WardrobeItem) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.category]: item
    }));
  };
  
  // Handle season selection
  const handleSeasonToggle = (season: Season) => {
    setSelectedSeasons(prev => 
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!outfitName.trim()) {
      setFormError('Please provide a name for your outfit');
      return;
    }
    
    if (selectedSeasons.length === 0) {
      setFormError('Please select at least one season');
      return;
    }
    
    // Collect selected items
    const outfitItems: WardrobeItem[] = Object.values(selectedItems).filter(
      (item): item is WardrobeItem => item !== null
    );
    
    if (outfitItems.length < 2) {
      setFormError('Please select at least 2 items for your outfit');
      return;
    }
    
    try {
      // Create the outfit
      await addOutfit({
        name: outfitName,
        description: outfitDescription,
        items: outfitItems,
        style: selectedStyle,
        season: selectedSeasons,
        occasion: selectedOccasion,
        isPublic,
      });
      
      // Reset form after submission
      setOutfitName('');
      setOutfitDescription('');
      setSelectedStyle(ItemStyle.Casual);
      setSelectedSeasons([]);
      setSelectedOccasion('');
      setIsPublic(false);
      setSelectedItems({
        [ItemCategory.Top]: null,
        [ItemCategory.Bottom]: null,
        [ItemCategory.Footwear]: null,
        [ItemCategory.Outerwear]: null,
        [ItemCategory.Accessory]: null,
      });
      setFormError('');
      
      alert('Outfit created successfully!');
    } catch (err) {
      setFormError('Failed to create outfit. Please try again.');
      console.error('Failed to create outfit:', err);
    }
  };
  
  if (loading) {
    return <div>Loading your wardrobe items...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="outfit-builder">
      <h1>Create a New Outfit</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        {/* Outfit Preview */}
        <div style={{ flex: '1', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2>Outfit Preview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(selectedItems).map(([category, item]) => (
              <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '120px', fontWeight: 'bold' }}>{category}:</div>
                {item ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                    <span>{item.name}</span>
                    <button 
                      onClick={() => setSelectedItems(prev => ({...prev, [category]: null}))}
                      style={{ marginLeft: 'auto' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>No item selected</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Outfit Form */}
        <div style={{ flex: '1', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2>Outfit Details</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="outfitName" style={{ display: 'block', marginBottom: '5px' }}>Name *</label>
              <input
                id="outfitName"
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="Enter outfit name"
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="outfitDescription" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea
                id="outfitDescription"
                value={outfitDescription}
                onChange={(e) => setOutfitDescription(e.target.value)}
                placeholder="Add a description for your outfit"
                rows={3}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="outfitStyle" style={{ display: 'block', marginBottom: '5px' }}>Style *</label>
              <select
                id="outfitStyle"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as ItemStyle)}
                required
              >
                {Object.values(ItemStyle).map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Seasons *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.values(Season).map(season => (
                  <label key={season} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={selectedSeasons.includes(season)}
                      onChange={() => handleSeasonToggle(season)}
                    />
                    {season}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="occasion" style={{ display: 'block', marginBottom: '5px' }}>Occasion</label>
              <input
                id="occasion"
                type="text"
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                placeholder="e.g., Work, Casual, Party"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make this outfit public
              </label>
            </div>
            
            {formError && (
              <div style={{ color: 'red', marginBottom: '15px' }}>{formError}</div>
            )}
            
            <button 
              type="submit" 
              disabled={Object.values(selectedItems).filter(Boolean).length < 2}
              style={{
                padding: '10px 20px',
                backgroundColor: Object.values(selectedItems).filter(Boolean).length < 2 ? '#ccc' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: Object.values(selectedItems).filter(Boolean).length < 2 ? 'not-allowed' : 'pointer'
              }}
            >
              Create Outfit
            </button>
          </form>
        </div>
      </div>
      
      {/* Item Selection */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <h2>Select Items</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {Object.values(ItemCategory).map(category => (
            <button
              key={category}
              onClick={() => setCurrentCategory(category as ItemCategory)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentCategory === category ? '#3b82f6' : '#f3f4f6',
                color: currentCategory === category ? 'white' : 'black',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {filteredItems[currentCategory]?.length > 0 ? (
            filteredItems[currentCategory].map(item => (
              <div 
                key={item.id} 
                onClick={() => handleSelectItem(item)}
                style={{ 
                  border: selectedItems[item.category]?.id === item.id ? '2px solid #3b82f6' : '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  cursor: 'pointer'
                }}
              >
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                  />
                )}
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div>Style: {item.style}</div>
                <div>Colors: 
                  <span style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    {item.colors.map((color, index) => (
                      <span 
                        key={index} 
                        style={{ 
                          display: 'inline-block', 
                          width: '20px', 
                          height: '20px', 
                          backgroundColor: color,
                          borderRadius: '50%',
                          border: '1px solid #ddd'
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div>No items found in this category. Please add some to your wardrobe first.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitBuilder; 