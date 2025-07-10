create table "public"."user_devices" (
    "device_id" text not null,
    "push_token" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_devices" enable row level security;

alter table "public"."app_information" enable row level security;

CREATE UNIQUE INDEX user_devices_pkey ON public.user_devices USING btree (device_id);

alter table "public"."user_devices" add constraint "user_devices_pkey" PRIMARY KEY using index "user_devices_pkey";

grant delete on table "public"."user_devices" to "anon";

grant insert on table "public"."user_devices" to "anon";

grant references on table "public"."user_devices" to "anon";

grant select on table "public"."user_devices" to "anon";

grant trigger on table "public"."user_devices" to "anon";

grant truncate on table "public"."user_devices" to "anon";

grant update on table "public"."user_devices" to "anon";

grant delete on table "public"."user_devices" to "authenticated";

grant insert on table "public"."user_devices" to "authenticated";

grant references on table "public"."user_devices" to "authenticated";

grant select on table "public"."user_devices" to "authenticated";

grant trigger on table "public"."user_devices" to "authenticated";

grant truncate on table "public"."user_devices" to "authenticated";

grant update on table "public"."user_devices" to "authenticated";

grant delete on table "public"."user_devices" to "service_role";

grant insert on table "public"."user_devices" to "service_role";

grant references on table "public"."user_devices" to "service_role";

grant select on table "public"."user_devices" to "service_role";

grant trigger on table "public"."user_devices" to "service_role";

grant truncate on table "public"."user_devices" to "service_role";

grant update on table "public"."user_devices" to "service_role";

create policy "Enable ALL for authenticated"
on "public"."app_information"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Device can read itself"
on "public"."user_devices"
as permissive
for select
to public
using ((device_id = ((current_setting('request.headers'::text, true))::json ->> 'x-device-id'::text)));


create policy "Device can update itself"
on "public"."user_devices"
as permissive
for update
to public
using ((device_id = ((current_setting('request.headers'::text, true))::json ->> 'x-device-id'::text)));


create policy "Enable insert for all users"
on "public"."user_devices"
as permissive
for insert
to public
with check (true);



