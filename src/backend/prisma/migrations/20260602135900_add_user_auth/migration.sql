-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AccessLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "page" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "errorMessage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AccessLog_userId_idx" ON "AccessLog"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AccessLog_createdAt_idx" ON "AccessLog"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AccessLog_status_idx" ON "AccessLog"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AccessLog_action_idx" ON "AccessLog"("action");

-- AlterTable: add userId to existing tables
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "userId" UUID;
ALTER TABLE "OccasionalExpense" ADD COLUMN IF NOT EXISTS "userId" UUID;
ALTER TABLE "RecurringExpense" ADD COLUMN IF NOT EXISTS "userId" UUID;
ALTER TABLE "OccasionalRevenue" ADD COLUMN IF NOT EXISTS "userId" UUID;
ALTER TABLE "RecurringRevenue" ADD COLUMN IF NOT EXISTS "userId" UUID;

-- Seed default user for existing rows
INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES ('00000000-0000-4000-8000-000000000001', 'Default User', 'default@localhost', '$2b$10$placeholderhash000000000000000000000000000', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

UPDATE "Category" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "OccasionalExpense" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "RecurringExpense" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "OccasionalRevenue" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "RecurringRevenue" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;

-- Drop old unique constraint on Category.name
DROP INDEX IF EXISTS "Category_name_key";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_userId_key" ON "Category"("name", "userId");
CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");
CREATE INDEX IF NOT EXISTS "OccasionalExpense_userId_idx" ON "OccasionalExpense"("userId");
CREATE INDEX IF NOT EXISTS "RecurringExpense_userId_idx" ON "RecurringExpense"("userId");
CREATE INDEX IF NOT EXISTS "OccasionalRevenue_userId_idx" ON "OccasionalRevenue"("userId");
CREATE INDEX IF NOT EXISTS "RecurringRevenue_userId_idx" ON "RecurringRevenue"("userId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'AccessLog_userId_fkey') THEN
        ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Category_userId_fkey') THEN
        ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'OccasionalExpense_userId_fkey') THEN
        ALTER TABLE "OccasionalExpense" ADD CONSTRAINT "OccasionalExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'RecurringExpense_userId_fkey') THEN
        ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'OccasionalRevenue_userId_fkey') THEN
        ALTER TABLE "OccasionalRevenue" ADD CONSTRAINT "OccasionalRevenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'RecurringRevenue_userId_fkey') THEN
        ALTER TABLE "RecurringRevenue" ADD CONSTRAINT "RecurringRevenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
