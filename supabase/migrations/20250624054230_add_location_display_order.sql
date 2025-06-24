ALTER TABLE location
ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Function to set display_order to next available number if not provided
CREATE OR REPLACE FUNCTION set_display_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_order IS NULL OR NEW.display_order = 0 THEN
    SELECT COALESCE(MAX(display_order), 0) + 1 INTO NEW.display_order FROM location;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_display_order_trigger
BEFORE INSERT ON location
FOR EACH ROW
EXECUTE FUNCTION set_display_order();
