import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ColorPicker from '../components/common/ColorPicker';
import Card from '../components/common/Card';
import { SkinTone, HairColor, EyeColor, Gender } from '../types';
import { getRecommendedColorPalette } from '../utils/colorUtils';

interface FormSizes {
  shirt: string;
  pants: string;
  shoes: string;
  [key: string]: string;
}

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  skinTone: SkinTone;
  hairColor: HairColor;
  eyeColor: EyeColor;
  gender: Gender;
  profilePicture: string;
  sizes: FormSizes;
  colorPalette: string[];
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    skinTone: SkinTone.Medium,
    hairColor: HairColor.Brown,
    eyeColor: EyeColor.Brown,
    gender: Gender.PreferNotToSay,
    profilePicture: '',
    sizes: {
      shirt: 'M',
      pants: '32',
      shoes: '10',
    },
    colorPalette: ['#3b82f6', '#10b981', '#f59e0b', '#6b7280', '#1f2937'],
  });

  // Options for select inputs
  const skinToneOptions = Object.values(SkinTone).map(value => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));

  const hairColorOptions = Object.values(HairColor).map(value => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));

  const eyeColorOptions = Object.values(EyeColor).map(value => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));

  const genderOptions = Object.values(Gender).map(value => ({
    value,
    label: value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  }));

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'sizes') {
        setFormData(prev => ({
          ...prev,
          sizes: {
            ...prev.sizes,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // If skin tone, hair color, or eye color changes, update color palette
    if (name === 'skinTone' || name === 'hairColor' || name === 'eyeColor') {
      const skinTone = name === 'skinTone' ? value as SkinTone : formData.skinTone;
      const hairColor = name === 'hairColor' ? value as HairColor : formData.hairColor;
      const eyeColor = name === 'eyeColor' ? value as EyeColor : formData.eyeColor;

      const palette = getRecommendedColorPalette(skinTone, hairColor, eyeColor);
      setFormData(prev => ({
        ...prev,
        colorPalette: palette,
      }));
    }
  };

  // Handle color palette changes
  const handleColorPaletteChange = (colors: string[]) => {
    setFormData(prev => ({
      ...prev,
      colorPalette: colors,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create a new object without the confirmPassword field
      const { confirmPassword, ...userData } = formData;
      await register(userData, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Step 1: Intro and basic info
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Wardrobe AI</h2>
        <p className="mt-2 text-gray-600">
          Let's get you set up with a personalized wardrobe experience.
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      <div className="flex justify-end">
        <Button onClick={goToNextStep}>
          Next: Personal Details
        </Button>
      </div>
    </div>
  );

  // Step 2: Personal traits
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Personal Details</h2>
        <p className="mt-2 text-gray-600">
          We use this information to recommend colors and styles that will look great on you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Select
          label="Skin Tone"
          options={skinToneOptions}
          value={formData.skinTone}
          onChange={(value) => handleSelectChange('skinTone', value)}
        />

        <Select
          label="Hair Color"
          options={hairColorOptions}
          value={formData.hairColor}
          onChange={(value) => handleSelectChange('hairColor', value)}
        />

        <Select
          label="Eye Color"
          options={eyeColorOptions}
          value={formData.eyeColor}
          onChange={(value) => handleSelectChange('eyeColor', value)}
        />

        <Select
          label="Gender"
          options={genderOptions}
          value={formData.gender}
          onChange={(value) => handleSelectChange('gender', value)}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your Sizes</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Input
            label="Shirt Size"
            type="text"
            name="sizes.shirt"
            value={formData.sizes.shirt}
            onChange={handleChange}
          />

          <Input
            label="Pants Size"
            type="text"
            name="sizes.pants"
            value={formData.sizes.pants}
            onChange={handleChange}
          />

          <Input
            label="Shoe Size"
            type="text"
            name="sizes.shoes"
            value={formData.sizes.shoes}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button onClick={goToNextStep}>
          Next: Color Palette
        </Button>
      </div>
    </div>
  );

  // Step 3: Color palette
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Color Palette</h2>
        <p className="mt-2 text-gray-600">
          Based on your features, here's a color palette that will look great on you. Feel free to customize it.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Colors</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {formData.colorPalette.map((color, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-16 h-16 rounded-md shadow-md" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{color}</span>
            </div>
          ))}
        </div>

        <ColorPicker
          selectedColors={formData.colorPalette}
          onChange={handleColorPaletteChange}
          label="Customize Your Palette"
          maxColors={5}
        />
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button onClick={handleSubmit} isLoading={loading}>
          Complete Setup
        </Button>
      </div>

      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 ${
                      step < 3 ? 'border-t-2' : ''
                    } ${
                      step <= currentStep
                        ? 'border-primary'
                        : 'border-gray-200'
                    }`}
                  >
                    <div
                      className={`-mt-3 text-center ${
                        step === 1 ? 'text-left' : ''
                      } ${step === 3 ? 'text-right' : ''}`}
                    >
                      <div
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          step <= currentStep
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step}
                      </div>
                      <div
                        className={`mt-2 text-xs font-medium uppercase ${
                          step <= currentStep
                            ? 'text-primary'
                            : 'text-gray-500'
                        }`}
                      >
                        {step === 1 && 'Account'}
                        {step === 2 && 'Personal'}
                        {step === 3 && 'Colors'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 