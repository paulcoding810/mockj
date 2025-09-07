CREATE TABLE `json` (
	`id` text PRIMARY KEY NOT NULL,
	`json` text(3000) NOT NULL,
	`createdAt` integer NOT NULL,
	`modifiedAt` integer,
	`expires` integer NOT NULL
);
