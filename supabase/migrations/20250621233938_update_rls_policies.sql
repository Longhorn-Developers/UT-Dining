-- Allow all users to read data from the `location` table
ALTER TABLE location ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" ON "public"."location" AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true);

-- Restrict all actions to authenticated users for the `location` table
CREATE POLICY "Enable ALL to authenticated users" ON "public"."location" AS PERMISSIVE 
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow all users to read data from the `location_type` table
ALTER TABLE location_type ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" ON "public"."location_type" AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true);

-- Restrict all actions to authenticated users for the `location_type` table
CREATE POLICY "Enable ALL to authenticated users" ON "public"."location_type" AS PERMISSIVE 
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);