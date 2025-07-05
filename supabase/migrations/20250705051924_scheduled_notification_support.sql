create table "public"."scheduled_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying,
    "body" character varying,
    "redirect_url" character varying,
    "scheduled_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now(),
    "sent" boolean default false
);


alter table "public"."scheduled_notifications" enable row level security;

CREATE UNIQUE INDEX scheduled_notifications_pkey ON public.scheduled_notifications USING btree (id);

alter table "public"."scheduled_notifications" add constraint "scheduled_notifications_pkey" PRIMARY KEY using index "scheduled_notifications_pkey";

grant delete on table "public"."scheduled_notifications" to "anon";

grant insert on table "public"."scheduled_notifications" to "anon";

grant references on table "public"."scheduled_notifications" to "anon";

grant select on table "public"."scheduled_notifications" to "anon";

grant trigger on table "public"."scheduled_notifications" to "anon";

grant truncate on table "public"."scheduled_notifications" to "anon";

grant update on table "public"."scheduled_notifications" to "anon";

grant delete on table "public"."scheduled_notifications" to "authenticated";

grant insert on table "public"."scheduled_notifications" to "authenticated";

grant references on table "public"."scheduled_notifications" to "authenticated";

grant select on table "public"."scheduled_notifications" to "authenticated";

grant trigger on table "public"."scheduled_notifications" to "authenticated";

grant truncate on table "public"."scheduled_notifications" to "authenticated";

grant update on table "public"."scheduled_notifications" to "authenticated";

grant delete on table "public"."scheduled_notifications" to "service_role";

grant insert on table "public"."scheduled_notifications" to "service_role";

grant references on table "public"."scheduled_notifications" to "service_role";

grant select on table "public"."scheduled_notifications" to "service_role";

grant trigger on table "public"."scheduled_notifications" to "service_role";

grant truncate on table "public"."scheduled_notifications" to "service_role";

grant update on table "public"."scheduled_notifications" to "service_role";

create policy "Enable ALL for authenticated"
on "public"."scheduled_notifications"
as permissive
for all
to authenticated
using (true)
with check (true);



