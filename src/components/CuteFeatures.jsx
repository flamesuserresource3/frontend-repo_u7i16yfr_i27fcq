import React from 'react';
import { Sparkles, Sticker, SlidersHorizontal, Download } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'One‑click magic',
    desc: 'Open your camera instantly and start snapping with a single click.'
  },
  {
    icon: Sticker,
    title: 'Adorable stickers',
    desc: 'Add cute emojis, hearts, stars and more to decorate your photos.'
  },
  {
    icon: SlidersHorizontal,
    title: 'Sweet filters',
    desc: 'Choose from blush, sepia, and pastel tones for the perfect vibe.'
  },
  {
    icon: Download,
    title: 'Easy save',
    desc: 'Export your creation as a high‑res image ready to share.'
  }
];

const CuteFeatures = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Why you’ll love it</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">Designed to be playful, fast, and beautiful on any device.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group rounded-2xl border border-pink-100 bg-white/80 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-pink-50 p-3 text-pink-600 ring-1 ring-pink-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CuteFeatures;
