import { CalculationResult, InputState } from '../types';

/**
 * Advanced Reverse Calculation for Meesho
 */
export const calculateSmartPrice = (inputs: InputState): CalculationResult => {
  const pc = Number(inputs.productCost) || 0;
  const ship = Number(inputs.shippingCost) || 0;
  const pack = Number(inputs.packagingCost) || 0;
  const other = Number(inputs.otherExpenses) || 0;
  
  const commPercent = Number(inputs.commissionPercent) || 0;
  const returnRate = Number(inputs.returnRatePercent) || 0;
  const adsPercent = Number(inputs.adsPercent) || 0;
  
  const margin = Number(inputs.desiredMargin) || 0;
  const gstPercent = Number(inputs.gstRate);

  // --- Definitions ---
  // We need to calculate Taxable Value (TV) such that:
  // Settlement - TotalCosts = DesiredMargin
  
  // New Logic for Return Overhead:
  // Return Overhead = ReturnRate% * (ProductCost + Shipping + Packaging + Other + Commission + Ads)
  // Note: Commission and Ads amounts are derived from TV.
  
  const commDecimal = commPercent / 100;
  const adsDecimal = adsPercent / 100;
  const returnDecimal = returnRate / 100;
  const gstDecimal = gstPercent / 100;

  // Base Direct Costs (Product + Shipping + Packaging + Other)
  const baseDirectCost = pc + ship + pack + other;

  // --- Derivation of Taxable Value (TV) ---
  
  // 1. Settlement Formula:
  // Settlement = TV - Deductions
  // Deductions = TCS(1%) + TDS(1%) + (Commission + GST) + (Ads + GST)
  // Deductions = 0.02*TV + commDecimal*TV*1.18 + adsDecimal*TV*1.18
  // Settlement = TV * [0.98 - 1.18*(commDecimal + adsDecimal)]

  // 2. Cost Coverage Requirement:
  // Required Settlement = BaseDirectCost + ReturnOverhead + Margin
  // ReturnOverhead = returnDecimal * (BaseDirectCost + CommissionAmount + AdsAmount)
  // CommissionAmount = commDecimal * TV
  // AdsAmount = adsDecimal * TV
  // ReturnOverhead = returnDecimal * (BaseDirectCost + TV*(commDecimal + adsDecimal))
  
  // So:
  // Required Settlement = BaseDirectCost + [returnDecimal * (BaseDirectCost + TV*(commDecimal + adsDecimal))] + Margin
  // Required Settlement = BaseDirectCost * (1 + returnDecimal) + Margin + TV * [returnDecimal * (commDecimal + adsDecimal)]

  // 3. Solving for TV:
  // TV * [0.98 - 1.18*(commDecimal + adsDecimal)] = BaseDirectCost * (1 + returnDecimal) + Margin + TV * [returnDecimal * (commDecimal + adsDecimal)]
  // TV * [0.98 - 1.18*(commDecimal + adsDecimal) - returnDecimal*(commDecimal + adsDecimal)] = BaseDirectCost * (1 + returnDecimal) + Margin
  // TV * [0.98 - (commDecimal + adsDecimal) * (1.18 + returnDecimal)] = BaseDirectCost * (1 + returnDecimal) + Margin

  const platformFeeFactor = commDecimal + adsDecimal;
  const denominator = 0.98 - (platformFeeFactor * (1.18 + returnDecimal));

  // Safety check for impossible margins/high fees
  if (denominator <= 0.01) {
     return getEmptyResult();
  }

  const numerator = (baseDirectCost * (1 + returnDecimal)) + margin;
  const requiredTaxableValue = numerator / denominator;

  // --- Calculate Final Breakdown (Recalculate from Rounded Price) ---
  const finalListingPrice = Math.ceil(requiredTaxableValue * (1 + gstDecimal));
  const finalTaxableValue = finalListingPrice / (1 + gstDecimal);
  
  // Tax Components
  const gstAmount = finalListingPrice - finalTaxableValue;
  const tcsAmount = finalTaxableValue * 0.01;
  const tdsAmount = finalTaxableValue * 0.01;
  
  // Platform Fee Components
  const commissionBase = finalTaxableValue * commDecimal;
  const gstOnCommission = commissionBase * 0.18;
  const commissionTotal = commissionBase + gstOnCommission;
  
  const adsBase = finalTaxableValue * adsDecimal;
  const gstOnAds = adsBase * 0.18;
  const adsTotal = adsBase + gstOnAds;

  // Return Overhead (Calculated based on actual parameters)
  const returnOverhead = returnDecimal * (baseDirectCost + commissionBase + adsBase);

  // Settlement and Profit Confirmation
  const totalSettlement = finalListingPrice - gstAmount - tcsAmount - tdsAmount - commissionTotal - adsTotal;
  const netProfit = totalSettlement - (baseDirectCost + returnOverhead);
  
  const roi = baseDirectCost > 0 ? (netProfit / baseDirectCost) * 100 : 0;

  return {
    listingPrice: finalListingPrice,
    taxableValue: finalTaxableValue,
    gstAmount: gstAmount,
    tcsAmount: tcsAmount,
    tdsAmount: tdsAmount,
    commissionAmount: commissionTotal,
    adsAmount: adsTotal,
    returnOverhead: returnOverhead,
    totalSettlement: totalSettlement,
    netProfit: netProfit,
    roi: roi
  };
};

function getEmptyResult(): CalculationResult {
  return {
    listingPrice: 0,
    taxableValue: 0,
    gstAmount: 0,
    tcsAmount: 0,
    tdsAmount: 0,
    commissionAmount: 0,
    adsAmount: 0,
    returnOverhead: 0,
    totalSettlement: 0,
    netProfit: 0,
    roi: 0
  };
}