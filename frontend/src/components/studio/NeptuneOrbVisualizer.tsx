import React from 'react';

interface NeptuneOrbVisualizerProps {
  isRecording: boolean;
  audioLevel: number; // 0.0 to 1.0
  isTransitioning?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const NeptuneOrbVisualizer: React.FC<NeptuneOrbVisualizerProps> = ({
  isRecording,
  audioLevel,
  isTransitioning = false,
  onClick,
  size = 'lg',
}) => {
  // Dimension classes
  const dimClass =
    size === 'sm'
      ? 'w-40 h-40 sm:w-48 sm:h-48'
      : size === 'md'
      ? 'w-48 h-48 sm:w-56 sm:h-56'
      : 'w-52 h-52 sm:w-64 sm:h-64';

  const sphereDim =
    size === 'sm'
      ? 'w-36 h-36 sm:w-44 sm:h-44'
      : size === 'md'
      ? 'w-44 h-44 sm:w-52 sm:h-52'
      : 'w-48 h-48 sm:w-60 sm:h-60';

  // Dynamic scale & glow based on voice volume
  const scale = isRecording ? 1 + Math.min(audioLevel * 0.12, 0.15) : 1;
  const glowOpacity = isRecording ? 0.6 + Math.min(audioLevel * 0.4, 0.4) : 0.35;

  return (
    <div
      onClick={onClick}
      className={`relative ${dimClass} flex items-center justify-center select-none cursor-pointer group transition-transform duration-500 active:scale-95 ${
        isTransitioning ? 'scale-110 animate-spin duration-700' : ''
      }`}
    >
      {/* 1. Atmospheric Outer Nebula Aura Glow */}
      <div
        className="absolute inset-0 rounded-full filter blur-2xl transition-all duration-300 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.65) 0%, rgba(2,132,199,0.35) 45%, rgba(129,140,248,0.2) 70%, transparent 85%)',
          opacity: glowOpacity,
          transform: `scale(${scale * 1.25})`,
        }}
      />

      {/* 2. Pristine 3D Neptune Planet Sphere (100% Pure Planet - Zero Mic, Zero Rings) */}
      <div
        className={`relative ${sphereDim} rounded-full shadow-2xl transition-transform duration-300 overflow-hidden`}
        style={{
          transform: `scale(${scale}) rotate(-14deg)`,
          boxShadow:
            '0 25px 50px -10px rgba(2,132,199,0.5), inset -20px -20px 45px rgba(8,47,73,0.75), inset 14px 14px 28px rgba(255,255,255,0.75)',
        }}
      >
        {/* Continuous Fluid Planetary Surface Rotation (Like Neptune moving in space) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-full ${
            isRecording ? 'animate-[spin_12s_linear_infinite]' : 'animate-[spin_24s_linear_infinite]'
          }`}
          style={{
            background: `
              radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(186,230,253,0.85) 18%, transparent 45%),
              radial-gradient(circle at 75% 35%, rgba(253,164,175,0.75) 0%, transparent 40%),
              radial-gradient(circle at 65% 75%, rgba(129,140,248,0.8) 0%, transparent 50%),
              radial-gradient(circle at 25% 70%, rgba(14,165,233,0.9) 0%, transparent 55%),
              linear-gradient(135deg, #7dd3fc 0%, #38bdf8 25%, #0284c7 55%, #0369a1 80%, #075985 100%)
            `,
          }}
        />

        {/* Specular Glossy 3D Reflection Arc Highlight */}
        <div
          className="absolute top-2 left-4 w-32 h-24 rounded-full opacity-75 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 55%, transparent 75%)',
            transform: 'rotate(-25deg)',
          }}
        />
      </div>
    </div>
  );
};
