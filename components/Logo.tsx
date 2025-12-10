import React from 'react';

interface LogoProps {
  className?: string;
  large?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", large = false }) => {
  return (
    <div className={`select-none flex items-center ${className}`}>
      <span 
        className={`font-display font-black tracking-tight text-white ${large ? 'text-5xl md:text-6xl' : 'text-2xl'}`}
        style={{ letterSpacing: '-0.02em' }}
      >
        THREAD<span className="text-gray-200">360</span>
      </span>
    </div>
  );
};