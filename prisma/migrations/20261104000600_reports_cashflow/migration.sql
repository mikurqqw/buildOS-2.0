ALTER TABLE "DailyReport" ADD COLUMN "clientId" TEXT;
CREATE UNIQUE INDEX "DailyReport_clientId_key" ON "DailyReport"("clientId");
CREATE TABLE "CashFlow" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "companyId" TEXT NOT NULL,
 "projectId" TEXT NOT NULL,
 "direction" TEXT NOT NULL CHECK ("direction" IN ('IN','OUT')),
 "amount" DECIMAL(18,2) NOT NULL CHECK ("amount">0),
 "date" TIMESTAMP(3) NOT NULL,
 "note" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY ("projectId","companyId") REFERENCES "Project"("id","companyId") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "CashFlow_companyId_projectId_date_idx" ON "CashFlow"("companyId","projectId","date");
