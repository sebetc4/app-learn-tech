/*
  Warnings:

  - You are about to drop the column `jsx_path` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `video_path` on the `lessons` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "video_duration" INTEGER,
    "chapter_id" TEXT NOT NULL,
    CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lessons" ("chapter_id", "id", "name", "position", "type", "video_duration") SELECT "chapter_id", "id", "name", "position", "type", "video_duration" FROM "lessons";
DROP TABLE "lessons";
ALTER TABLE "new_lessons" RENAME TO "lessons";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
