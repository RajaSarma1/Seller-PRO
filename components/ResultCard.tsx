import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { ChevronDown, ChevronUp, Copy, Check, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  results: CalculationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ results }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  const handleCopy = () => {
    navigator.clipboard.writeText(results.listingPrice.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-slide-up relative z-10">
      {/* Header Result */}
      <div className="bg-meesho-text p-6 text-white relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">Listing Price</p>
        
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-5xl font-black font-display tracking-tight text-white drop-shadow-sm">
            {formatCurrency(results.listingPrice)}
          </h2>
          <button 
            onClick={handleCopy}
            className="mb-2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95"
          >
            {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-white"/>}
          </button>
        </div>
        
        {/* Key Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/10">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase">Settlement</span>
                <span className="font-bold text-lg text-white">{formatCurrency(results.totalSettlement)}</span>
            </div>
            <div className="flex flex-col text-center border-l border-r border-white/10">
                <span className="text-[10px] text-gray-400 uppercase">Net Profit</span>
                <span className={`font-bold text-lg ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(results.netProfit)}
                </span>
            </div>
            <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-400 uppercase">ROI</span>
                <span className="font-bold text-lg text-blue-300">{results.roi.toFixed(0)}%</span>
            </div>
        </div>
      </div>

      {/* Accordion Trigger */}
      <button 
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full p-3 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border-b border-gray-100 text-xs font-bold uppercase tracking-wide"
      >
        {showBreakdown ? 'Hide Breakdown' : 'View Cost Breakdown'}
        {showBreakdown ? <ChevronUp size={14} className="ml-2"/> : <ChevronDown size={14} className="ml-2"/>}
      </button>

      {/* Breakdown Details */}
      {showBreakdown && (
        <div className="p-5 bg-white space-y-2 text-sm animate-slide-up">
            <div className="flex justify-between py-1">
                <span className="text-gray-500">Taxable Value</span>
                <span className="font-medium text-gray-800">{formatCurrency(results.taxableValue)}</span>
            </div>
            
            {/* Government Taxes */}
            <div className="flex justify-between py-1 text-red-600/80">
                <span className="">GST Amount</span>
                <span className="font-medium">-{formatCurrency(results.gstAmount)}</span>
            </div>
            <div className="flex justify-between py-1 text-orange-600/80">
                <span className="">TCS + TDS (2%)</span>
                <span className="font-medium">-{formatCurrency(results.tcsAmount + results.tdsAmount)}</span>
            </div>

            {/* Platform & Marketing */}
            {(results.commissionAmount > 0 || results.adsAmount > 0) && (
                <div className="my-2 pt-2 border-t border-dashed border-gray-200">
                    {results.commissionAmount > 0 && (
                        <div className="flex justify-between py-1 text-purple-600/80">
                            <span>Commission + GST</span>
                            <span>-{formatCurrency(results.commissionAmount)}</span>
                        </div>
                    )}
                    {results.adsAmount > 0 && (
                         <div className="flex justify-between py-1 text-purple-600/80">
                            <span>Ads Cost + GST</span>
                            <span>-{formatCurrency(results.adsAmount)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden Costs */}
            {results.returnOverhead > 0 && (
                <div className="flex justify-between py-2 bg-orange-50 px-2 rounded-lg my-1">
                     <span className="text-orange-800 flex items-center gap-1 text-xs">
                        <AlertCircle size={12}/> Est. Return Loss
                     </span>
                     <span className="font-bold text-orange-800">-{formatCurrency(results.returnOverhead)}</span>
                </div>
            )}

             <div className="flex justify-between py-3 mt-2 border-t border-gray-200">
                <span className="font-bold text-gray-800">Bank Settlement</span>
                <span className="font-bold text-meesho-pink">{formatCurrency(results.totalSettlement)}</span>
            </div>
        </div>
      )}
    </div>
  );
};