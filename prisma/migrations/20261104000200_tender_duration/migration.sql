ALTER TABLE "Tender" ADD COLUMN "durationMonths" INTEGER NOT NULL DEFAULT 18;
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_duration_range" CHECK ("durationMonths" BETWEEN 1 AND 120);
