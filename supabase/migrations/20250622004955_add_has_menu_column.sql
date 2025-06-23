-- Alter `location` table to add `has_menus` column
ALTER TABLE location
ADD COLUMN has_menus BOOLEAN DEFAULT FALSE;
