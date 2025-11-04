import React from 'react';
import Spline from '@splinetool/react-spline';
import { Camera } from 'lucide-react';

const HeroCover = () => {
  const handleScroll = () => {
    const el = document.getElementById('booth');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700 shadow">
          <Camera className="h-4 w-4" /> Cute Web Photobooth
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Snap adorable moments
          <span className="block bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">with playful vibes</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          Open your camera, add stickers and filters, then download your masterpiece. No sign‑up. Pure fun.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleScroll}
            className="rounded-xl bg-pink-500 px-6 py-3 text-white shadow-lg shadow-pink-500/30 transition hover:-translate-y-0.5 hover:bg-pink-600 active:translate-y-0"
          >
            Start the Booth
          </button>
          <a
            href="#features"
            className="rounded-xl border border-pink-200 bg-white px-6 py-3 text-pink-600 transition hover:bg-pink-50"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroCover;
