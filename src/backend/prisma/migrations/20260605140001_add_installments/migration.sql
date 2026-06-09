-- Add installments column to recurring tables

ALTER TABLE "RecurringExpense" ADD COLUMN "installments" INTEGER;

ALTER TABLE "RecurringRevenue" ADD COLUMN "installments" INTEGER;
