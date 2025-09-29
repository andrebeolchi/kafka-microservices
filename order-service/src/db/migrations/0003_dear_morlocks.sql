ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "transaction_id" DROP NOT NULL;