import React, { useState, useEffect } from 'react';
import { GST_RATE, InputState, CalculationResult } from '../types';
import { calculateSmartPrice } from '../utils/pricingLogic';
import { ResultCard } from './ResultCard';
import { RefreshCcw, Info } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [inputs, setInputs] = useState<InputState>({
    productCost: '',
    gstPaidOnProduct: '',
    shippingCost: '',
    packagingCost: '',
    otherExpenses: '',
    commissionPercent: 0,
    returnRatePercent: 0,
    adsPercent: 0,
    desiredMargin: '',
    gstRate: GST_RATE.THREE, // 3% is common for apparel
  });

  const [results, setResults] = useState<CalculationResult | null>(null);

  // Auto-calculate when critical inputs change
  useEffect(() => {
    const isComplete = inputs.productCost !== '' && inputs.desiredMargin !== '';
    if (isComplete) {
      const res = calculateSmartPrice(inputs);
      setResults(res);
    } else {
      setResults(null);
    }
  }, [inputs]);

  const handleChange = (field: keyof InputState, value: string) => {
    // Allow empty string for backspacing, otherwise parse number
    const numVal = value === '' ? '' : parseFloat(value);
    setInputs(prev => ({ ...prev, [field]: numVal }));
  };

  const handleReset = () => {
    setInputs({
        productCost: '',
        gstPaidOnProduct: '',
        shippingCost: '',
        packagingCost: '',
        otherExpenses: '',
        commissionPercent: 0,
        returnRatePercent: 0,
        adsPercent: 0,
        desiredMargin: '',
        gstRate: GST_RATE.THREE,
    });
    setResults(null);
  };

  // Derived Values for Display
  const productCostVal = Number(inputs.productCost) || 0;
  const gstPaidVal = Number(inputs.gstPaidOnProduct) || 0;
  const itcValue = gstPaidVal; // Input Tax Credit is equal to GST Paid
  const totalPurchaseCost = productCostVal + gstPaidVal;

  return (
    <div className="w-full max-w-md mx-auto pb-24">
      
      {/* Inputs Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 mb-6">
        
        {/* 1. Product Cost Block */}
        <div className="space-y-3 pb-3 border-b border-gray-100">
            {/* Product Cost (Base) */}
            <div className="relative">
                <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Product Cost (Excl. GST) (₹)</label>
                <input
                    type="number"
                    value={inputs.productCost}
                    onChange={(e) => handleChange('productCost', e.target.value)}
                    placeholder="0"
                    className="w-full p-3 text-lg font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-meesho-pink focus:bg-white focus:ring-4 focus:ring-pink-50 transition-all outline-none text-gray-800"
                />
            </div>

            {/* GST Paid on Product */}
            <div className="relative">
                 <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">GST Paid on Product Cost (₹)</label>
                 <input
                    type="number"
                    value={inputs.gstPaidOnProduct}
                    onChange={(e) => handleChange('gstPaidOnProduct', e.target.value)}
                    placeholder="GST amount paid to supplier"
                    className="w-full p-2.5 text-base font-semibold bg-white border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none text-gray-700"
                 />
            </div>

            {/* Auto-Calculated Fields Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* ITC Read-only */}
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                    <label className="block text-[9px] font-bold text-blue-800/60 uppercase mb-1 truncate">GST Input Credit (ITC)</label>
                    <div className="font-mono font-bold text-blue-700">
                        {itcValue > 0 ? `₹${itcValue.toFixed(2)}` : '₹0.00'}
                    </div>
                </div>

                 {/* Total Purchase Cost Read-only */}
                 <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 truncate">Total Purchase Cost</label>
                    <div className="font-mono font-bold text-gray-700">
                        {totalPurchaseCost > 0 ? `₹${totalPurchaseCost.toFixed(2)}` : '₹0.00'}
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Shipping Cost */}
        <div className="relative pt-1">
            <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Shipping Cost (₹)</label>
            <div className="relative">
                <input
                    type="number"
                    value={inputs.shippingCost}
                    onChange={(e) => handleChange('shippingCost', e.target.value)}
                    placeholder="Seller shipping share"
                    className="w-full p-3 font-semibold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-meesho-pink focus:bg-white focus:ring-2 focus:ring-pink-50 transition-all outline-none text-gray-800"
                />
            </div>
             <p className="text-[10px] text-gray-400 mt-1 ml-1">If Free Delivery, enter courier charge here.</p>
        </div>

        {/* 3. Packaging Cost */}
        <div className="relative">
            <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Packaging Material (₹)</label>
            <input
                type="number"
                value={inputs.packagingCost}
                onChange={(e) => handleChange('packagingCost', e.target.value)}
                placeholder="Polybag, label, tape..."
                className="w-full p-3 font-semibold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-meesho-pink focus:bg-white focus:ring-2 focus:ring-pink-50 transition-all outline-none text-gray-800"
            />
        </div>

        {/* SECTION SPLITTER */}
        <div className="h-px bg-gray-100 my-2"></div>

        {/* 4. Platform Fees (Commission, Returns, Ads) */}
        <div className="grid grid-cols-3 gap-3">
             {/* Commission */}
             <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">Commission %</label>
                 <input
                    type="number"
                    value={inputs.commissionPercent}
                    onChange={(e) => handleChange('commissionPercent', e.target.value)}
                    placeholder="0"
                    className="w-full p-2 text-center font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 outline-none"
                 />
             </div>
             
             {/* Return Rate */}
             <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight flex items-center gap-1">
                    Return Rate % 
                 </label>
                 <input
                    type="number"
                    value={inputs.returnRatePercent}
                    onChange={(e) => handleChange('returnRatePercent', e.target.value)}
                    placeholder="10-15"
                    className="w-full p-2 text-center font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-400 outline-none"
                 />
             </div>

             {/* Ads Cost */}
             <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">Ads Cost %</label>
                 <input
                    type="number"
                    value={inputs.adsPercent}
                    onChange={(e) => handleChange('adsPercent', e.target.value)}
                    placeholder="0"
                    className="w-full p-2 text-center font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:border-purple-400 outline-none"
                 />
             </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center italic">Platform overheads & marketing</p>
        
        {/* Other Expenses */}
        <div className="relative mt-3">
            <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Other Expenses (₹)</label>
            <input
                type="number"
                value={inputs.otherExpenses}
                onChange={(e) => handleChange('otherExpenses', e.target.value)}
                placeholder="It can be anything..."
                className="w-full p-3 font-semibold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-meesho-pink focus:bg-white focus:ring-2 focus:ring-pink-50 transition-all outline-none text-gray-800"
            />
        </div>

        {/* SECTION SPLITTER */}
        <div className="h-px bg-gray-100 my-2"></div>

        {/* GST Selector */}
        <div>
             <label className="block text-xs font-extrabold text-gray-500 uppercase mb-2 ml-1 tracking-wider">GST Rate</label>
             <div className="grid grid-cols-4 gap-2">
                {[3, 5, 12, 18].map((rate) => (
                    <button
                        key={rate}
                        onClick={() => setInputs(prev => ({...prev, gstRate: rate}))}
                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                            inputs.gstRate === rate 
                            ? 'bg-meesho-text text-white border-meesho-text shadow-lg' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {rate}%
                    </button>
                ))}
             </div>
        </div>

        {/* Expected Margin */}
         <div className="relative mt-4">
            <label className="flex items-center text-xs font-extrabold text-meesho-pink uppercase mb-1.5 ml-1 tracking-wider">
                Desired Net Profit (₹)
            </label>
            <input
                type="number"
                value={inputs.desiredMargin}
                onChange={(e) => handleChange('desiredMargin', e.target.value)}
                placeholder="Required Profit Amount"
                className="w-full p-4 text-2xl font-bold bg-pink-50 border-2 border-pink-200 rounded-xl focus:border-meesho-pink focus:ring-4 focus:ring-pink-100 transition-all outline-none text-meesho-pink placeholder-pink-200"
            />
        </div>
      </div>

      {/* Results or Call to Action */}
      <div className="min-h-[100px] transition-all">
        {results ? (
            <ResultCard results={results} />
        ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center opacity-60">
                <div className="text-sm text-gray-400">Fill details to see the magic price</div>
            </div>
        )}
      </div>

       {/* Reset Button */}
       {results && (
         <div className="flex justify-center mt-8 pb-10">
            <button 
                onClick={handleReset}
                className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors text-sm font-bold shadow-sm"
            >
                <RefreshCcw size={16} />
                <span>Reset All Fields</span>
            </button>
         </div>
       )}

    </div>
  );
};