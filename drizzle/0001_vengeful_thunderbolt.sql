PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_location` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` text
);
--> statement-breakpoint
INSERT INTO `__new_location`("id", "name", "updated_at") SELECT "id", "name", "updated_at" FROM `location`;--> statement-breakpoint
DROP TABLE `location`;--> statement-breakpoint
ALTER TABLE `__new_location` RENAME TO `location`;--> statement-breakpoint
PRAGMA foreign_keys=ON;