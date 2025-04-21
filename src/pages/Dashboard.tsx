import React from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { WardrobeItem, Outfit } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { wardrobeItems, outfits, loading, error } = useWardrobe();
  
  if (loading) {
    return <div>Loading your dashboard...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  // Group items by category for display
  const itemsByCategory: Record<string, WardrobeItem[]> = {};
  wardrobeItems.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });
  
  // Get favorites
  const favoriteItems = wardrobeItems.filter(item => item.isFavorite);
  
  // Get recent outfits (just the latest 3)
  const recentOutfits = [...outfits].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
      </div>
      
      {/* Wardrobe Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f9fafb' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Total Items</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{wardrobeItems.length}</p>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f9fafb' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Outfits</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{outfits.length}</p>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f9fafb' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Favorites</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{favoriteItems.length}</p>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f9fafb' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Categories</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{Object.keys(itemsByCategory).length}</p>
        </div>
      </div>
      
      {/* Recommendations Link Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          backgroundColor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '15px' }}>Outfit Recommendations</h2>
          <p style={{ marginBottom: '20px' }}>Get personalized outfit suggestions based on your wardrobe items, weather conditions, and upcoming events.</p>
          <Link 
            to="/recommendations" 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            View Outfit Recommendations
          </Link>
        </div>
      </div>
      
      {/* Recent Outfits */}
      {recentOutfits.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Recent Outfits</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {recentOutfits.map(outfit => (
              <div key={outfit.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                <h3>{outfit.name}</h3>
                <p>{outfit.description || 'No description'}</p>
                <div>
                  <strong>Items:</strong>
                  <ul style={{ paddingLeft: '20px' }}>
                    {outfit.items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Favorites */}
      {favoriteItems.length > 0 && (
        <div>
          <h2>Favorite Items</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {favoriteItems.slice(0, 4).map(item => (
              <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                  />
                )}
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div>{item.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 