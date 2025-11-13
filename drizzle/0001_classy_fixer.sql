CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`language` enum('en','sw') NOT NULL,
	`audioUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `helpCenters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(200) NOT NULL,
	`nameSw` varchar(200) NOT NULL,
	`descriptionEn` text,
	`descriptionSw` text,
	`latitude` varchar(50) NOT NULL,
	`longitude` varchar(50) NOT NULL,
	`address` text,
	`phone` varchar(50),
	`email` varchar(320),
	`website` text,
	`type` enum('ngo','shelter','support_center','hotline') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `helpCenters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learningProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learningProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(200) NOT NULL,
	`titleSw` varchar(200) NOT NULL,
	`contentEn` text NOT NULL,
	`contentSw` text NOT NULL,
	`illustrationUrl` text,
	`audioUrlEn` text,
	`audioUrlSw` text,
	`videoUrl` text,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privacyTips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(200) NOT NULL,
	`titleSw` varchar(200) NOT NULL,
	`contentEn` text NOT NULL,
	`contentSw` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `privacyTips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`abuseType` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`audioUrl` text,
	`photoUrl` text,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`status` enum('pending','reviewed','resolved') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`content` text NOT NULL,
	`audioUrl` text,
	`language` enum('en','sw') NOT NULL,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`reactions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` enum('en','sw') DEFAULT 'en' NOT NULL;