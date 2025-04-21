import React, { useEffect, useState } from 'react';
import { useWardrobe } from '../../context/WardrobeContext';
import { WardrobeItem, OutfitRecommendation, Season, ItemCategory } from '../../types';
import SaveRecommendation from './SaveRecommendation';
import './weatherRecommendations.css'; // Import CSS file for styles

type WeatherData = {
  temperature: number; 
  conditions: string; // sunny, rainy, snowy, cloudy, etc.
  humidity: number;
};

// Extended OutfitRecommendation with weather data
interface WeatherOutfitRecommendation extends OutfitRecommendation {
  weatherConditions: string;
  temperature: number;
}

// Mock weather API call
const fetchWeather = async (location: string): Promise<WeatherData> => {
  // In a real app, this would call a weather API with the location
  // For demo purposes, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  
  // Mock different weather conditions based on location text
  if (location.toLowerCase().includes('rain')) {
    return { temperature: 15, conditions: 'rainy', humidity: 85 };
  } else if (location.toLowerCase().includes('snow')) {
    return { temperature: -2, conditions: 'snowy', humidity: 70 };
  } else if (location.toLowerCase().includes('hot')) {
    return { temperature: 30, conditions: 'sunny', humidity: 50 };
  } else if (location.toLowerCase().includes('cold')) {
    return { temperature: 5, conditions: 'cloudy', humidity: 60 };
  }
  
  // Default weather
  return { temperature: 22, conditions: 'sunny', humidity: 45 };
};

const WeatherBasedRecommendations: React.FC = () => {
  const { wardrobeItems } = useWardrobe();
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<WeatherOutfitRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<WeatherOutfitRecommendation | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const weatherData = await fetchWeather(location);
      setWeather(weatherData);
      generateRecommendations(weatherData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const generateRecommendations = (weatherData: WeatherData) => {
    // Determine appropriate season based on temperature and conditions
    let targetSeason: Season;
    if (weatherData.temperature > 25) {
      targetSeason = Season.Summer;
    } else if (weatherData.temperature > 15) {
      targetSeason = Season.Spring;
    } else if (weatherData.temperature > 5) {
      targetSeason = Season.Fall;
    } else {
      targetSeason = Season.Winter;
    }
    
    // Filter items by the determined season
    const seasonalItems = wardrobeItems.filter(item => 
      item.season?.includes(targetSeason)
    );
    
    // Create recommendations based on the weather
    const newRecommendations: WeatherOutfitRecommendation[] = [];
    
    if (weatherData.conditions === 'rainy') {
      // Rainy day outfit
      const rainOutfit = createOutfit(
        seasonalItems,
        'Rainy Day Outfit',
        'Stay dry and stylish in the rain',
        'Rainy day',
        weatherData
      );
      if (rainOutfit) newRecommendations.push(rainOutfit);
    }
    
    if (weatherData.temperature < 10) {
      // Cold weather outfit
      const coldOutfit = createOutfit(
        seasonalItems,
        'Cold Weather Ensemble',
        'Stay warm and cozy',
        'Cold day',
        weatherData
      );
      if (coldOutfit) newRecommendations.push(coldOutfit);
    }
    
    if (weatherData.temperature > 25) {
      // Hot weather outfit
      const hotOutfit = createOutfit(
        seasonalItems,
        'Hot Weather Outfit',
        'Stay cool and comfortable',
        'Hot day',
        weatherData
      );
      if (hotOutfit) newRecommendations.push(hotOutfit);
    }
    
    // Add a general weather-appropriate outfit
    const generalOutfit = createOutfit(
      seasonalItems,
      `${weatherData.conditions.charAt(0).toUpperCase() + weatherData.conditions.slice(1)} Day Outfit`,
      `Perfect for ${weatherData.temperature}°C ${weatherData.conditions} weather`,
      'Everyday',
      weatherData
    );
    if (generalOutfit) newRecommendations.push(generalOutfit);
    
    setRecommendations(newRecommendations);
  };
  
  const createOutfit = (
    items: WardrobeItem[], 
    name: string, 
    description: string,
    occasion: string,
    weather: WeatherData
  ): WeatherOutfitRecommendation | null => {
    // Select items by category to create a complete outfit
    const tops = items.filter(item => item.category === ItemCategory.Top);
    const bottoms = items.filter(item => item.category === ItemCategory.Bottom);
    const shoes = items.filter(item => item.category === ItemCategory.Footwear);
    const outerwear = items.filter(item => item.category === ItemCategory.Outerwear);
    const accessories = items.filter(item => item.category === ItemCategory.Accessory);
    
    // Simple logic to select items based on weather
    let selectedItems: WardrobeItem[] = [];
    
    // Add a top
    if (tops.length > 0) {
      // For hot weather, prefer short sleeves (in a real app, check subcategory)
      const topIndex = Math.floor(Math.random() * tops.length);
      selectedItems.push(tops[topIndex]);
    }
    
    // Add bottoms
    if (bottoms.length > 0) {
      const bottomIndex = Math.floor(Math.random() * bottoms.length);
      selectedItems.push(bottoms[bottomIndex]);
    }
    
    // Add shoes
    if (shoes.length > 0) {
      const shoeIndex = Math.floor(Math.random() * shoes.length);
      selectedItems.push(shoes[shoeIndex]);
    }
    
    // Add outerwear for cold or rainy weather
    if (weather.temperature < 15 || weather.conditions === 'rainy') {
      if (outerwear.length > 0) {
        const outerwearIndex = Math.floor(Math.random() * outerwear.length);
        selectedItems.push(outerwear[outerwearIndex]);
      }
    }
    
    // Add an accessory
    if (accessories.length > 0) {
      const accessoryIndex = Math.floor(Math.random() * accessories.length);
      selectedItems.push(accessories[accessoryIndex]);
    }
    
    if (selectedItems.length < 2) {
      return null; // Not enough items for a proper outfit
    }
    
    return {
      id: String(Date.now()),
      name,
      items: selectedItems,
      missingItems: [],
      occasion,
      confidence: 0.8,
      weatherConditions: weather.conditions,
      temperature: weather.temperature
    };
  };
  
  const handleSaveComplete = () => {
    setSelectedRecommendation(null);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Weather-Based Outfit Recommendations</h2>
      
      <form onSubmit={handleLocationSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location (e.g., 'rainy', 'hot', 'cold', 'snow')"
            style={{ 
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              flex: 1
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </div>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {weather && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
          <h3>Current Weather</h3>
          <div>
            <p style={{ margin: '5px 0' }}>Temperature: {weather.temperature}°C</p>
            <p style={{ margin: '5px 0' }}>Conditions: {weather.conditions}</p>
            <p style={{ margin: '5px 0 0 0' }}>Humidity: {weather.humidity}%</p>
          </div>
        </div>
      )}
      
      {recommendations.length > 0 ? (
        <div>
          <h3>Recommended Outfits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {recommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className={`recommendation-card ${hoveredCardIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                onClick={() => setSelectedRecommendation(recommendation)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  margin: '10px 0',
                  backgroundColor: 'white',
                }}
              >
                <h4 style={{ margin: '0 0 10px 0' }}>{recommendation.name}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                  <strong>Weather:</strong> {recommendation.temperature}°C, {recommendation.weatherConditions}
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                  <strong>Occasion:</strong> {recommendation.occasion}
                </p>
                <div>
                  <strong>Items:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0' }}>
                    {recommendation.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.name}</li>
                    ))}
                  </ul>
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
      ) : weather ? (
        <div>
          <p>No recommendations available. Try adding more items to your wardrobe.</p>
        </div>
      ) : null}
      
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

export default WeatherBasedRecommendations; 