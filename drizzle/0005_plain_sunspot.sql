CREATE TABLE `location_type` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `location_type_name_unique` ON `location_type` (`name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_location` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`colloquial_name` text,
	`description` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`type_id` text NOT NULL,
	`regular_service_hours` text DEFAULT '{}' NOT NULL,
	`methods_of_payment` text DEFAULT '[]' NOT NULL,
	`meal_times` text DEFAULT '[]' NOT NULL,
	`google_maps_link` text DEFAULT '' NOT NULL,
	`apple_maps_link` text DEFAULT '' NOT NULL,
	`image` text,
	`force_close` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`type_id`) REFERENCES `location_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_location`("id", "name", "colloquial_name", "description", "address", "type_id", "regular_service_hours", "methods_of_payment", "meal_times", "google_maps_link", "apple_maps_link", "image", "force_close", "created_at", "updated_at") SELECT "id", "name", "colloquial_name", "description", "address", "type_id", "regular_service_hours", "methods_of_payment", "meal_times", "google_maps_link", "apple_maps_link", "image", "force_close", "created_at", "updated_at" FROM `location`;--> statement-breakpoint
DROP TABLE `location`;--> statement-breakpoint
ALTER TABLE `__new_location` RENAME TO `location`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_menu` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`location_id` text,
	FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_menu`("id", "name", "location_id") SELECT "id", "name", "location_id" FROM `menu`;--> statement-breakpoint
DROP TABLE `menu`;--> statement-breakpoint
ALTER TABLE `__new_menu` RENAME TO `menu`;