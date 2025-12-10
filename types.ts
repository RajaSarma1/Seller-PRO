export enum GST_RATE {
  ZERO = 0,
  THREE = 3,
  FIVE = 5,
  TWELVE = 12,
  EIGHTEEN = 18,
  TWENTYEIGHT = 28
}

export interface CalculationResult {
  listingPrice: number;
  taxableValue: number;
  gstAmount: number;
  tcsAmount: number;
  tdsAmount: number;
  commissionAmount: number;
  adsAmount: number;
  returnOverhead: number;
  totalSettlement: number;
  netProfit: number;
  roi: number;
}

export interface InputState {
  productCost: number | '';
  gstPaidOnProduct: number | ''; // GST Amount paid to supplier
  shippingCost: number | ''; // Seller shipping cost
  packagingCost: number | '';
  otherExpenses: number | '';
  desiredMargin: number | '';
  gstRate: GST_RATE;
  commissionPercent: number | '';
  returnRatePercent: number | '';
  adsPercent: number | '';
}