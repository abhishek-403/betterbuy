/*
  Warnings:

  - You are about to drop the `PricePoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PricePoint" DROP CONSTRAINT "PricePoint_productId_fkey";

-- DropTable
DROP TABLE "PricePoint";

-- CreateTable
CREATE TABLE "Pricecheckpoints" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Pricecheckpoints_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pricecheckpoints" ADD CONSTRAINT "Pricecheckpoints_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
