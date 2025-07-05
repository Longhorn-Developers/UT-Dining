drop policy "Enable ALL for authenticated" on "public"."scheduled_notifications";

revoke delete on table "public"."scheduled_notifications" from "anon";

revoke insert on table "public"."scheduled_notifications" from "anon";

revoke references on table "public"."scheduled_notifications" from "anon";

revoke select on table "public"."scheduled_notifications" from "anon";

revoke trigger on table "public"."scheduled_notifications" from "anon";

revoke truncate on table "public"."scheduled_notifications" from "anon";

revoke update on table "public"."scheduled_notifications" from "anon";

revoke delete on table "public"."scheduled_notifications" from "authenticated";

revoke insert on table "public"."scheduled_notifications" from "authenticated";

revoke references on table "public"."scheduled_notifications" from "authenticated";

revoke select on table "public"."scheduled_notifications" from "authenticated";

revoke trigger on table "public"."scheduled_notifications" from "authenticated";

revoke truncate on table "public"."scheduled_notifications" from "authenticated";

revoke update on table "public"."scheduled_notifications" from "authenticated";

revoke delete on table "public"."scheduled_notifications" from "service_role";

revoke insert on table "public"."scheduled_notifications" from "service_role";

revoke references on table "public"."scheduled_notifications" from "service_role";

revoke select on table "public"."scheduled_notifications" from "service_role";

revoke trigger on table "public"."scheduled_notifications" from "service_role";

revoke truncate on table "public"."scheduled_notifications" from "service_role";

revoke update on table "public"."scheduled_notifications" from "service_role";

alter table "public"."scheduled_notifications" drop constraint "scheduled_notifications_pkey";

drop index if exists "public"."scheduled_notifications_pkey";

drop table "public"."scheduled_notifications";

create table "public"."notification_types" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."notification_types" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying,
    "body" character varying,
    "redirect_url" character varying,
    "scheduled_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "sent" boolean not null default false,
    "type" uuid not null
);


alter table "public"."notifications" enable row level security;

CREATE UNIQUE INDEX notification_types_pkey ON public.notification_types USING btree (id);

CREATE UNIQUE INDEX scheduled_notifications_pkey ON public.notifications USING btree (id);

alter table "public"."notification_types" add constraint "notification_types_pkey" PRIMARY KEY using index "notification_types_pkey";

alter table "public"."notifications" add constraint "scheduled_notifications_pkey" PRIMARY KEY using index "scheduled_notifications_pkey";

alter table "public"."notifications" add constraint "notifications_type_fkey" FOREIGN KEY (type) REFERENCES notification_types(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_type_fkey";

grant delete on table "public"."notification_types" to "anon";

grant insert on table "public"."notification_types" to "anon";

grant references on table "public"."notification_types" to "anon";

grant select on table "public"."notification_types" to "anon";

grant trigger on table "public"."notification_types" to "anon";

grant truncate on table "public"."notification_types" to "anon";

grant update on table "public"."notification_types" to "anon";

grant delete on table "public"."notification_types" to "authenticated";

grant insert on table "public"."notification_types" to "authenticated";

grant references on table "public"."notification_types" to "authenticated";

grant select on table "public"."notification_types" to "authenticated";

grant trigger on table "public"."notification_types" to "authenticated";

grant truncate on table "public"."notification_types" to "authenticated";

grant update on table "public"."notification_types" to "authenticated";

grant delete on table "public"."notification_types" to "service_role";

grant insert on table "public"."notification_types" to "service_role";

grant references on table "public"."notification_types" to "service_role";

grant select on table "public"."notification_types" to "service_role";

grant trigger on table "public"."notification_types" to "service_role";

grant truncate on table "public"."notification_types" to "service_role";

grant update on table "public"."notification_types" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

create policy "Enable ALL for authenticated"
on "public"."notification_types"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable read access for all users"
on "public"."notification_types"
as permissive
for select
to public
using (true);


create policy "Enable ALL for authenticated"
on "public"."notifications"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable read access for all users on sent notifications"
on "public"."notifications"
as permissive
for select
to public
using ((sent = true));



