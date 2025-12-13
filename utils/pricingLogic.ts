import { CalculationResult, InputState } from '../types';

/**
 * Advanced Reverse Calculation for Meesho, Flipkart & Amazon
 */
export const calculateSmartPrice = (inputs: InputState): CalculationResult => {
  const isFlipkart = inputs.marketplace === 'FLIPKART';
  const isAmazon = inputs.marketplace === 'AMAZON';

  // Common Inputs
  const pc = Number(inputs.productCost) || 0;
  const pack = Number(inputs.packagingCost) || 0;
  const other = Number(inputs.otherExpenses) || 0;
  const shipFee = Number(inputs.shippingCost) || 0; // This is Platform Shipping Fee
  const margin = Number(inputs.desiredMargin) || 0;
  const gstPercent = Number(inputs.gstRate);
  
  // Percentages to decimals
  const commPercent = Number(inputs.commissionPercent) || 0;
  const adsPercent = Number(inputs.adsPercent) || 0;
  const returnRate = Number(inputs.returnRatePercent) || 0;
  
  // Marketplace Specifics
  // Collection Fee: Only Flipkart usually
  const collPercent = isFlipkart ? (Number(inputs.collectionPercent) || 0) : 0;
  
  // Fixed/Closing Fee: Flipkart and Amazon both have this
  const fixedFee = (isFlipkart || isAmazon) ? (Number(inputs.fixedFee) || 0) : 0;

  const commDecimal = commPercent / 100;
  const adsDecimal = adsPercent / 100;
  const collDecimal = collPercent / 100;
  const returnDecimal = returnRate / 100;
  const gstDecimal = gstPercent / 100;

  // --- LOGIC EXPLANATION ---
  // Target: We need a Listing Price (SP) such that:
  // SP - Deductions - Taxes = ProductCost + Packaging + Other + Margin + ReturnOverhead
  
  // 1. Direct Costs (Seller side)
  const sellerDirectCost = pc + pack + other;

  // 2. Determine Factor for SP
  // Platform Fee Sum (Percentage based)
  const percentFeeSum = commDecimal + collDecimal + adsDecimal;
  
  // Fixed Platform Costs (Shipping + FixedFee)
  const fixedPlatformBase = shipFee + fixedFee;
  const fixedPlatformTotal = fixedPlatformBase * 1.18; // Including 18% GST on services

  // Constant Costs needed to be covered:
  const constantCosts = sellerDirectCost + margin;
  
  // --- RETURN OVERHEAD LOGIC ---
  // Loss on a return usually includes:
  // 1. Forward Shipping (Platform Fee)
  // 2. Reverse Shipping (Assume approx same as Forward)
  // 3. Packaging Cost
  // 4. Marketing/Ads spend wasted
  // 5. Amazon Specific: Refund Administration Fee (Min of 20% of Referral Fee or ₹50)
  
  // We need to estimate Return Overhead to factor it into the required price.
  // Since Refund Admin Fee depends on Price -> Commission, it's circular. 
  // We will use a safe approximation for the algebraic step (adding a buffer) 
  // and then calculate exact value in the final breakdown.
  
  // Equation:
  // Numerator = (ConstantCosts + FixedPlatformTotal) * (1 + ReturnMultiplier)
  // Denominator = (0.98 / (1 + gstDecimal)) - (1.18 * percentFeeSum)
  
  const numerator = (constantCosts + fixedPlatformTotal) * (1 + returnDecimal * 1.5); 
  const denominator = (0.98 / (1 + gstDecimal)) - (1.18 * percentFeeSum);

  if (denominator <= 0.05) {
     return getEmptyResult();
  }

  const requiredSP = numerator / denominator;

  // --- FINAL BREAKDOWN CALCULATION ---
  const finalListingPrice = Math.ceil(requiredSP);
  const finalTaxableValue = finalListingPrice / (1 + gstDecimal);
  
  // Taxes
  const gstAmount = finalListingPrice - finalTaxableValue;
  // TCS/TDS: 
  // Flipkart/Meesho: ~2% (1% TCS GST + 1% TDS IT)
  // Amazon: ~1% TCS GST. TDS IT applies if turnover > limit. We keep 2% as safe standard buffer for all.
  const tcsTdsBase = finalTaxableValue * 0.02; 

  // Fees
  const commBase = finalListingPrice * commDecimal;
  const collBase = finalListingPrice * collDecimal;
  const adsBase = finalListingPrice * adsDecimal;
  
  const feesBaseTotal = commBase + collBase + adsBase + fixedFee + shipFee;
  const gstOnFees = feesBaseTotal * 0.18;
  
  // Specific Amounts for UI
  const commissionTotal = commBase * 1.18;
  const collectionTotal = collBase * 1.18;
  const fixedFeeTotal = fixedFee * 1.18;
  const shippingTotal = shipFee * 1.18;
  const adsTotal = adsBase * 1.18;

  // Exact Return Overhead Calculation
  let refundAdminFee = 0;
  if (isAmazon) {
      // Amazon Refund Administration Fee: Lower of (20% of Referral Fee) or (Rs 50)
      refundAdminFee = Math.min(commBase * 0.20, 50);
  }

  const estimatedReturnLossPerUnit = (shipFee * 2) + pack + (adsBase * 1.18) + refundAdminFee;
  const returnOverhead = estimatedReturnLossPerUnit * returnDecimal;

  // Bank Settlement (Approx) = SP - (All Platform Fees incl GST) - TCS/TDS
  const bankSettlement = finalListingPrice - (feesBaseTotal * 1.18) - tcsTdsBase;
  
  // Net Profit
  const netProfit = bankSettlement - gstAmount - pc - pack - other - returnOverhead;
  
  const roi = (pc + pack + other) > 0 ? (netProfit / (pc + pack + other)) * 100 : 0;

  return {
    listingPrice: finalListingPrice,
    taxableValue: finalTaxableValue,
    gstAmount: gstAmount,
    tcsAmount: finalTaxableValue * 0.01,
    tdsAmount: finalTaxableValue * 0.01,
    commissionAmount: commissionTotal,
    collectionAmount: collectionTotal,
    fixedFeeAmount: fixedFeeTotal,
    shippingAmount: shippingTotal,
    adsAmount: adsTotal,
    returnOverhead: returnOverhead,
    totalSettlement: bankSettlement,
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
    collectionAmount: 0,
    fixedFeeAmount: 0,
    shippingAmount: 0,
    adsAmount: 0,
    returnOverhead: 0,
    totalSettlement: 0,
    netProfit: 0,
    roi: 0
  };
}