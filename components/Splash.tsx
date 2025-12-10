import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Sequence:
    // 0: Start (Dark Screen #37384C)
    // 1: Show "FashionView" (0.1s)
    // 2: Fade "FashionView" Out (2.0s)
    // 3: Show "THREAD360" Text (2.5s)
    // 4: Fade "THREAD360" Out (4.5s)
    // 5: Show "SELLER PRO" Screen (Light BG #F8F8F8) (5.5s)
    // 6: Fade "SELLER PRO" Out (8.5s)
    // 7: Complete (9.2s)

    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 2500);
    const t4 = setTimeout(() => setStep(4), 4500);
    const t5 = setTimeout(() => setStep(5), 5500);
    const t6 = setTimeout(() => setStep(6), 8500);
    const t7 = setTimeout(() => onComplete(), 9200);

    return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
        clearTimeout(t5); clearTimeout(t6); clearTimeout(t7);
    };
  }, [onComplete]);

  // Background color transition
  const isLightMode = step >= 5;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000 ease-in-out
      ${isLightMode ? 'bg-[#F8F8F8]' : 'bg-[#37384C]'}`}
    >
      
      {/* Phase 1: FashionView Text */}
      <h1 
          className={`absolute text-5xl md:text-7xl font-display font-bold text-white tracking-widest uppercase transition-all duration-700 transform 
          ${step === 1 ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-95 translate-y-4 blur-sm'}`}
          style={{ display: step >= 3 ? 'none' : 'block' }}
      >
        Fashion<span className="font-light">View</span>
      </h1>

      {/* Phase 2: Thread360 Logo Text */}
      <div 
        className={`absolute transition-all duration-1000 transform 
        ${step === 3 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`}
        style={{ display: step >= 5 ? 'none' : 'block' }}
      >
         <Logo large={true} />
      </div>

      {/* Phase 3: SELLER PRO */}
      <div 
        className={`absolute flex flex-col items-center justify-center transition-all duration-1000 transform
        ${step === 5 ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-95 translate-y-4 blur-sm'}`}
        style={{ display: step < 5 ? 'none' : 'flex' }}
      >
        {/* Border Button-like Container */}
        <div className="border-[3px] border-[#37384C] px-10 py-3 rounded-xl mb-8 shadow-sm">
            <span className="text-5xl md:text-7xl font-black text-[#37384C] font-display tracking-tighter">
                SELLER PRO
            </span>
        </div>

        {/* Separator Line */}
        <div className="w-16 h-1 bg-[#37384C] opacity-20 rounded-full mb-8"></div>

        {/* Tagline 1 */}
        <p className="text-xl md:text-2xl font-bold text-[#37384C] font-sans tracking-wide mb-2">
            Price Better. Sell Smarter
        </p>

        {/* Tagline 2 */}
        <p className="text-sm md:text-base text-[#37384C] opacity-60 font-sans font-medium tracking-normal">
            Smart Pricing & Profit Calculator for Online Sellers
        </p>
      </div>
    </div>
  );
};