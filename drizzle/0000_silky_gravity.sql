CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "admin_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"last_login" timestamp,
	CONSTRAINT "admin_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "check_in" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"facility_type" text NOT NULL,
	"check_in_time" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "day_pass" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_name" text,
	"passport_id" text,
	"email" text,
	"pass_type" text NOT NULL,
	"price_paid" numeric(10, 2) NOT NULL,
	"purchase_date" timestamp DEFAULT now() NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"passport_id" text,
	"email" text,
	"name" text NOT NULL,
	"phone" text,
	"birthday" timestamp,
	"nationality_id" text,
	"plan_type" text,
	"plan_duration" integer,
	"start_date" timestamp NOT NULL,
	"original_end_date" timestamp NOT NULL,
	"current_end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_paused" boolean DEFAULT false NOT NULL,
	"pause_count" integer DEFAULT 0 NOT NULL,
	"used_visits" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "member_passport_id_unique" UNIQUE("passport_id"),
	CONSTRAINT "member_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "membership_pause" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"pause_start_date" timestamp NOT NULL,
	"pause_end_date" timestamp,
	"pause_reason" text,
	"paused_by_admin_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "nationality" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"flag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "nationality_name_unique" UNIQUE("name"),
	CONSTRAINT "nationality_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"day_pass_id" text,
	"plan_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"gym_share" numeric(5, 2),
	"crossfit_share" numeric(5, 2),
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"payment_method" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"plan_type" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"price_thai_discount" numeric(10, 2),
	"duration" integer,
	"visit_limit" integer,
	"plan_category" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_drop_in" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "plan_plan_type_unique" UNIQUE("plan_type")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_item" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "shop_sale" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"sale_date" timestamp DEFAULT now() NOT NULL,
	"sold_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_nationality_id_nationality_id_fk" FOREIGN KEY ("nationality_id") REFERENCES "public"."nationality"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_pause" ADD CONSTRAINT "membership_pause_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_pause" ADD CONSTRAINT "membership_pause_paused_by_admin_id_admin_user_id_fk" FOREIGN KEY ("paused_by_admin_id") REFERENCES "public"."admin_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_day_pass_id_day_pass_id_fk" FOREIGN KEY ("day_pass_id") REFERENCES "public"."day_pass"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_sale" ADD CONSTRAINT "shop_sale_item_id_shop_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_sale" ADD CONSTRAINT "shop_sale_sold_by_user_id_admin_user_id_fk" FOREIGN KEY ("sold_by_user_id") REFERENCES "public"."admin_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_users_email_idx" ON "admin_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "check_ins_member_id_idx" ON "check_in" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "check_ins_check_in_time_idx" ON "check_in" USING btree ("check_in_time");--> statement-breakpoint
CREATE INDEX "day_passes_purchase_date_idx" ON "day_pass" USING btree ("purchase_date");--> statement-breakpoint
CREATE INDEX "day_passes_is_used_idx" ON "day_pass" USING btree ("is_used");--> statement-breakpoint
CREATE INDEX "members_passport_id_idx" ON "member" USING btree ("passport_id");--> statement-breakpoint
CREATE INDEX "members_email_idx" ON "member" USING btree ("email");--> statement-breakpoint
CREATE INDEX "members_is_active_idx" ON "member" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "members_nationality_id_idx" ON "member" USING btree ("nationality_id");--> statement-breakpoint
CREATE INDEX "membership_pauses_member_id_idx" ON "membership_pause" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "nationalities_name_idx" ON "nationality" USING btree ("name");--> statement-breakpoint
CREATE INDEX "nationalities_code_idx" ON "nationality" USING btree ("code");--> statement-breakpoint
CREATE INDEX "payments_member_id_idx" ON "payment" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "payments_payment_date_idx" ON "payment" USING btree ("payment_date");--> statement-breakpoint
CREATE INDEX "payments_plan_id_idx" ON "payment" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "plans_plan_type_idx" ON "plan" USING btree ("plan_type");--> statement-breakpoint
CREATE INDEX "plans_is_active_idx" ON "plan" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "plans_category_idx" ON "plan" USING btree ("plan_category");--> statement-breakpoint
CREATE INDEX "shop_items_category_idx" ON "shop_item" USING btree ("category");--> statement-breakpoint
CREATE INDEX "shop_items_is_active_idx" ON "shop_item" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shop_sales_item_id_idx" ON "shop_sale" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "shop_sales_sale_date_idx" ON "shop_sale" USING btree ("sale_date");