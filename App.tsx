import React, { useState } from 'react';
import { Splash } from './components/Splash';
import { Calculator } from './components/Calculator';
import { Logo } from './components/Logo';
import { Facebook, Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Splash onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#37384C] border-b border-gray-700 shadow-lg">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
           {/* Thread360 Text Logo */}
           <Logo />
           
           <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white border border-white/20 tracking-wide">
              SELLER PRO
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto mb-6">
            <h1 className="text-2xl font-display font-bold text-brand-dark">Price Calculator</h1>
            <p className="text-gray-500 text-sm">Accurate settlement estimation for Meesho/Flipkart/Amazon</p>
        </div>
        
        <Calculator />
      </main>

      {/* Social Follow Section */}
      <div className="py-6 text-center">
        <p className="text-sm font-bold text-gray-500 mb-3">Please Follow us to Support</p>
        <div className="flex justify-center space-x-6">
            <a 
              href="https://facebook.com/sarma.raja" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#37384C] hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <Facebook size={28} strokeWidth={1.5} fill="#37384C" className="text-[#37384C]" />
            </a>
            <a 
              href="https://instagram.com/mr.rjsarma" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#37384C] hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <Instagram size={28} strokeWidth={1.5} className="text-[#37384C]" />
            </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-6 mt-auto">
        <div className="max-w-md mx-auto px-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Powered by Thread360</p>
            <p className="text-[10px] text-gray-500">Disclaimer: Calculations are estimates based on standard policies of Marketplaces. Actual settlement may vary.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;