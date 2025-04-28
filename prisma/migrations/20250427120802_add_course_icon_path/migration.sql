/*
  Warnings:

  - Added the required column `iconPath` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconPath" TEXT NOT NULL,
    "buildAt" TEXT NOT NULL
);
INSERT INTO "new_courses" ("buildAt", "description", "id", "name") SELECT "buildAt", "description", "id", "name" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE UNIQUE INDEX "courses_id_key" ON "courses"("id");
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
