-- Create enumerated type for payment methods
CREATE TYPE payment_method AS ENUM (
  'Bevo Pay',
  'Cash',
  'Credit/Debit',
  'Dine In Dollars'
);

-- Create location_type table
CREATE TABLE location_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- First, drop the foreign key constraint
ALTER TABLE menu DROP CONSTRAINT IF EXISTS menu_location_id_fkey;

-- Recreate location table with proper column order
-- First, create a backup table with existing data
CREATE TABLE location_backup AS SELECT * FROM location;

-- Drop the existing table
DROP TABLE location;

-- Recreate location table with proper column order
CREATE TABLE location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  colloquial_name TEXT,
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  type_id UUID REFERENCES location_type(id) NOT NULL,
  regular_service_hours JSONB NOT NULL DEFAULT '{}',
  methods_of_payment payment_method[] NOT NULL DEFAULT '{}',
  meal_times JSONB[] NOT NULL DEFAULT '{}',
  google_maps_link TEXT NOT NULL DEFAULT '',
  apple_maps_link TEXT NOT NULL DEFAULT '',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Migrate existing data
INSERT INTO location (id, name, updated_at, type_id)
SELECT 
  gen_random_uuid(),
  name,
  updated_at,
  (SELECT id FROM location_type WHERE name = 'Dining Hall')
FROM location_backup;

-- Drop backup table
DROP TABLE location_backup;

-- Update the foreign key column in menu table to UUID
ALTER TABLE menu 
ALTER COLUMN location_id TYPE UUID USING gen_random_uuid();

-- Recreate the foreign key constraint
ALTER TABLE menu 
ADD CONSTRAINT menu_location_id_fkey 
FOREIGN KEY (location_id) REFERENCES location(id);

-- Add constraints and comments
COMMENT ON COLUMN location.colloquial_name IS 'Optional colloquial or informal name for the location';
COMMENT ON COLUMN location.description IS 'Detailed description of the location';
COMMENT ON COLUMN location.address IS 'Physical address of the location';
COMMENT ON COLUMN location.type_id IS 'Foreign key reference to location_type table';
COMMENT ON COLUMN location.regular_service_hours IS 'JSON object containing service hours for each day of the week';
COMMENT ON COLUMN location.methods_of_payment IS 'Array of accepted payment methods at this location';
COMMENT ON COLUMN location.meal_times IS 'Array of JSON objects containing meal times (breakfast, lunch, dinner, etc.)';
COMMENT ON COLUMN location.google_maps_link IS 'Google Maps URL for the location';
COMMENT ON COLUMN location.apple_maps_link IS 'Apple Maps URL for the location';
COMMENT ON COLUMN location.image IS 'Optional image URL or path for the location';
COMMENT ON COLUMN location.created_at IS 'Timestamp when the location was created';
COMMENT ON COLUMN location.updated_at IS 'Timestamp when the location was last updated';

-- Create index for location type for efficient querying
CREATE INDEX IF NOT EXISTS idx_locations_type_id 
ON location (type_id);

-- Create index for payment methods array for efficient querying
CREATE INDEX IF NOT EXISTS idx_locations_payment_methods 
ON location USING GIN (methods_of_payment);

-- Create index for service hours JSONB column
CREATE INDEX IF NOT EXISTS idx_locations_service_hours 
ON location USING GIN (regular_service_hours);

-- Create index for meal times JSONB column
CREATE INDEX IF NOT EXISTS idx_locations_meal_times 
ON location USING GIN (meal_times);

-- Create index for created_at for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_locations_created_at 
ON location (created_at);

-- Create index for updated_at for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_locations_updated_at 
ON location (updated_at);