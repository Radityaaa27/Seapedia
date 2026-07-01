/*
  Warnings:

  - You are about to drop the column `DeliveryMethod` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "DeliveryMethod",
ADD COLUMN     "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'REGULAR';
