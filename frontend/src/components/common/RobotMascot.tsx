import React from 'react';

interface RobotMascotProps {
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  speechText = 'Hello! Ready to speak?',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
  };

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Speech Bubble */}
      {speechText && (
        <div className="absolute -top-10 -left-6 sm:-left-12 bg-white/95 backdrop-blur-md text-sky-950 px-3.5 py-1.5 rounded-2xl rounded-br-none shadow-lg border border-sky-100/60 text-xs sm:text-sm font-semibold whitespace-nowrap animate-bounce duration-1000 z-10">
          <span>{speechText}</span>
        </div>
      )}

      {/* 3D Robot Mascot Body SVG with Glowing Eyes & Sleek Highlights */}
      <div className={`${sizeClasses[size]} relative animate-pulse duration-700 flex items-center justify-center`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
          {/* Outer Glow */}
          <circle cx="100" cy="100" r="85" fill="url(#botGlow)" opacity="0.3" />
          
          {/* Head */}
          <rect x="35" y="45" width="130" height="95" rx="45" fill="url(#botHeadGrad)" stroke="#E0F2FE" strokeWidth="4" />
          
          {/* Antenna */}
          <path d="M100 45V20" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="15" r="9" fill="#38BDF8" className="animate-ping duration-1000" />
          <circle cx="100" cy="15" r="7" fill="#0EA5E9" />

          {/* Ears */}
          <rect x="22" y="75" width="14" height="35" rx="7" fill="#0284C7" />
          <rect x="164" y="75" width="14" height="35" rx="7" fill="#0284C7" />

          {/* Visor Screen */}
          <rect x="48" y="60" width="104" height="65" rx="30" fill="#082F49" />

          {/* Glowing Eyes */}
          <circle cx="78" cy="92" r="14" fill="#38BDF8" className="animate-pulse" />
          <circle cx="78" cy="92" r="9" fill="#E0F2FE" />
          <circle cx="82" cy="88" r="3" fill="#FFFFFF" />

          <circle cx="122" cy="92" r="14" fill="#38BDF8" className="animate-pulse" />
          <circle cx="122" cy="92" r="9" fill="#E0F2FE" />
          <circle cx="126" cy="88" r="3" fill="#FFFFFF" />

          {/* Cute Smile / Voice Line */}
          <path d="M92 114C97 117 103 117 108 114" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

          {/* Body */}
          <path d="M60 142C60 135 140 135 140 142L148 185C148 190 144 195 138 195H62C56 195 52 190 52 185L60 142Z" fill="url(#botBodyGrad)" stroke="#E0F2FE" strokeWidth="3" />

          {/* Sleek Power Indicator (Clean & Minimalist) */}
          <circle cx="100" cy="165" r="5" fill="#38BDF8" />

          {/* Gradients */}
          <defs>
            <radialGradient id="botGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(85)">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="botHeadGrad" x1="35" y1="45" x2="165" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#F0F9FF" />
              <stop offset="1" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="botBodyGrad" x1="52" y1="140" x2="148" y2="195" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
