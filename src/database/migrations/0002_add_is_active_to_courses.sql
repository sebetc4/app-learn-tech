ALTER TABLE courses ADD COLUMN is_active integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE INDEX courses_is_active_idx ON courses(is_active);