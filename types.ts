export enum GST_RATE {
  ZERO = 0,
  THREE = 3,
  FIVE = 5,
  TWELVE = 12,
  EIGHTEEN = 18,
  TWENTYEIGHT = 28
}

export type Marketplace = 'MEESHO' | 'FLIPKART';

export interface CalculationResult {
  listingPrice: number;
  taxableValue: number;
  gstAmount: number;
  tcsAmount: number;
  tdsAmount: number;
  commissionAmount: number;
  collectionAmount: number; // New for Flipkart
  fixedFeeAmount: number;   // New for Flipkart
  adsAmount: number;
  shippingAmount: number;   // Explicitly track platform shipping deduction
  returnOverhead: number;
  totalSettlement: number;
  netProfit: number;
  roi: number;
}

export interface InputState {
  marketplace: Marketplace;
  productCost: number | '';
  gstPaidOnProduct: number | ''; // GST Amount paid to supplier
  shippingCost: number | ''; // Platform Shipping Fee (e.g., National Shipping charge)
  packagingCost: number | '';
  otherExpenses: number | '';
  desiredMargin: number | '';
  gstRate: GST_RATE;
  commissionPercent: number | '';
  collectionPercent: number | ''; // New for Flipkart
  fixedFee: number | '';          // New for Flipkart (Closing Fee)
  returnRatePercent: number | '';
  adsPercent: number | '';
}