import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Outfit, Season, ItemStyle } from '../types';

const Outfits: React.FC = () => {
  const { outfits, loading, error, deleteOutfit, toggleOutfitPublic } = useWardrobe();
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [filterStyle, setFilterStyle] = useState<string>('all');

  const handleTogglePublic = async (id: string) => {
    try {
      await toggleOutfitPublic(id);
    } catch (err) {
      console.error('Failed to toggle public status', err);
    }
  };

  const handleDeleteOutfit = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        await deleteOutfit(id);
      } catch (err) {
        console.error('Failed to delete outfit', err);
      }
    }
  };

  // Filter outfits based on selected filters
  const filteredOutfits = outfits.filter(outfit => {
    // Filter by season
    if (filterSeason !== 'all') {
      if (!outfit.season.includes(filterSeason as Season)) {
        return false;
      }
    }
    
    // Filter by style
    if (filterStyle !== 'all' && outfit.style !== filterStyle) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return <div>Loading your outfits...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>My Outfits</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Season:</label>
          <select 
            value={filterSeason} 
            onChange={(e) => setFilterSeason(e.target.value)}
          >
            <option value="all">All Seasons</option>
            {Object.values(Season).map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ marginRight: '10px' }}>Style:</label>
          <select 
            value={filterStyle} 
            onChange={(e) => setFilterStyle(e.target.value)}
          >
            <option value="all">All Styles</option>
            {Object.values(ItemStyle).map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <button>Create New Outfit</button>
      </div>
      
      {filteredOutfits.length === 0 ? (
        <div>No outfits found. Try changing your filters or create some outfits.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredOutfits.map(outfit => (
            <div key={outfit.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
              <h3>{outfit.name}</h3>
              {outfit.description && <p>{outfit.description}</p>}
              
              <div>
                <h4>Items:</h4>
                <ul style={{ listStyle: 'none', padding: '0' }}>
                  {outfit.items.map(item => (
                    <li key={item.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                        />
                      )}
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <p>Style: {outfit.style}</p>
                <p>Occasion: {outfit.occasion || 'Not specified'}</p>
                <p>Seasons: {outfit.season.join(', ')}</p>
                <p>Likes: {outfit.likes}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button onClick={() => handleTogglePublic(outfit.id)}>
                  {outfit.isPublic ? 'Make Private' : 'Make Public'}
                </button>
                <button onClick={() => handleDeleteOutfit(outfit.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Outfits; 