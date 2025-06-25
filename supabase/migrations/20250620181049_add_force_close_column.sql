-- Add force_close column to locations table
-- This column allows administrators to manually force a location to show as closed
-- regardless of its scheduled service hours

ALTER TABLE location
ADD COLUMN force_close BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment to explain the purpose of this column
COMMENT ON COLUMN location.force_close IS 'When true, forces the location to show as closed regardless of service hours. Used for emergency closures, maintenance, etc.';