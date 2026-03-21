CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId1` int NOT NULL,
	`userId2` int NOT NULL,
	`status` enum('knocked','liked','mutual','revealed') NOT NULL DEFAULT 'knocked',
	`user1Liked` boolean NOT NULL DEFAULT false,
	`user2Liked` boolean NOT NULL DEFAULT false,
	`user1Revealed` boolean NOT NULL DEFAULT false,
	`user2Revealed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`filtered` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('spark','flame') NOT NULL,
	`stripeSessionId` varchar(255),
	`stripePaymentIntentId` varchar(255),
	`status` enum('pending','active','cancelled','expired') NOT NULL DEFAULT 'pending',
	`amount` decimal(10,2),
	`currency` varchar(3) DEFAULT 'GBP',
	`startsAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `age` int;--> statement-breakpoint
ALTER TABLE `users` ADD `ageVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `faceVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `facePhotoUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `latitude` float;--> statement-breakpoint
ALTER TABLE `users` ADD `longitude` float;--> statement-breakpoint
ALTER TABLE `users` ADD `locationCity` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `tier` enum('free','spark','flame') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `tierExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `revealCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `revealResetAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `profileComplete` boolean DEFAULT false NOT NULL;