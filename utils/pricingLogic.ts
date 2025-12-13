import { CalculationResult, InputState } from '../types';

/**
 * Advanced Reverse Calculation for Meesho & Flipkart
 */
export const calculateSmartPrice = (inputs: InputState): CalculationResult => {
  const isFlipkart = inputs.marketplace === 'FLIPKART';

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
  
  // Flipkart Specifics
  const collPercent = isFlipkart ? (Number(inputs.collectionPercent) || 0) : 0;
  const fixedFee = isFlipkart ? (Number(inputs.fixedFee) || 0) : 0;

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
  // We solve: SP * Factor = ConstantCosts
  // Factor accounts for % based fees and taxes derived from SP.
  
  // GST on Product acts on Taxable Value (TV).
  // SP = TV * (1 + gstDecimal)
  
  // Platform Fees (Commission, Collection, Ads) are usually on SP (Inclusive of tax) for Flipkart/Meesho standard calculations.
  // NOTE: Flipkart charges Commission on Order Value (SP). Collection on Order Value (SP).
  // GST on Services (18%) is charged on (Commission + Collection + Fixed + Shipping + Ads).
  
  // TCS (1%) + TDS (1%) is charged on Taxable Value (TV).
  // TCS_TDS = 0.02 * TV = 0.02 * (SP / (1 + gstDecimal))

  // Platform Fee Sum (Percentage based)
  const percentFeeSum = commDecimal + collDecimal + adsDecimal;
  
  // Total Deductions Equation:
  // Deductions = (percentFeeSum * SP) + FixedFee + ShippingFee
  // GST on Deductions = 0.18 * Deductions
  // Total Platform Deduction = 1.18 * [(percentFeeSum * SP) + FixedFee + ShippingFee]
  
  // Total Taxes = GST_Product (SP - TV) + TCS_TDS
  // But strictly speaking, "Settlement" usually excludes GST_Product because the marketplace collects it but the seller has to pay it. 
  // However, for "Net Profit", we treat GST collected as a liability, not income. 
  // Let's stick to Bank Settlement approach.
  // Bank Settlement = SP - GST_Product - TCS_TDS - Total_Platform_Deduction
  
  // We want: Bank Settlement - SellerDirectCost - ReturnOverhead = Margin
  
  // Return Overhead Estimate: 
  // loss per return approx = ShippingFee (Forward + Reverse usually) + Packaging + percent of marketing spend.
  // For simplicity in this reverse calc: ReturnOverhead = returnDecimal * (SellerDirectCost + ShippingFee*2 + FixedFee)
  // (A simplified heuristic to ensure safety buffer).
  // Let's refine Return Overhead to be proportional to price to be safer:
  // ReturnOverhead = returnDecimal * (SP * 0.2) -- heavy simplification? 
  // Let's stick to the previous logic: Return Overhead = returnDecimal * (BaseCosts + PlatformFees)
  
  // --- ALGEBRAIC SOLVER ---
  
  // Constant Costs needed to be covered:
  const constantCosts = sellerDirectCost + margin;
  
  // Fixed Platform Costs (Shipping + FixedFee)
  const fixedPlatformBase = shipFee + fixedFee;
  const fixedPlatformTotal = fixedPlatformBase * 1.18; // Including 18% GST on services

  // The equation:
  // SP - (SP - SP/(1+gstDecimal)) - (0.02 * SP/(1+gstDecimal)) - 1.18*(percentFeeSum * SP) - fixedPlatformTotal - ReturnOverhead = constantCosts
  
  // Let's treat ReturnOverhead as a % buffer on the whole Cost Structure for safety.
  // Effective Cost = (ConstantCosts + FixedPlatformTotal) * (1 + returnDecimal)
  
  // Simplified Equation:
  // NetRealizationPerSale = SP - GST_Liability - TCS_TDS - Platform_Fees_With_GST
  
  // 1. GST Liability part:
  // GST_Liability = SP - (SP / (1+gstDecimal)) = SP * (1 - 1/(1+gstDecimal))
  
  // 2. TCS/TDS part:
  // 0.02 * (SP / (1+gstDecimal))
  
  // 3. Platform Fees part:
  // 1.18 * SP * percentFeeSum + 1.18 * fixedPlatformBase
  
  // Combine all SP coefficients (The Denominator):
  // Coeff = 1 - (1 - 1/(1+gstDecimal)) - (0.02/(1+gstDecimal)) - 1.18*percentFeeSum
  // Coeff = 1 - 1 + 1/(1+gstDecimal) - 0.02/(1+gstDecimal) - 1.18*percentFeeSum
  // Coeff = (0.98 / (1+gstDecimal)) - 1.18*percentFeeSum
  
  // The Numerator:
  // ConstantCosts + (1.18 * fixedPlatformBase)
  // Add Return Overhead Logic: We need to inflate the required revenue to cover returns.
  // Total Revenue Needed = (ConstantCosts + 1.18*fixedPlatformBase) + (ReturnRate * TotalCost)
  // This gets circular. Let's apply ReturnRate multiplier to the base costs.
  
  const numerator = (constantCosts + fixedPlatformTotal) * (1 + returnDecimal * 1.5); // 1.5 multiplier for safety on return logistics
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
  const tcsTdsBase = finalTaxableValue * 0.02; // 1% TCS + 1% TDS

  // Fees
  const commBase = finalListingPrice * commDecimal;
  const collBase = finalListingPrice * collDecimal;
  const adsBase = finalListingPrice * adsDecimal;
  
  const feesBaseTotal = commBase + collBase + adsBase + fixedFee + shipFee;
  const gstOnFees = feesBaseTotal * 0.18;
  
  const totalDeductions = feesBaseTotal + gstOnFees + tcsTdsBase + gstAmount;
  
  // Specific Amounts for UI
  const commissionTotal = commBase * 1.18;
  const collectionTotal = collBase * 1.18;
  const fixedFeeTotal = fixedFee * 1.18;
  const shippingTotal = shipFee * 1.18;
  const adsTotal = adsBase * 1.18;

  // Return Overhead (Calculated backwards)
  // Loss on a return ~ Forward Ship + Reverse Ship (assumed same) + Packaging + Dead Marketing
  const estimatedReturnLossPerUnit = (shipFee * 2) + pack + (adsBase * 1.18);
  const returnOverhead = estimatedReturnLossPerUnit * returnDecimal;

  // Settlement
  // Bank Settlement typically implies: Listing Price - Deductions (Fees + GST on Fees + TCS/TDS + GST Product)
  // Note: Marketplaces deduct GST on Product from the payout usually (Tax Collection at Source model is different, but they deduct the tax liability to pay gov or you pay. 
  // To keep "Settlement" meaning "Amount hitting bank":
  // Settlement = ListingPrice - (Commission+GST) - (Coll+GST) - (Fixed+GST) - (Ship+GST) - (Ads+GST) - TCS/TDS - GST_Liability
  
  // WAIT: Sellers usually pay GST Liability separately via GSTR-3B using collected tax. 
  // Marketplaces deduct Fees and TCS/TDS. They DO NOT deduct the 18% Product GST (unless specific models).
  // However, for "Net Profit" calculation, the seller MUST treat Product GST as an expense (pass-through).
  // The UI shows "Settlement" (Bank Payout) and "Net Profit".
  
  // Bank Payout (Approx) = SP - (All Platform Fees incl GST) - TCS/TDS
  const bankSettlement = finalListingPrice - (feesBaseTotal * 1.18) - tcsTdsBase;
  
  // Net Profit = BankSettlement - ProductGST - ProductCost - Pack - Other - ReturnOverhead
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