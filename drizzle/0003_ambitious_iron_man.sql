CREATE TABLE `knock_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`knockerId` int NOT NULL,
	`receiverId` int NOT NULL,
	`status` enum('pending','accepted','rejected','ignored') NOT NULL DEFAULT 'pending',
	`rejectCount` int NOT NULL DEFAULT 0,
	`cooldownUntil` timestamp,
	`clearedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knock_notifications_id` PRIMARY KEY(`id`)
);
