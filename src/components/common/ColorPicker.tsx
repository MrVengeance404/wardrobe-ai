import React, { useState } from 'react';

interface ColorPickerProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
  maxColors?: number;
  label?: string;
  error?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColors,
  onChange,
  maxColors = 5,
  label,
  error,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3b82f6');

  // Predefined color palette
  const colorPalette = [
    // Blues
    '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
    // Greens
    '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
    // Reds
    '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
    // Yellows
    '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f',
    // Purples
    '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
    // Pinks
    '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843',
    // Grays
    '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712',
    // Extra colors
    '#000000', '#ffffff',
  ];

  const addColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onChange(selectedColors.filter(c => c !== color));
    } else if (selectedColors.length < maxColors) {
      onChange([...selectedColors, color]);
    }
  };

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
  };

  const handleAddCustomColor = () => {
    if (!selectedColors.includes(currentColor) && selectedColors.length < maxColors) {
      onChange([...selectedColors, currentColor]);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="flex flex-wrap gap-2">
        {selectedColors.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => addColor(color)}
            className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-gray-200 focus:outline-none focus:ring-primary"
            style={{ backgroundColor: color }}
            title={`Remove ${color}`}
            aria-label={`Selected color: ${color}, click to remove`}
          />
        ))}

        {selectedColors.length < maxColors && (
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:border-gray-400 focus:outline-none focus:border-primary"
            title="Add color"
            aria-label="Add a color"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showColorPicker && (
        <div className="mt-2 p-3 border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-8 gap-2 mb-3">
            {colorPalette.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => addColor(color)}
                className={`w-6 h-6 rounded-full hover:ring-2 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedColors.includes(color) ? 'ring-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Color: ${color}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="color"
              value={currentColor}
              onChange={handleColorInput}
              className="w-8 h-8 rounded overflow-hidden cursor-pointer"
              aria-label="Custom color picker"
            />
            <input
              type="text"
              value={currentColor}
              onChange={handleColorInput}
              className="input text-sm h-8 px-2 py-1"
              placeholder="#000000"
              aria-label="Color hex code"
            />
            <button
              type="button"
              onClick={handleAddCustomColor}
              className="btn btn-primary text-sm px-2 py-1 h-8"
              disabled={selectedColors.includes(currentColor) || selectedColors.length >= maxColors}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 