import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Homepage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-b from-primary/5 to-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">Style Smarter with</span>
            <span className="block text-primary">Wardrobe AI</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
            Your personal style assistant that helps you maximize your wardrobe, create perfect outfits, and explore new looks based on what you already own.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Log In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Smart Wardrobe Management
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Simplify your style decisions with our AI-powered features
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card isHoverable className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Organize Your Wardrobe</h3>
              <p className="text-gray-500">
                Easily catalog and categorize all your clothing items in one place with our intuitive interface.
              </p>
            </Card>

            <Card isHoverable className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Perfect Color Matching</h3>
              <p className="text-gray-500">
                Our AI analyzes your skin tone, hair, and eye color to suggest personalized color palettes that look amazing on you.
              </p>
            </Card>

            <Card isHoverable className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Daily Outfit Recommendations</h3>
              <p className="text-gray-500">
                Get personalized outfit suggestions based on your wardrobe, occasion, weather, and style preferences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Character Themes Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Explore Themed Looks
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get inspired by character-based wardrobes and iconic styles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img 
                src="https://www.themoviedb.org/t/p/original/xOFW7jcXEFID7EwM25IvSEGWpWx.jpg" 
                alt="Bruce Wayne Style" 
                className="w-full h-80 object-cover object-center group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold text-white">Bruce Wayne</h3>
                <p className="text-white/80">Sleek, sophisticated business attire</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="primary" size="sm">Explore</Button>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img 
                src="https://www.themoviedb.org/t/p/original/iQsLY4JxJ0fz2N9NBX9Y4TKcJaJ.jpg" 
                alt="Ken Style" 
                className="w-full h-80 object-cover object-center group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold text-white">Ken</h3>
                <p className="text-white/80">Bright, bold, and playful looks</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="primary" size="sm">Explore</Button>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img 
                src="https://www.themoviedb.org/t/p/original/15ozYdreUG2Ad60RJXLbPXceW5u.jpg" 
                alt="Peter Parker Style" 
                className="w-full h-80 object-cover object-center group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold text-white">Peter Parker</h3>
                <p className="text-white/80">Budget-friendly casual everyday wear</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="primary" size="sm">Explore</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/themes">
              <Button variant="outline">View All Theme Outfits</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join thousands of users who have simplified their style decisions and maximized their existing wardrobe. 
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg">Get Started for Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage; 