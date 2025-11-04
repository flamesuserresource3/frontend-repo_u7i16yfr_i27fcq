import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Download, FlipHorizontal2 } from 'lucide-react';

const EMOJI_SET = ['💖', '✨', '🌸', '🧸', '⭐', '🎀', '🍓', '🌈'];
const FILTERS = [
  { key: 'none', label: 'None', css: '' },
  { key: 'cute', label: 'Blush', css: 'brightness(1.05) saturate(1.2) hue-rotate(-10deg)' },
  { key: 'bw', label: 'B&W', css: 'grayscale(1) contrast(1.1)' },
  { key: 'sepia', label: 'Sepia', css: 'sepia(0.6) saturate(1.1)' },
  { key: 'soft', label: 'Soft', css: 'brightness(1.1) contrast(0.95) saturate(1.1) blur(0px)' },
];

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [streamReady, setStreamReady] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [stickers, setStickers] = useState([]); // {x, y, emoji, size}
  const [activeEmoji, setActiveEmoji] = useState(EMOJI_SET[0]);
  const [filter, setFilter] = useState(FILTERS[1]);
  const [mirrored, setMirrored] = useState(true);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreamReady(true);
      }
    } catch (e) {
      console.error('Camera error', e);
      setStreamReady(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handlePlaceSticker = (e) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStickers((prev) => [...prev, { x, y, emoji: activeEmoji, size: 48 }]);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Mirror if needed
    if (mirrored) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    // Apply filter
    ctx.filter = filter.css || 'none';
    ctx.drawImage(video, 0, 0, w, h);

    // Reset transform for stickers drawing
    if (mirrored) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Draw stickers relative to displayed size
    const display = frameRef.current.getBoundingClientRect();
    const scaleX = w / display.width;
    const scaleY = h / display.height;

    stickers.forEach((s) => {
      const fontSize = s.size * ((scaleX + scaleY) / 2);
      ctx.font = `${fontSize}px system-ui, Apple Color Emoji, Segoe UI Emoji`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.emoji, s.x * scaleX, s.y * scaleY);
    });

    setCaptured(true);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'cute-photobooth.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleRetake = () => {
    setCaptured(false);
  };

  const clearStickers = () => setStickers([]);

  return (
    <section id="booth" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your Photobooth</h2>
          <p className="mt-1 text-sm text-gray-600">Place stickers on the preview, pick a filter, then snap and save.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMirrored((m) => !m)}
            className="inline-flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-pink-50"
          >
            <FlipHorizontal2 className="h-4 w-4" /> Mirror: {mirrored ? 'On' : 'Off'}
          </button>
          <select
            value={filter.key}
            onChange={(e) => setFilter(FILTERS.find((f) => f.key === e.target.value) || FILTERS[0])}
            className="rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm text-gray-700"
          >
            {FILTERS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Live frame */}
        <div>
          <div
            ref={frameRef}
            onClick={handlePlaceSticker}
            className="relative aspect-video w-full overflow-hidden rounded-2xl border border-pink-100 bg-gray-50 shadow-sm"
          >
            {/* Video preview */}
            {!captured && (
              <video
                ref={videoRef}
                className={`h-full w-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
                style={{ filter: filter.css }}
                playsInline
                muted
                autoPlay
              />
            )}

            {/* Captured canvas */}
            {captured && (
              <canvas ref={canvasRef} className="h-full w-full" />
            )}

            {/* Sticker overlay */}
            {!captured && (
              <div className="pointer-events-none absolute inset-0">
                {stickers.map((s, i) => (
                  <div
                    key={`${s.emoji}-${i}-${s.x}-${s.y}`}
                    className="absolute select-none"
                    style={{ left: s.x - s.size / 2, top: s.y - s.size / 2, fontSize: s.size }}
                  >
                    {s.emoji}
                  </div>
                ))}
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/80 p-2 backdrop-blur">
                {EMOJI_SET.map((e) => (
                  <button
                    key={e}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setActiveEmoji(e);
                    }}
                    className={`rounded-lg px-2 py-1 text-xl transition ${activeEmoji === e ? 'bg-pink-100' : 'hover:bg-pink-50'}`}
                    title="Click then tap on the preview to place"
                  >
                    {e}
                  </button>
                ))}
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    clearStickers();
                  }}
                  className="ml-2 rounded-lg border border-pink-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-pink-50"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!captured ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCapture();
                    }}
                    disabled={!streamReady}
                    className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 font-medium text-white shadow-lg shadow-pink-500/30 transition hover:-translate-y-0.5 hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Camera className="h-5 w-5" /> Snap
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetake();
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-gray-700 hover:bg-pink-50"
                    >
                      <RefreshCw className="h-5 w-5" /> Retake
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 font-medium text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600"
                    >
                      <Download className="h-5 w-5" /> Download
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">Tip: pick a sticker then click anywhere on the preview to place it.</p>
        </div>

        {/* Sidebar */}
        <aside className="flex h-full flex-col gap-4 rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900">Style presets</h3>
          <div className="grid grid-cols-2 gap-3">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f)}
                className={`rounded-xl border p-3 text-sm ${filter.key === f.key ? 'border-pink-400 bg-pink-50' : 'border-pink-100 hover:bg-pink-50'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mt-2 rounded-xl bg-pink-50 p-3 text-sm text-pink-700">
            Your camera stays on your device — nothing is uploaded.
          </div>
        </aside>
      </div>
    </section>
  );
};

export default PhotoBooth;
