import React from 'react';
import HeroCover from './components/HeroCover.jsx';
import CuteFeatures from './components/CuteFeatures.jsx';
import PhotoBooth from './components/PhotoBooth.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <HeroCover />
      <CuteFeatures />
      <PhotoBooth />
      <Footer />
    </div>
  );
}

export default App;
