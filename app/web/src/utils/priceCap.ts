export const MAX_MARKUP = 1.2;
export const SELLER_FEE_RATE = 0.06;
export const BUYER_FEE_RATE = 0.06;
export const MIN_FEE = 25;

const applyFee = (price: number, rate: number): number =>
  Math.max(MIN_FEE, Math.ceil(price * rate));

export const priceCap = {
  maxListingPrice: (faceValue: number): number =>
    Math.floor(faceValue * MAX_MARKUP),

  sellerFee: (listingPrice: number): number =>
    applyFee(listingPrice, SELLER_FEE_RATE),

  sellerReceives: (listingPrice: number): number =>
    listingPrice - applyFee(listingPrice, SELLER_FEE_RATE),

  buyerFee: (listingPrice: number): number =>
    applyFee(listingPrice, BUYER_FEE_RATE),

  totalBuyerPays: (listingPrice: number): number =>
    listingPrice + applyFee(listingPrice, BUYER_FEE_RATE),

  markupPercent: (faceValue: number, listingPrice: number): number =>
    Math.round(((listingPrice - faceValue) / faceValue) * 100),

  isWithinCap: (faceValue: number, listingPrice: number): boolean =>
    listingPrice <= Math.floor(faceValue * MAX_MARKUP),
};
