import React, { useState, useEffect } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { WardrobeItem, ItemCategory, Season } from '../types';
import AddItemForm from '../components/wardrobe/AddItemForm';

const Wardrobe: React.FC = () => {
  const { wardrobeItems, loading, error, toggleFavorite, deleteItem } = useWardrobe();
  const [filteredItems, setFilteredItems] = useState<WardrobeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    let items = [...wardrobeItems];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // Filter by season
    if (selectedSeason !== 'all') {
      items = items.filter(item => 
        item.season.includes(selectedSeason as Season) || 
        item.season.includes(Season.AllYear)
      );
    }
    
    setFilteredItems(items);
  }, [wardrobeItems, selectedCategory, selectedSeason]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
    } catch (err) {
      console.error('Failed to toggle favorite status', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        console.error('Failed to delete item', err);
      }
    }
  };

  const handleItemAdded = () => {
    setShowAddForm(false);
  };

  if (loading) {
    return <div>Loading your wardrobe...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>My Wardrobe</h1>
      
      {showAddForm ? (
        <AddItemForm onItemAdded={handleItemAdded} onCancel={() => setShowAddForm(false)} />
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ marginRight: '10px' }}>Category:</label>
              <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="all">All Categories</option>
                {Object.values(ItemCategory).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ marginRight: '10px' }}>Season:</label>
              <select value={selectedSeason} onChange={handleSeasonChange}>
                <option value="all">All Seasons</option>
                {Object.values(Season).map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Add New Item
            </button>
          </div>
          
          {filteredItems.length === 0 ? (
            <div>No items found. Try changing your filters or add some items to your wardrobe.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {filteredItems.map(item => (
                <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                  <h3 style={{ marginTop: '10px' }}>{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Style: {item.style}</p>
                  <p>
                    Colors: 
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
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button onClick={() => handleToggleFavorite(item.id)}>
                      {item.isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Wardrobe; 