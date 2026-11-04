ALTER TABLE "Issue" ADD COLUMN "reporterId" TEXT;
CREATE TABLE "IssueHistory" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "issueId" TEXT NOT NULL,
 "companyId" TEXT NOT NULL,
 "projectId" TEXT NOT NULL,
 "actorId" TEXT,
 "fromStatus" "IssueStatus" NOT NULL,
 "toStatus" "IssueStatus" NOT NULL,
 "note" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY ("issueId","projectId","companyId") REFERENCES "Issue"("id","projectId","companyId") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IssueHistory_companyId_projectId_issueId_idx" ON "IssueHistory"("companyId","projectId","issueId");
