// Server-side mirror of app/web/src/utils/priceCap.ts.
// Fee math MUST stay in sync with the frontend so the amount the buyer is
// shown equals the amount actually charged, and the seller payout matches
// what the seller was quoted at listing time.
export const MAX_MARKUP = 1.2;
export const SELLER_FEE_RATE = 0.06;
export const BUYER_FEE_RATE = 0.06;
export const MIN_FEE = 25;

const applyFee = (price: number, rate: number): number =>
  Math.max(MIN_FEE, Math.ceil(price * rate));

export const maxListingPrice = (faceValue: number): number =>
  Math.floor(faceValue * MAX_MARKUP);

export const buyerFee = (listingPrice: number): number =>
  applyFee(listingPrice, BUYER_FEE_RATE);

export const sellerFee = (listingPrice: number): number =>
  applyFee(listingPrice, SELLER_FEE_RATE);

export const totalBuyerPays = (listingPrice: number): number =>
  listingPrice + buyerFee(listingPrice);

export const sellerReceives = (listingPrice: number): number =>
  listingPrice - sellerFee(listingPrice);
