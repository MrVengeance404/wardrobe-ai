import React, { useState } from 'react';
import { useWardrobe } from '../../context/WardrobeContext';
import { OutfitRecommendation, ItemStyle, Season } from '../../types';

interface SaveRecommendationProps {
  recommendation: OutfitRecommendation;
  onSaved: () => void;
}

const SaveRecommendation: React.FC<SaveRecommendationProps> = ({ recommendation, onSaved }) => {
  const { addOutfit } = useWardrobe();
  const [name, setName] = useState(recommendation.name);
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<ItemStyle>(ItemStyle.Casual);
  const [seasons, setSeasons] = useState<Season[]>([Season.Spring]); // Default to spring
  const [occasion, setOccasion] = useState(recommendation.occasion || '');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSeasonToggle = (season: Season) => {
    setSeasons(prev => 
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Form validation
      if (!name.trim()) {
        throw new Error('Please provide a name for this outfit');
      }

      if (seasons.length === 0) {
        throw new Error('Please select at least one season');
      }

      // Save the outfit based on the recommendation
      await addOutfit({
        name,
        description,
        items: recommendation.items,
        style,
        season: seasons,
        occasion,
        isPublic,
      });

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save outfit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Save as Outfit</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Outfit Name*</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for this outfit"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this outfit"
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="style" style={{ display: 'block', marginBottom: '5px' }}>Style*</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as ItemStyle)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {Object.values(ItemStyle).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Seasons*</label>
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
          <label htmlFor="occasion" style={{ display: 'block', marginBottom: '5px' }}>Occasion</label>
          <input
            id="occasion"
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g., Work, Casual, Party"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make this outfit public
          </label>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onSaved}
            style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : 'Save Outfit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaveRecommendation; 