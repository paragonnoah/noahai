CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scopeId` int NOT NULL,
	`assetType` enum('subdomain','endpoint','technology','service','ip','other') NOT NULL,
	`value` varchar(500) NOT NULL,
	`metadata` json DEFAULT ('{}'),
	`source` varchar(100),
	`discoveredDate` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`findingId` int NOT NULL,
	`evidenceType` enum('screenshot','http_request','http_response','poc_code','log','other') NOT NULL,
	`title` varchar(255),
	`description` text,
	`requestData` text,
	`responseData` text,
	`screenshotUrl` varchar(500),
	`metadata` json DEFAULT ('{}'),
	`timestamp` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `findings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scopeId` int NOT NULL,
	`findingType` enum('idor','bola','auth','cors','csrf','ssrf','upload','cache','business_logic','other') NOT NULL,
	`severity` enum('critical','high','medium','low','info') DEFAULT 'medium',
	`status` enum('signal','validated','report_ready','submitted','resolved') DEFAULT 'signal',
	`title` varchar(255) NOT NULL,
	`description` text,
	`impactStatement` text,
	`reproductionSteps` text,
	`affectedAssets` json DEFAULT ('[]'),
	`sessionProfilesUsed` json DEFAULT ('[]'),
	`cvssScore` decimal(3,1),
	`cweId` varchar(20),
	`tags` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` varchar(100),
	`url` varchar(500),
	`disclosurePolicy` text,
	`notes` text,
	`status` enum('active','paused','completed') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`findingId` int NOT NULL,
	`reportType` enum('markdown','html','bounty_submission','vendor_disclosure','cve_pack') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`status` enum('draft','ready','submitted') DEFAULT 'draft',
	`generatedDate` timestamp DEFAULT (now()),
	`submittedDate` timestamp,
	`submissionUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scopes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`allowedDomains` json DEFAULT ('[]'),
	`excludedDomains` json DEFAULT ('[]'),
	`ipRanges` json DEFAULT ('[]'),
	`rateLimits` json DEFAULT ('{}'),
	`specialRules` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scopes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessionProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`authType` enum('cookie','bearer_token','api_key','oauth','custom') NOT NULL,
	`credentials` text,
	`roleLevel` enum('unauthenticated','user','moderator','admin') DEFAULT 'user',
	`description` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessionProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `validationChecks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scopeId` int NOT NULL,
	`checkType` enum('idor','bola','auth','other') NOT NULL,
	`targetUrl` varchar(500) NOT NULL,
	`sessionProfile1Id` int,
	`sessionProfile2Id` int,
	`testPayload` text,
	`result` enum('passed','failed','inconclusive') NOT NULL,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `validationChecks_id` PRIMARY KEY(`id`)
);
