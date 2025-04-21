import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WardrobeProvider } from './context/WardrobeContext';
import { ThemeProvider } from './context/ThemeContext';
import { RecommendationProvider } from './context/RecommendationContext';
import Layout from './components/layout/Layout';

// Import pages
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import OutfitRecommendations from './pages/OutfitRecommendations';

// Placeholder components for non-implemented pages
const Themes = () => <div style={{ padding: '20px', textAlign: 'center' }}>Themes Page (Coming Soon)</div>;
const Community = () => <div style={{ padding: '20px', textAlign: 'center' }}>Community Page (Coming Soon)</div>;
const Profile = () => <div style={{ padding: '20px', textAlign: 'center' }}>Profile Page (Coming Soon)</div>;
const Features = () => <div style={{ padding: '20px', textAlign: 'center' }}>Features Page (Coming Soon)</div>;
const Pricing = () => <div style={{ padding: '20px', textAlign: 'center' }}>Pricing Page (Coming Soon)</div>;
const About = () => <div style={{ padding: '20px', textAlign: 'center' }}>About Page (Coming Soon)</div>;

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Router>
        <AuthProvider>
          <WardrobeProvider>
            <ThemeProvider>
              <RecommendationProvider>
                <Layout>
                  <div className="container">
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/wardrobe" element={<Wardrobe />} />
                      <Route path="/outfits" element={<Outfits />} />
                      <Route path="/recommendations" element={<OutfitRecommendations />} />
                      <Route path="/themes" element={<Themes />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/about" element={<About />} />
                    </Routes>
                  </div>
                </Layout>
              </RecommendationProvider>
            </ThemeProvider>
          </WardrobeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
