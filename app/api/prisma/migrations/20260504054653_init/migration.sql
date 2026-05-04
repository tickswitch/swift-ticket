/*
  Warnings:

  - Made the column `buyer_fee` on table `resale_tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seller_fee` on table `resale_tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seller_receives` on table `resale_tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_buyer_pays` on table `resale_tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "resale_tickets" ADD COLUMN     "whatsapp_sent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "buyer_fee" SET NOT NULL,
ALTER COLUMN "buyer_fee" SET DEFAULT 0,
ALTER COLUMN "max_allowed_price" SET DEFAULT 0,
ALTER COLUMN "original_face_value" SET DEFAULT 0,
ALTER COLUMN "seller_fee" SET NOT NULL,
ALTER COLUMN "seller_fee" SET DEFAULT 0,
ALTER COLUMN "seller_receives" SET NOT NULL,
ALTER COLUMN "seller_receives" SET DEFAULT 0,
ALTER COLUMN "total_buyer_pays" SET NOT NULL,
ALTER COLUMN "total_buyer_pays" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "raised_by_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);
