import React from 'react';
import SmartOutfitRecommendations from '../components/recommendations/SmartOutfitRecommendations';

const OutfitRecommendations: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Outfit Recommendations</h1>
      <SmartOutfitRecommendations />
    </div>
  );
};

export default OutfitRecommendations; 