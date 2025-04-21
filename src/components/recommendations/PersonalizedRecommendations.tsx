import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWardrobe } from '../../context/WardrobeContext';
import { 
  determineColorSeason, 
  getColorPaletteForSeason, 
  getStyleRecommendations,
  ColorSeason,
  ColorPalette,
  StyleRecommendation,
} from '../../utils/appearanceUtils';

const PersonalizedRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { wardrobeItems } = useWardrobe();
  
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const [styleRecs, setStyleRecs] = useState<StyleRecommendation | null>(null);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [showMeasurementsForm, setShowMeasurementsForm] = useState(false);
  
  // Form state for body measurements
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [measurements, setMeasurements] = useState<Record<string, number>>({
    bust: 0,
    waist: 0,
    hips: 0,
    shoulders: 0,
    inseam: 0
  });
  
  useEffect(() => {
    if (user) {
      // Get color season based on user's physical attributes
      const season = determineColorSeason(
        user.skinTone,
        user.hairColor,
        user.eyeColor
      );
      
      // Get color palette based on season
      const palette = getColorPaletteForSeason(season);
      setColorPalette(palette);
    }
  }, [user]);
  
  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setMeasurements(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };
  
  const handleSubmitMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      setLoadingMeasurements(true);
      
      // Get style recommendations based on measurements
      const recommendations = getStyleRecommendations(
        user.gender,
        height,
        weight,
        measurements
      );
      
      setStyleRecs(recommendations);
      setLoadingMeasurements(false);
      setShowMeasurementsForm(false);
    }
  };
  
  const getWardrobeItemsByColors = (colors: string[], limit: number = 5) => {
    // Get wardrobe items that match or are close to the recommended colors
    if (!wardrobeItems.length) return [];
    
    // This is a very simple implementation - a real one would use color distance
    return wardrobeItems
      .filter(item => 
        item.colors.some(itemColor => 
          colors.some(color => itemColor.toLowerCase().includes(color.replace('#', '').toLowerCase()))
        )
      )
      .slice(0, limit);
  };
  
  if (!user) {
    return <div>Please log in to see personalized recommendations</div>;
  }
  
  return (
    <div className="personalized-recommendations" style={{ padding: '20px' }}>
      <h2>Your Personalized Style Recommendations</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Color Analysis Section */}
        <section style={{ 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3>Color Analysis</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p>Based on your physical traits:</p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Skin Tone: {user.skinTone}</li>
              <li>Hair Color: {user.hairColor}</li>
              <li>Eye Color: {user.eyeColor}</li>
            </ul>
          </div>
          
          {colorPalette && (
            <div>
              <h4>Your Color Season: {colorPalette.season.charAt(0).toUpperCase() + colorPalette.season.slice(1)}</h4>
              
              <div style={{ marginTop: '15px' }}>
                <h5>Recommended Primary Colors</h5>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {colorPalette.primaryColors.map((color, index) => (
                    <div 
                      key={index}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        position: 'relative'
                      }}
                      title={color}
                    >
                      <span style={{ 
                        position: 'absolute', 
                        bottom: '-20px', 
                        left: '0', 
                        fontSize: '10px',
                        width: '40px',
                        textAlign: 'center'
                      }}>
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: '30px' }}>
                <h5>Recommended Neutral Colors</h5>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {colorPalette.neutralColors.map((color, index) => (
                    <div 
                      key={index}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        position: 'relative'
                      }}
                      title={color}
                    >
                      <span style={{ 
                        position: 'absolute', 
                        bottom: '-20px', 
                        left: '0', 
                        fontSize: '10px',
                        width: '40px',
                        textAlign: 'center'
                      }}>
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: '30px' }}>
                <h5>Accent Colors</h5>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {colorPalette.accentColors.map((color, index) => (
                    <div 
                      key={index}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        position: 'relative'
                      }}
                      title={color}
                    >
                      <span style={{ 
                        position: 'absolute', 
                        bottom: '-20px', 
                        left: '0', 
                        fontSize: '10px',
                        width: '40px',
                        textAlign: 'center'
                      }}>
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: '40px' }}>
                <h5>Items in Your Wardrobe That Match Your Color Palette</h5>
                <div style={{ marginTop: '10px' }}>
                  {wardrobeItems.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                      {getWardrobeItemsByColors([...colorPalette.primaryColors, ...colorPalette.accentColors]).map(item => (
                        <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                            />
                          )}
                          <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                          <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
                            {item.colors.map((color, index) => (
                              <span 
                                key={index} 
                                style={{ 
                                  display: 'inline-block', 
                                  width: '15px', 
                                  height: '15px', 
                                  backgroundColor: color,
                                  borderRadius: '50%',
                                  border: '1px solid #ddd'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Add items to your wardrobe to see what matches your color palette!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Style Analysis Section */}
        <section style={{ 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3>Body Type & Style Analysis</h3>
          
          {styleRecs ? (
            <div>
              <h4>Your Body Type: {styleRecs.bodyType}</h4>
              
              <div style={{ marginTop: '15px' }}>
                <h5>Recommended Styles</h5>
                <ul style={{ marginLeft: '20px' }}>
                  {styleRecs.recommendedStyles.map((style, index) => (
                    <li key={index}>{style}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <h5>Styles to Avoid</h5>
                <ul style={{ marginLeft: '20px' }}>
                  {styleRecs.avoidStyles.map((style, index) => (
                    <li key={index}>{style}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <h5>Features to Accent</h5>
                <ul style={{ marginLeft: '20px' }}>
                  {styleRecs.accentFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => setShowMeasurementsForm(true)}
                style={{ 
                  marginTop: '20px',
                  padding: '8px 16px', 
                  backgroundColor: '#f3f4f6', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Update Measurements
              </button>
            </div>
          ) : (
            <div>
              {showMeasurementsForm ? (
                <form onSubmit={handleSubmitMeasurements}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Height (cm)</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Weight (kg)</label>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h5>Body Measurements (cm)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Bust/Chest</label>
                        <input 
                          type="number" 
                          value={measurements.bust || ''}
                          onChange={(e) => handleMeasurementChange('bust', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Waist</label>
                        <input 
                          type="number" 
                          value={measurements.waist || ''}
                          onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Hips</label>
                        <input 
                          type="number" 
                          value={measurements.hips || ''}
                          onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Shoulders</label>
                        <input 
                          type="number" 
                          value={measurements.shoulders || ''}
                          onChange={(e) => handleMeasurementChange('shoulders', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Inseam</label>
                        <input 
                          type="number" 
                          value={measurements.inseam || ''}
                          onChange={(e) => handleMeasurementChange('inseam', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowMeasurementsForm(false)}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#f3f4f6', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loadingMeasurements}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: loadingMeasurements ? 'not-allowed' : 'pointer',
                        opacity: loadingMeasurements ? 0.7 : 1
                      }}
                    >
                      {loadingMeasurements ? 'Analyzing...' : 'Submit'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p>We need your body measurements to provide personalized style recommendations.</p>
                  <button 
                    onClick={() => setShowMeasurementsForm(true)}
                    style={{ 
                      marginTop: '10px',
                      padding: '8px 16px', 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Add Measurements
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Fashion Tips Section */}
        <section style={{ 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3>Personalized Fashion Tips</h3>
          
          <div style={{ marginTop: '10px' }}>
            <h4>Building a Capsule Wardrobe</h4>
            <p>Based on your color season and style preferences, here are key pieces to consider:</p>
            
            <ul style={{ marginLeft: '20px' }}>
              <li>Start with neutrals from your color palette as base pieces</li>
              <li>Add 2-3 items in your primary colors for statement pieces</li>
              <li>Include versatile pieces that can be dressed up or down</li>
              <li>Focus on quality over quantity</li>
              <li>Ensure each piece can be matched with at least 3 others</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Fashion Influencers With Your Color Season</h4>
            <p>Follow these influencers for inspiration that matches your color palette:</p>
            
            <ul style={{ marginLeft: '20px' }}>
              {colorPalette?.season === ColorSeason.Spring && (
                <>
                  <li>Emma Stone</li>
                  <li>Nicole Kidman</li>
                  <li>Bella Hadid</li>
                </>
              )}
              
              {colorPalette?.season === ColorSeason.Summer && (
                <>
                  <li>Taylor Swift</li>
                  <li>Jennifer Aniston</li>
                  <li>Dakota Johnson</li>
                </>
              )}
              
              {colorPalette?.season === ColorSeason.Autumn && (
                <>
                  <li>Jennifer Lopez</li>
                  <li>Drew Barrymore</li>
                  <li>Jessica Alba</li>
                </>
              )}
              
              {colorPalette?.season === ColorSeason.Winter && (
                <>
                  <li>Anne Hathaway</li>
                  <li>Kim Kardashian</li>
                  <li>Lupita Nyong'o</li>
                </>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations; 