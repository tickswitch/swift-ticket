export const MAX_MARKUP = 1.2;
export const SELLER_FEE = 0.05;
export const BUYER_SERVICE_FEE = 0.06;
export const BUYER_TRANSACTION_FEE = 0.03;

export const priceCap = {
  maxListingPrice: (faceValue: number): number =>
    Math.floor(faceValue * MAX_MARKUP),

  sellerFee: (listingPrice: number): number =>
    Math.ceil(listingPrice * SELLER_FEE),

  sellerReceives: (listingPrice: number): number =>
    listingPrice - Math.ceil(listingPrice * SELLER_FEE),

  buyerServiceFee: (listingPrice: number): number =>
    Math.ceil(listingPrice * BUYER_SERVICE_FEE),

  buyerTransactionFee: (listingPrice: number): number =>
    Math.ceil(listingPrice * BUYER_TRANSACTION_FEE),

  totalBuyerPays: (listingPrice: number): number =>
    listingPrice +
    Math.ceil(listingPrice * BUYER_SERVICE_FEE) +
    Math.ceil(listingPrice * BUYER_TRANSACTION_FEE),

  // kept for backward compatibility
  buyerFee: (listingPrice: number): number =>
    Math.ceil(listingPrice * BUYER_SERVICE_FEE),

  markupPercent: (faceValue: number, listingPrice: number): number =>
    Math.round(((listingPrice - faceValue) / faceValue) * 100),

  isWithinCap: (faceValue: number, listingPrice: number): boolean =>
    listingPrice <= Math.floor(faceValue * MAX_MARKUP),
};
