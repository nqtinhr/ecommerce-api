/*
  Warnings:

  - You are about to drop the column `base_price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `virtual_price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `SKU` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `virtualPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `SKU` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "base_price",
DROP COLUMN "virtual_price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" VARCHAR(500) NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "virtualPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SKU" DROP COLUMN "images",
ADD COLUMN     "image" TEXT NOT NULL;

CREATE UNIQUE INDEX "ProductTranslation_productId_languageId_unique"
ON "ProductTranslation" ("productId", "languageId")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "SKU_productId_value_unique"
ON "SKU" ("productId", "value")
WHERE "deletedAt" IS NULL;