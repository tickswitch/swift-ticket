export const MAX_MARKUP = 1.2;
export const PLATFORM_FEE = 0.05;

export const priceCap = {
  maxListingPrice: (faceValue: number): number =>
    Math.floor(faceValue * MAX_MARKUP),

  buyerFee: (listingPrice: number): number =>
    Math.ceil(listingPrice * PLATFORM_FEE),

  sellerFee: (listingPrice: number): number =>
    Math.ceil(listingPrice * PLATFORM_FEE),

  totalBuyerPays: (listingPrice: number): number =>
    listingPrice + Math.ceil(listingPrice * PLATFORM_FEE),

  sellerReceives: (listingPrice: number): number =>
    listingPrice - Math.ceil(listingPrice * PLATFORM_FEE),

  markupPercent: (faceValue: number, listingPrice: number): number =>
    Math.round(((listingPrice - faceValue) / faceValue) * 100),

  isWithinCap: (faceValue: number, listingPrice: number): boolean =>
    listingPrice <= Math.floor(faceValue * MAX_MARKUP),
};
