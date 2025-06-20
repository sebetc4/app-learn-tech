CREATE TABLE `chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`course_id` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `code_snippets` (
	`id` text PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	`language` text NOT NULL,
	`extension` text NOT NULL,
	`lesson_id` text NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`folder_name` text NOT NULL,
	`build_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_folder_name_key` ON `courses` (`folder_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `courses_name_key` ON `courses` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `courses_id_key` ON `courses` (`id`);--> statement-breakpoint
CREATE TABLE `course_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`total_course` integer NOT NULL,
	`completed_course` integer NOT NULL,
	`percentage` integer NOT NULL,
	`course_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'IN_PROGRESS' NOT NULL,
	`course_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`video_duration` integer,
	`chapter_id` text NOT NULL,
	`course_id` text NOT NULL,
	FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`lesson_id` text NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`theme` text DEFAULT 'SYSTEM' NOT NULL
);
