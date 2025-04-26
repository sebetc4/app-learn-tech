/*
  Warnings:

  - You are about to drop the column `created_at` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `code_snippets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `code_snippets` table. All the data in the column will be lost.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `resources` table. All the data in the column will be lost.
  - Added the required column `buildAt` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chapters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_chapters" ("course_id", "id", "name", "position") SELECT "course_id", "id", "name", "position" FROM "chapters";
DROP TABLE "chapters";
ALTER TABLE "new_chapters" RENAME TO "chapters";
CREATE TABLE "new_code_snippets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    CONSTRAINT "code_snippets_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_code_snippets" ("extension", "id", "language", "lesson_id", "position") SELECT "extension", "id", "language", "lesson_id", "position" FROM "code_snippets";
DROP TABLE "code_snippets";
ALTER TABLE "new_code_snippets" RENAME TO "code_snippets";
CREATE TABLE "new_courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buildAt" TEXT NOT NULL
);
INSERT INTO "new_courses" ("description", "id", "name") SELECT "description", "id", "name" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE UNIQUE INDEX "courses_id_key" ON "courses"("id");
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");
CREATE TABLE "new_lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "html_path" TEXT,
    "video_path" TEXT,
    "chapter_id" TEXT NOT NULL,
    CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lessons" ("chapter_id", "html_path", "id", "name", "position", "type", "video_path") SELECT "chapter_id", "html_path", "id", "name", "position", "type", "video_path" FROM "lessons";
DROP TABLE "lessons";
ALTER TABLE "new_lessons" RENAME TO "lessons";
CREATE TABLE "new_resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    CONSTRAINT "resources_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_resources" ("id", "lesson_id", "type", "url") SELECT "id", "lesson_id", "type", "url" FROM "resources";
DROP TABLE "resources";
ALTER TABLE "new_resources" RENAME TO "resources";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
