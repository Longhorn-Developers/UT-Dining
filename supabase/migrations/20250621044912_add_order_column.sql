-- Add order column to location_type table
-- This column will be used to control the display order of location types in filters

ALTER TABLE location_type 
ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;

-- Add comment to explain the purpose of this column
COMMENT ON COLUMN location_type.display_order IS 'Controls the display order of location types in filters and UI. Lower numbers appear first.';

-- Create index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_location_type_display_order 
ON location_type (display_order);