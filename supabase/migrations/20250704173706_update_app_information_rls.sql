create policy "Enable read access for all users"
on "public"."app_information"
as permissive
for select
to public
using (true);



