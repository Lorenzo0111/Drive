-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "folder" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "File_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("createdAt", "folder", "id", "name", "parentId", "path", "public", "size", "type", "userId") SELECT "createdAt", "folder", "id", "name", "parentId", "path", "public", "size", "type", "userId" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
