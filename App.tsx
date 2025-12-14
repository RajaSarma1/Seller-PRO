import React, { useState } from 'react';
import { Splash } from './components/Splash';
import { Calculator } from './components/Calculator';
import { Logo } from './components/Logo';
import { Facebook, Instagram, ArrowLeft } from 'lucide-react';

type PageType = 'HOME' | 'ABOUT' | 'PRIVACY' | 'TERMS' | 'CONTACT';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('HOME');

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Splash onComplete={() => setLoading(false)} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'HOME':
        return (
          <>
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
          </>
        );

      case 'ABOUT':
        return (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in text-left">
                <button onClick={() => handlePageChange('HOME')} className="flex items-center text-sm text-gray-500 hover:text-meesho-pink mb-6 transition-colors font-bold">
                    <ArrowLeft size={16} className="mr-1" /> Back to Calculator
                </button>
                <h1 className="text-2xl font-display font-bold text-brand-dark mb-6">About Us</h1>
                
                <h2 className="text-lg font-bold text-brand-dark mb-2">About FashionView</h2>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed mb-6">
                    <p>FashionView is a wholesale-focused brand dealing in a wide range of trending and practical products. We primarily work in wholesale across categories such as home décor items, smart gadgets, stainless steel bottles and tumblers, temperature-controlled bottles and tumblers, speakers, smart utility products, daily-use essentials, and many more.</p>
                    <p>Along with wholesale, we also operate in retail clothing under the FashionView name.</p>
                    <p>You can explore our product range and updates on our Facebook Page.</p>
                    <p>Alongside FashionView, we also operate in both retail and wholesale clothing through our brand Thread360, which works slightly differently and focuses on a more specialized segment.</p>
                </div>

                <h2 className="text-lg font-bold text-brand-dark mb-2">About Thread360</h2>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>Thread360 focuses on clothing and printing solutions. Under this brand, we work with:</p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-meesho-pink">
                        <li>Print-on-Demand (POD) services</li>
                        <li>Wholesale blank T-shirts, hoodies, and apparel</li>
                        <li>Products specifically designed for printing and branding businesses</li>
                    </ul>
                    <p>We originally created this pricing calculator for our own internal business use, to accurately calculate selling prices across platforms without confusion.</p>
                    <p>As sellers ourselves, we understand how difficult it can be to estimate the real profit after platform charges, GST, and other deductions. To help other sellers make better pricing decisions, we decided to make this tool publicly available for everyone.</p>
                </div>
            </div>
        );

      case 'PRIVACY':
        return (
             <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in text-left">
                <button onClick={() => handlePageChange('HOME')} className="flex items-center text-sm text-gray-500 hover:text-meesho-pink mb-6 transition-colors font-bold">
                    <ArrowLeft size={16} className="mr-1" /> Back to Calculator
                </button>
                <h1 className="text-2xl font-display font-bold text-brand-dark mb-6">Privacy Policy</h1>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p className="font-semibold">At FashionView, we respect your privacy.</p>
                    <p>This pricing calculator does not collect, store, or share any personal data. All calculations happen directly in your browser or app session. We do not ask for login details, personal information, or business data.</p>
                    <p>Information you enter into the calculator (such as product cost or pricing details) is used only for calculation purposes and is not saved on our servers.</p>
                    <p>We may use third-party services such as analytics or advertising platforms to improve user experience and maintain the platform, but these services do not give us access to your personal inputs.</p>
                    <p>By using this tool, you agree to this privacy policy.</p>
                </div>
             </div>
        );

      case 'TERMS':
        return (
             <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in text-left">
                <button onClick={() => handlePageChange('HOME')} className="flex items-center text-sm text-gray-500 hover:text-meesho-pink mb-6 transition-colors font-bold">
                    <ArrowLeft size={16} className="mr-1" /> Back to Calculator
                </button>
                <h1 className="text-2xl font-display font-bold text-brand-dark mb-6">Terms and Conditions</h1>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>Our Pricing Calculator is provided for informational and estimation purposes only.</p>
                    <p>While we aim to keep calculations accurate and updated, actual charges on platforms like Meesho, Flipkart, and Amazon may vary depending on category, seller agreements, location, promotions, or policy changes by the platforms themselves.</p>
                    <p>FashionView does not guarantee exact profit figures and is not responsible for any financial loss or decision made based on calculator results.</p>
                    <p>Users are advised to verify final pricing and charges directly from the respective selling platforms before listing products.</p>
                    <p>By using this calculator, you agree to use it responsibly and understand that it is a guidance tool, not a substitute for official platform documentation.</p>
                </div>
             </div>
        );
      
      case 'CONTACT':
          return (
             <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in text-left">
                <button onClick={() => handlePageChange('HOME')} className="flex items-center text-sm text-gray-500 hover:text-meesho-pink mb-6 transition-colors font-bold">
                    <ArrowLeft size={16} className="mr-1" /> Back to Calculator
                </button>
                <h1 className="text-2xl font-display font-bold text-brand-dark mb-6">Contact Us</h1>
                <p className="text-sm text-gray-600 mb-8">Contact us through our social media handles</p>
                
                <div className="flex justify-start space-x-6">
                    <a 
                      href="https://facebook.com/thread360in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#37384C] hover:scale-110 transition-transform"
                      aria-label="Facebook"
                    >
                      <Facebook size={32} strokeWidth={1.5} fill="#37384C" className="text-[#37384C]" />
                    </a>
                    <a 
                      href="https://instagram.com/thread360in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#37384C] hover:scale-110 transition-transform"
                      aria-label="Instagram"
                    >
                      <Instagram size={32} strokeWidth={1.5} className="text-[#37384C]" />
                    </a>
                </div>
             </div>
          );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#37384C] border-b border-gray-700 shadow-lg">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
           {/* Thread360 Text Logo with Home Link */}
           <div onClick={() => handlePageChange('HOME')} className="cursor-pointer">
              <Logo />
           </div>
           
           <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white border border-white/20 tracking-wide">
              SELLER PRO
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-6 mt-auto">
        <div className="max-w-md mx-auto px-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Powered by Thread360</p>
            <p className="text-[10px] text-gray-500 mb-4">Disclaimer: Calculations are estimates based on standard policies of Marketplaces. Actual settlement may vary.</p>
            
            {/* New Links Row */}
            <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 uppercase font-bold tracking-wider border-t border-gray-700 pt-4">
                <button onClick={() => handlePageChange('ABOUT')} className={`hover:text-white transition-colors ${currentPage === 'ABOUT' ? 'text-white' : ''}`}>About</button>
                <button onClick={() => handlePageChange('PRIVACY')} className={`hover:text-white transition-colors ${currentPage === 'PRIVACY' ? 'text-white' : ''}`}>Privacy Policy</button>
                <button onClick={() => handlePageChange('TERMS')} className={`hover:text-white transition-colors ${currentPage === 'TERMS' ? 'text-white' : ''}`}>Terms</button>
                <button onClick={() => handlePageChange('CONTACT')} className={`hover:text-white transition-colors ${currentPage === 'CONTACT' ? 'text-white' : ''}`}>Contact</button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;