CREATE TABLE "chapters_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"cid" varchar NOT NULL,
	"chapter_id" integer NOT NULL,
	"content" text NOT NULL,
	"video_id" varchar,
	"isCompleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cid" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"numberOfModules" integer NOT NULL,
	"includeVideo" boolean DEFAULT false,
	"difficultyLevel" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"courseJson" json,
	"userEmail" varchar,
	"banner_image" varchar(255) DEFAULT '',
	"isCloned" boolean DEFAULT false,
	CONSTRAINT "courses_cid_unique" UNIQUE("cid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscriptionId" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
