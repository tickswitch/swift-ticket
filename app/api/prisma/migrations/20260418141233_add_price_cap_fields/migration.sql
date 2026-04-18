-- AlterTable
ALTER TABLE "resale_tickets" ADD COLUMN     "buyer_fee" DECIMAL(10,2),
ADD COLUMN     "max_allowed_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "original_face_value" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "seller_fee" DECIMAL(10,2),
ADD COLUMN     "seller_receives" DECIMAL(10,2),
ADD COLUMN     "total_buyer_pays" DECIMAL(10,2);

