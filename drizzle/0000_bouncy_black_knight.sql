CREATE TABLE `allergens` (
	`id` integer PRIMARY KEY NOT NULL,
	`beef` integer,
	`egg` integer,
	`fish` integer,
	`peanuts` integer,
	`pork` integer,
	`shellfish` integer,
	`soy` integer,
	`tree_nuts` integer,
	`wheat` integer,
	`sesame_seeds` integer,
	`vegan` integer,
	`vegetarian` integer,
	`halal` integer,
	`milk` integer
);
--> statement-breakpoint
CREATE TABLE `food_item` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`link` text,
	`menu_category_id` integer,
	`nutrition_id` integer,
	`allergens_id` integer,
	FOREIGN KEY (`menu_category_id`) REFERENCES `menu_category`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nutrition_id`) REFERENCES `nutrition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`allergens_id`) REFERENCES `allergens`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `location` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `menu` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`location_id` integer,
	FOREIGN KEY (`location_id`) REFERENCES `location`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `menu_category` (
	`id` integer PRIMARY KEY NOT NULL,
	`menu_id` integer,
	`title` text,
	FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `nutrition` (
	`id` integer PRIMARY KEY NOT NULL,
	`calories` text,
	`total_fat` text,
	`saturated_fat` text,
	`cholesterol` text,
	`sodium` text,
	`total_carbohydrates` text,
	`dietary_fiber` text,
	`total_sugars` text,
	`protein` text,
	`vitamin_d` text,
	`calcium` text,
	`iron` text,
	`potassium` text,
	`ingredients` text,
	`trans_fat` text
);
