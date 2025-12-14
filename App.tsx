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
        <div className="max-w-md mx-auto mb-6 text-center">
            <h1 className="text-2xl font-display font-bold text-brand-dark">Price Calculator</h1>
            <p className="text-gray-500 text-sm mb-6">Accurate settlement estimation for Meesho/Flipkart/Amazon</p>

            {/* One line value statement */}
            <p className="text-lg font-bold text-brand-dark mb-5 leading-tight px-2">
              Calculate your exact selling price, profit, and ROI by including all platform charges, GST, and real business costs.
            </p>

            {/* Explanation block styled like calculator card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-2 text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                Our Pricing Calculator helps online sellers accurately calculate selling prices for Meesho, Flipkart, and Amazon. It factors in product cost, GST paid, platform charges, logistics, returns, and profit margins so you always know your real earnings.
              </p>
            </div>
        </div>
        
        <Calculator />

        {/* Detailed SEO/Explanation Content Block */}
        <div className="max-w-md mx-auto -mt-12 mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left relative z-0">
            <h2 className="text-lg font-display font-bold text-brand-dark mb-4 leading-tight">
              Smart Pricing Calculator for Online Sellers (Meesho, Flipkart & Amazon)
            </h2>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Selling online is not just about listing a product, correct pricing is what actually decides your profit. Platforms like Meesho, Flipkart, and Amazon include multiple charges such as commissions, shipping fees, GST, payment deductions, and returns, which often confuse sellers and reduce margins unexpectedly.
            </p>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Our Pricing Calculator is designed to simplify this entire process. This calculator helps sellers accurately calculate the final selling price, net profit, and ROI by considering all important cost components such as product cost, GST paid, platform charges, logistics fees, payment deductions, and other applicable costs. It also supports GST Input Credit (ITC) calculations, making it easier for GST-registered sellers to understand their real cost and profit.
            </p>

            <p className="text-sm font-semibold text-gray-800 mb-2">Whether you are selling on Meesho, Flipkart, or Amazon, this tool allows you to:</p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1 marker:text-meesho-pink">
              <li>Set the right selling price</li>
              <li>Avoid underpricing or loss</li>
              <li>Understand real profit after all deductions</li>
              <li>Plan margins confidently</li>
            </ul>

            <p className="text-sm font-semibold text-gray-800 mb-2">This calculator is especially useful for:</p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1 marker:text-meesho-pink">
              <li>Online sellers</li>
              <li>Wholesale sellers</li>
              <li>Resellers</li>
              <li>D2C brands</li>
              <li>New online sellers</li>
            </ul>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              We originally built this tool for our own internal pricing calculations. Later, we realized many sellers face the same confusion, so we made it available for everyone to use.
            </p>

            <p className="text-sm font-bold text-brand-dark italic border-l-4 border-meesho-pink pl-3 py-2 bg-gray-50 rounded-r">
              Our goal is simple: transparent pricing, better decisions, and healthier profits.
            </p>
        </div>
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