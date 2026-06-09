-- AlterTable: make userId NOT NULL (data already populated)

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "OccasionalExpense" DROP CONSTRAINT "OccasionalExpense_userId_fkey";

-- DropForeignKey
ALTER TABLE "OccasionalRevenue" DROP CONSTRAINT "OccasionalRevenue_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringExpense" DROP CONSTRAINT "RecurringExpense_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringRevenue" DROP CONSTRAINT "RecurringRevenue_userId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OccasionalExpense" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OccasionalRevenue" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecurringExpense" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecurringRevenue" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionalExpense" ADD CONSTRAINT "OccasionalExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionalRevenue" ADD CONSTRAINT "OccasionalRevenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringRevenue" ADD CONSTRAINT "RecurringRevenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;