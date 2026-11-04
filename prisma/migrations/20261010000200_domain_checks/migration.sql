-- Constraints intentionally maintained in SQL because Prisma 6 cannot express CHECK clauses.
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_budget_nonnegative" CHECK ("estimatedBudget" >= 0);
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_score_range" CHECK ("aiTenderScore" IS NULL OR "aiTenderScore" BETWEEN 0 AND 100);
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_margin_range" CHECK ("aiMarginPercent" IS NULL OR "aiMarginPercent" BETWEEN 0 AND 100);
ALTER TABLE "Project" ADD CONSTRAINT "Project_budget_nonnegative" CHECK ("budget" >= 0);
ALTER TABLE "Project" ADD CONSTRAINT "Project_progress_range" CHECK ("progress" BETWEEN 0 AND 100);
ALTER TABLE "Project" ADD CONSTRAINT "Project_date_order" CHECK ("endDate" >= "startDate");
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_labor_range" CHECK ("laborCount" BETWEEN 0 AND 10000);
ALTER TABLE "Document" ADD CONSTRAINT "Document_version_positive" CHECK ("version" >= 1);
