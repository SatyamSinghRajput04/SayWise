import React from 'react';

interface SayWiseLogoProps {
  className?: string;
  size?: number;
}

export const SayWiseLogo: React.FC<SayWiseLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg
      width={size}
      height={(size * 22) / 36}
      viewBox="0 0 72 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm ${className}`}
    >
      <defs>
        {/* Left Green-to-Cyan Wave Gradient */}
        <linearGradient id="waveGradLeft" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>

        {/* Right Cyan-to-Royal Blue Wave Gradient */}
        <linearGradient id="waveGradRight" x1="0%" y1="50%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Overlap Shadow / Blend */}
        <linearGradient id="waveGradBottom" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Under / Right Ribbon Wave */}
      <path
        d="M26 24C34 32 44 42 56 34C64 28 68 18 72 10C68 14 62 26 52 26C42 26 34 16 26 24Z"
        fill="url(#waveGradRight)"
      />

      {/* Main Flowing Center Wave Curve */}
      <path
        d="M2 28C8 22 14 12 24 10C36 8 44 24 54 22C62 20 68 12 72 10C66 18 58 32 46 32C34 32 26 18 16 18C8 18 4 24 2 28Z"
        fill="url(#waveGradLeft)"
      />

      {/* Bottom connecting curve */}
      <path
        d="M16 18C24 18 32 30 42 36C50 40 60 36 68 28C60 36 50 38 42 34C34 30 26 20 16 18Z"
        fill="url(#waveGradBottom)"
      />
    </svg>
  );
};
