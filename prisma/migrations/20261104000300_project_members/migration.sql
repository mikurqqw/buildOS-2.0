CREATE TABLE "ProjectMember" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "companyId" TEXT NOT NULL,
 "projectId" TEXT NOT NULL,
 "userId" TEXT NOT NULL,
 FOREIGN KEY ("projectId","companyId") REFERENCES "Project"("id","companyId") ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY ("userId","companyId") REFERENCES "User"("id","companyId") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key" ON "ProjectMember"("projectId","userId");
CREATE INDEX "ProjectMember_companyId_userId_idx" ON "ProjectMember"("companyId","userId");
