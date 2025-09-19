CREATE TABLE "nationality" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"flag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nationality_name_unique" UNIQUE("name"),
	CONSTRAINT "nationality_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "nationality_id" text;--> statement-breakpoint
CREATE INDEX "nationalities_name_idx" ON "nationality" USING btree ("name");--> statement-breakpoint
CREATE INDEX "nationalities_code_idx" ON "nationality" USING btree ("code");--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_nationality_id_nationality_id_fk" FOREIGN KEY ("nationality_id") REFERENCES "public"."nationality"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "members_nationality_id_idx" ON "member" USING btree ("nationality_id");