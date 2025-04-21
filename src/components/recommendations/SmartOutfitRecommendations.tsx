import React, { useState, useEffect } from 'react';
import { useWardrobe } from '../../context/WardrobeContext';
import { useRecommendation } from '../../context/RecommendationContext';
import { WardrobeItem, OutfitRecommendation, ItemCategory, Season } from '../../types';
import { determineColorSeason, getColorPaletteForSeason, ColorHarmony, getColorHarmony, generateColorMatches } from '../../utils/appearanceUtils';
import { useAuth } from '../../context/AuthContext';
import SaveRecommendation from './SaveRecommendation';

// Define weather type
interface WeatherData {
  temperature: number;
  conditions: string;
  icon: string;
  location: string;
}

// Mock weather API function
const fetchWeather = async (location: string): Promise<WeatherData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data based on location keywords
  if (location.toLowerCase().includes('london')) {
    return {
      temperature: 15,
      conditions: 'Rain',
      icon: '🌧️',
      location: 'London, UK'
    };
  } else if (location.toLowerCase().includes('new york')) {
    return {
      temperature: 20,
      conditions: 'Partly Cloudy',
      icon: '⛅',
      location: 'New York, USA'
    };
  } else if (location.toLowerCase().includes('tokyo')) {
    return {
      temperature: 25,
      conditions: 'Sunny',
      icon: '☀️',
      location: 'Tokyo, Japan'
    };
  } else if (location.toLowerCase().includes('sydney')) {
    return {
      temperature: 30,
      conditions: 'Hot',
      icon: '🔥',
      location: 'Sydney, Australia'
    };
  } else if (location.toLowerCase().includes('moscow')) {
    return {
      temperature: 0,
      conditions: 'Snow',
      icon: '❄️',
      location: 'Moscow, Russia'
    };
  }
  
  // Default weather
  return {
    temperature: 22,
    conditions: 'Clear',
    icon: '☀️',
    location: location || 'Your Location'
  };
};

// Event types
enum EventType {
  Casual = "casual",
  Work = "work",
  Formal = "formal",
  Date = "date",
  Interview = "interview",
  Wedding = "wedding",
  Sport = "sport",
  Beach = "beach",
  Party = "party",
  Travel = "travel"
}

const SmartOutfitRecommendations: React.FC = () => {
  const { wardrobeItems } = useWardrobe();
  const { generateRecommendations, getRecommendationsForOccasion } = useRecommendation();
  const { user } = useAuth();
  
  // State
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<OutfitRecommendation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  
  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('');
  const [fetchingWeather, setFetchingWeather] = useState(false);
  
  // Mode state
  const [mode, setMode] = useState<'full' | 'gap' | 'event' | 'weather'>('full');
  
  // Missing items state
  const [missingItems, setMissingItems] = useState<ItemCategory[]>([]);
  
  // Selected recommendation for display
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  // Fetch initial recommendations on load
  useEffect(() => {
    if (wardrobeItems.length >= 3) {
      handleGenerateRecommendations();
    }
  }, [wardrobeItems]);
  
  // Generate basic outfit recommendations
  const handleGenerateRecommendations = async () => {
    if (wardrobeItems.length < 3) {
      setError('You need at least 3 items in your wardrobe for recommendations');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const recs = await generateRecommendations(5);
      setRecommendations(recs);
      setMode('full');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate recommendations for a specific event
  const handleEventRecommendations = async (event: string) => {
    if (wardrobeItems.length < 3) {
      setError('You need at least 3 items in your wardrobe for recommendations');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSelectedEvent(event);
      
      const recs = await getRecommendationsForOccasion(event, 5);
      setRecommendations(recs);
      setMode('event');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate recommendations based on weather
  const handleWeatherRecommendations = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }
    
    try {
      setFetchingWeather(true);
      setError('');
      
      // Fetch weather data
      const weatherData = await fetchWeather(location);
      setWeather(weatherData);
      
      // Filter items appropriate for the weather
      let seasonFilter: Season;
      if (weatherData.temperature < 5) {
        seasonFilter = Season.Winter;
      } else if (weatherData.temperature < 15) {
        seasonFilter = Season.Fall;
      } else if (weatherData.temperature < 25) {
        seasonFilter = Season.Spring;
      } else {
        seasonFilter = Season.Summer;
      }
      
      // Use existing recommendation engine with filtered items
      const weatherItems = wardrobeItems.filter(item => 
        item.season.includes(seasonFilter) || item.season.includes(Season.AllYear)
      );
      
      if (weatherItems.length < 3) {
        setError(`Not enough items in your wardrobe for ${seasonFilter} weather`);
        return;
      }
      
      // Generate generic recommendations but adjust display text
      const recs = await generateRecommendations(3);
      
      // Modify recommendation names for weather
      const weatherRecs = recs.map(rec => ({
        ...rec,
        name: `${weatherData.conditions} Day (${weatherData.temperature}°C) - ${rec.name}`
      }));
      
      setRecommendations(weatherRecs);
      setMode('weather');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate weather recommendations');
    } finally {
      setFetchingWeather(false);
      setLoading(false);
    }
  };
  
  // Generate recommendations to complete an outfit with a base item
  const handleGapRecommendations = async () => {
    if (!selectedItem) {
      setError('Please select a base item first');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Identify what categories we need based on the selected item
      const neededCategories = Object.values(ItemCategory).filter(
        category => category !== selectedItem.category
      );
      
      // Get current season for more appropriate recommendations
      const currentMonth = new Date().getMonth();
      let currentSeason = Season.Spring;
      if (currentMonth >= 2 && currentMonth <= 4) currentSeason = Season.Spring;
      else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = Season.Summer;
      else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = Season.Fall;
      else currentSeason = Season.Winter;
      
      // Filter items by season and needed categories
      const filteredItems = wardrobeItems.filter(item => 
        item.id !== selectedItem.id && 
        neededCategories.includes(item.category as ItemCategory) &&
        (item.season.includes(currentSeason) || item.season.includes(Season.AllYear))
      );
      
      // Find color matches based on the selected item's primary color
      const itemColorMatches = generateColorMatches(
        selectedItem.colors[0],
        filteredItems.flatMap(item => item.colors),
        ColorHarmony.Complementary
      );
      
      // Group filtered items by category
      const itemsByCategory: Record<string, WardrobeItem[]> = {};
      neededCategories.forEach(category => {
        itemsByCategory[category] = filteredItems.filter(item => item.category === category)
          // Prioritize items that match the color scheme
          .sort((a, b) => {
            const aHasMatch = a.colors.some(color => itemColorMatches.includes(color));
            const bHasMatch = b.colors.some(color => itemColorMatches.includes(color));
            if (aHasMatch && !bHasMatch) return -1;
            if (!aHasMatch && bHasMatch) return 1;
            return 0;
          });
      });
      
      // Create recommendations (up to 3)
      const gapRecs: OutfitRecommendation[] = [];
      
      // Generate 3 outfit variations if possible
      for (let i = 0; i < 3; i++) {
        const outfitItems: WardrobeItem[] = [selectedItem];
        let missingCategories: ItemCategory[] = [];
        
        // Try to include at least one item from each needed category
        neededCategories.forEach(category => {
          const categoryItems = itemsByCategory[category];
          if (categoryItems && categoryItems.length > i) {
            outfitItems.push(categoryItems[i]);
          } else {
            missingCategories.push(category as ItemCategory);
          }
        });
        
        if (outfitItems.length > 1) {
          gapRecs.push({
            id: `gap-rec-${i}`,
            name: `Outfit with ${selectedItem.name}`,
            items: outfitItems,
            missingItems: missingCategories.map(category => ({
              category,
              subcategory: undefined,
              description: `Add a ${category} to complete this outfit`,
              colors: [],
              imageUrl: undefined
            })),
            occasion: selectedItem.style,
            confidence: 0.8 - (i * 0.1) // Decrease confidence for each successive recommendation
          });
        }
      }
      
      setMissingItems(neededCategories.filter(category => 
        !gapRecs[0]?.items.some(item => item.category === category)
      ) as ItemCategory[]);
      
      setRecommendations(gapRecs);
      setMode('gap');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate gap recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveComplete = () => {
    setSelectedRecommendation(null);
  };
  
  return (
    <div className="smart-outfit-recommendations" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Smart Outfit Recommendations</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleGenerateRecommendations}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: mode === 'full' ? '#3b82f6' : '#f3f4f6',
            color: mode === 'full' ? 'white' : 'black',
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Full Look Generator
        </button>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setMode('gap')}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: mode === 'gap' ? '#3b82f6' : '#f3f4f6',
              color: mode === 'gap' ? 'white' : 'black',
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Fill the Gaps
          </button>
        </div>
        
        <button 
          onClick={() => setMode('event')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: mode === 'event' ? '#3b82f6' : '#f3f4f6',
            color: mode === 'event' ? 'white' : 'black',
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Event-Based Suggestions
        </button>
        
        <button 
          onClick={() => setMode('weather')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: mode === 'weather' ? '#3b82f6' : '#f3f4f6',
            color: mode === 'weather' ? 'white' : 'black',
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Weather-Aware Suggestions
        </button>
      </div>
      
      {/* Fill the Gaps Mode */}
      {mode === 'gap' && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Select a base item to build around</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <select
                value={selectedItem?.id || ''}
                onChange={(e) => {
                  const item = wardrobeItems.find(item => item.id === e.target.value);
                  setSelectedItem(item || null);
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">Select an item</option>
                {wardrobeItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedItem && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectedItem.imageUrl && (
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>{selectedItem.name}</div>
                  <div>{selectedItem.category} - {selectedItem.style}</div>
                </div>
                
                <button 
                  onClick={handleGapRecommendations}
                  style={{ 
                    marginLeft: 'auto', 
                    padding: '8px 16px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Build Outfit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Event Mode */}
      {mode === 'event' && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Select an Event</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            {Object.values(EventType).map(event => (
              <button
                key={event}
                onClick={() => handleEventRecommendations(event)}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: selectedEvent === event ? '#3b82f6' : '#f3f4f6',
                  color: selectedEvent === event ? 'white' : 'black',
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                {event.charAt(0).toUpperCase() + event.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Weather Mode */}
      {mode === 'weather' && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Weather-Based Recommendations</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (e.g., London, New York, Tokyo)"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button
              onClick={handleWeatherRecommendations}
              disabled={fetchingWeather}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: fetchingWeather ? 'not-allowed' : 'pointer',
                opacity: fetchingWeather ? 0.7 : 1
              }}
            >
              {fetchingWeather ? 'Loading...' : 'Get Weather'}
            </button>
          </div>
          
          {weather && (
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ fontSize: '32px' }}>{weather.icon}</div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{weather.location}</div>
                <div>{weather.temperature}°C, {weather.conditions}</div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
      )}
      
      {loading ? (
        <div>Generating outfit recommendations...</div>
      ) : (
        recommendations.length > 0 ? (
          <div>
            <h3>Recommended Outfits</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {recommendations.map((recommendation, index) => (
                <div 
                  key={index} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    transform: hoveredCardIndex === index ? 'translateY(-5px)' : 'translateY(0)',
                    boxShadow: hoveredCardIndex === index ? '0 10px 15px rgba(0,0,0,0.1)' : 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onClick={() => setSelectedRecommendation(recommendation)}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                >
                  <h4 style={{ margin: '0 0 10px 0' }}>{recommendation.name}</h4>
                  
                  {recommendation.occasion && (
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                      <strong>Occasion:</strong> {recommendation.occasion}
                    </p>
                  )}
                  
                  <div>
                    <strong>Items:</strong>
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                      {recommendation.items.map((item, itemIndex) => (
                        <li key={itemIndex} style={{ marginBottom: '5px' }}>
                          <span>{item.name} ({item.category})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {recommendation.missingItems && recommendation.missingItems.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Missing Items:</strong>
                      <ul style={{ paddingLeft: '20px', margin: '5px 0', color: '#f59e0b' }}>
                        {recommendation.missingItems.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.description || item.category}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    <span style={{ color: recommendation.confidence > 0.7 ? 'green' : recommendation.confidence > 0.4 ? 'orange' : 'red' }}>
                      Match Score: {Math.round(recommendation.confidence * 100)}%
                    </span>
                  </div>
                  
                  <button 
                    style={{ 
                      marginTop: '15px',
                      padding: '8px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Save Outfit
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No outfit recommendations available yet.</div>
        )
      )}
      
      {selectedRecommendation && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'auto', maxHeight: '90vh', width: '90%', maxWidth: '500px' }}>
            <SaveRecommendation 
              recommendation={selectedRecommendation} 
              onSaved={handleSaveComplete} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartOutfitRecommendations; 