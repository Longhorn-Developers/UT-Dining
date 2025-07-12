drop policy "Enable insert for authenticated users only" on "public"."food_item";

drop policy "Enable read access for all users" on "public"."food_item";

drop policy "Enable insert for authenticated users only" on "public"."menu";

drop policy "Enable read access for all users" on "public"."menu";

drop policy "Enable insert for authenticated users only" on "public"."menu_category";

drop policy "Enable read access for all users" on "public"."menu_category";

drop policy "Enable read access for all users" on "public"."nutrition";

create policy "Enable ALL for authenticated users"
on "public"."food_item"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable read access for users within date window"
on "public"."food_item"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (menu_category
     JOIN menu ON ((menu.id = menu_category.menu_id)))
  WHERE ((menu_category.id = food_item.menu_category_id) AND (menu.date >= ((timezone('America/Chicago'::text, now()))::date - '2 days'::interval)) AND (menu.date <= ((timezone('America/Chicago'::text, now()))::date + '3 days'::interval))))));


create policy "Enable ALL for authenticated users"
on "public"."menu"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable read access for anon users within 5-day window"
on "public"."menu"
as permissive
for select
to public
using (((date >= ((timezone('America/Chicago'::text, now()))::date - '2 days'::interval)) AND (date <= ((timezone('America/Chicago'::text, now()))::date + '3 days'::interval))));


create policy "Enable ALL for authenticated users"
on "public"."menu_category"
as permissive
for all
to public
using (true)
with check (true);


create policy "Enable read access for users within date window"
on "public"."menu_category"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM menu
  WHERE ((menu.id = menu_category.menu_id) AND (menu.date >= ((timezone('America/Chicago'::text, now()))::date - '2 days'::interval)) AND (menu.date <= ((timezone('America/Chicago'::text, now()))::date + '3 days'::interval))))));


create policy "Enable read access for anon users within date window"
on "public"."nutrition"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((food_item
     JOIN menu_category ON ((menu_category.id = food_item.menu_category_id)))
     JOIN menu ON ((menu.id = menu_category.menu_id)))
  WHERE ((food_item.id = nutrition.food_item_id) AND (menu.date >= ((timezone('America/Chicago'::text, now()))::date - '2 days'::interval)) AND (menu.date <= ((timezone('America/Chicago'::text, now()))::date + '3 days'::interval))))));



