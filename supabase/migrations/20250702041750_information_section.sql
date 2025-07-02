create table "public"."app_information" (
    "id" uuid not null default gen_random_uuid(),
    "about_title" character varying,
    "about_description" character varying,
    "credits_contributors" jsonb,
    "support_links" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp without time zone default now()
);


CREATE UNIQUE INDEX app_information_pkey ON public.app_information USING btree (id);

alter table "public"."app_information" add constraint "app_information_pkey" PRIMARY KEY using index "app_information_pkey";

grant delete on table "public"."app_information" to "anon";

grant insert on table "public"."app_information" to "anon";

grant references on table "public"."app_information" to "anon";

grant select on table "public"."app_information" to "anon";

grant trigger on table "public"."app_information" to "anon";

grant truncate on table "public"."app_information" to "anon";

grant update on table "public"."app_information" to "anon";

grant delete on table "public"."app_information" to "authenticated";

grant insert on table "public"."app_information" to "authenticated";

grant references on table "public"."app_information" to "authenticated";

grant select on table "public"."app_information" to "authenticated";

grant trigger on table "public"."app_information" to "authenticated";

grant truncate on table "public"."app_information" to "authenticated";

grant update on table "public"."app_information" to "authenticated";

grant delete on table "public"."app_information" to "service_role";

grant insert on table "public"."app_information" to "service_role";

grant references on table "public"."app_information" to "service_role";

grant select on table "public"."app_information" to "service_role";

grant trigger on table "public"."app_information" to "service_role";

grant truncate on table "public"."app_information" to "service_role";

grant update on table "public"."app_information" to "service_role";


