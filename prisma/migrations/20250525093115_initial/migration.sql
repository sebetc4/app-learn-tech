/*
  Warnings:

  - You are about to drop the column `lesson_id` on the `course_progress` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `course_progress` table. All the data in the column will be lost.
  - You are about to drop the column `completed_course` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `total_course` on the `lesson_progress` table. All the data in the column will be lost.
  - Added the required column `completed_course` to the `course_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `course_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_course` to the `course_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_id` to the `lesson_progress` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_course_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total_course" INTEGER NOT NULL,
    "completed_course" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "course_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_course_progress" ("course_id", "id", "user_id") SELECT "course_id", "id", "user_id" FROM "course_progress";
DROP TABLE "course_progress";
ALTER TABLE "new_course_progress" RENAME TO "course_progress";
CREATE TABLE "new_lesson_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "course_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "lesson_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lesson_progress" ("course_id", "id", "user_id") SELECT "course_id", "id", "user_id" FROM "lesson_progress";
DROP TABLE "lesson_progress";
ALTER TABLE "new_lesson_progress" RENAME TO "lesson_progress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
