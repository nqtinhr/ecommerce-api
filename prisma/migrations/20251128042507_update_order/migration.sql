/*
  Warnings:

  - You are about to drop the column `images` on the `ProductSKUSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ProductSKUSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductSKUSnapshot` table. All the data in the column will be lost.
  - Added the required column `receiver` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `ProductSKUSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productTranslations` to the `ProductSKUSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ProductSKUSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuPrice` to the `ProductSKUSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "receiver" JSONB NOT NULL,
ADD COLUMN     "shopId" INTEGER;

-- AlterTable
ALTER TABLE "ProductSKUSnapshot" DROP COLUMN "images",
DROP COLUMN "price",
DROP COLUMN "updatedAt",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "productId" INTEGER,
ADD COLUMN     "productTranslations" JSONB NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "skuPrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "_OrderToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderToProduct_B_index" ON "_OrderToProduct"("B");

-- CreateIndex
CREATE INDEX "Order_status_deletedAt_idx" ON "Order"("status", "deletedAt");

-- AddForeignKey
ALTER TABLE "ProductSKUSnapshot" ADD CONSTRAINT "ProductSKUSnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_OrderToProduct" ADD CONSTRAINT "_OrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProduct" ADD CONSTRAINT "_OrderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
