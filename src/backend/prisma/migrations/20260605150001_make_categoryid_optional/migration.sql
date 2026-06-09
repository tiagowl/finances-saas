-- Make categoryId optional on revenue tables

-- DropForeignKey
ALTER TABLE "OccasionalRevenue" DROP CONSTRAINT "OccasionalRevenue_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringRevenue" DROP CONSTRAINT "RecurringRevenue_categoryId_fkey";

-- AlterTable
ALTER TABLE "OccasionalRevenue" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecurringRevenue" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OccasionalRevenue" ADD CONSTRAINT "OccasionalRevenue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringRevenue" ADD CONSTRAINT "RecurringRevenue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
