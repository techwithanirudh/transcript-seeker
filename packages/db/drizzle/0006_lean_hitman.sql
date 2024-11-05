ALTER TABLE "chats" ADD CONSTRAINT "chats_meeting_id_unique" UNIQUE("meeting_id");--> statement-breakpoint
ALTER TABLE "editors" ADD CONSTRAINT "editors_meeting_id_unique" UNIQUE("meeting_id");