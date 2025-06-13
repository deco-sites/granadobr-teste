CREATE TABLE `cart` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`json` text
);
--> statement-breakpoint
CREATE TABLE `images` (
	`sku` text,
	`url` integer,
	`alternate_name` integer,
	`encoding_format` integer,
	FOREIGN KEY (`sku`) REFERENCES `products`(`sku`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`sku` text,
	`availability` text NOT NULL,
	`gtin` text,
	`inventory_level` integer NOT NULL,
	`item_condition` text,
	`price` real NOT NULL,
	`price_currency` text,
	`price_valid_until` text,
	`seller` text,
	`seller_name` text,
	FOREIGN KEY (`sku`) REFERENCES `products`(`sku`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `price_specification` (
	`offer_id` text,
	`price` real NOT NULL,
	`price_currency` text,
	`price_type` text,
	`description` text,
	`billing_duration` integer,
	`billing_increment` real,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_groups` (
	`product_group_id` text PRIMARY KEY NOT NULL,
	`name` text,
	`url` text
);
--> statement-breakpoint
CREATE TABLE `product_property` (
	`sku` text,
	`property_id` text,
	PRIMARY KEY(`sku`, `property_id`),
	FOREIGN KEY (`sku`) REFERENCES `products`(`sku`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`product_id` text NOT NULL,
	`name` text,
	`url` text,
	`category` text,
	`sku` text PRIMARY KEY NOT NULL,
	`production_date` text,
	`release_date` text,
	`gtin` text,
	`award` text,
	`in_product_group_with_id` text,
	`brand` integer,
	`rating_count` integer,
	`review_count` integer,
	`rating_value` integer,
	`best_rating` integer,
	`worst_rating` integer,
	`rating_explanation` text,
	`high_price` real,
	`low_price` real,
	`offer_count` integer,
	`price_currency` text,
	`description` text,
	FOREIGN KEY (`in_product_group_with_id`) REFERENCES `product_groups`(`product_group_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`max_value` real,
	`min_value` real,
	`property_id` real,
	`unit_code` text,
	`unit_text` text,
	`value_reference` text
);
