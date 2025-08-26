ALTER TABLE "user_profile" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_profile" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "user_type";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "display_username";