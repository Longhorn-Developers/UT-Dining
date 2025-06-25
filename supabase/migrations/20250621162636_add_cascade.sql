-- Add CASCADE delete behavior to foreign key constraints

-- 1. Update menu table's location_id foreign key to cascade on delete and update
ALTER TABLE menu DROP CONSTRAINT IF EXISTS menu_location_id_fkey;
ALTER TABLE menu 
ADD CONSTRAINT menu_location_id_fkey 
FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Update nutrition table's food_item_id foreign key to cascade on delete and update
ALTER TABLE nutrition DROP CONSTRAINT IF EXISTS nutrition_food_item_id_fkey;
ALTER TABLE nutrition 
ADD CONSTRAINT nutrition_food_item_id_fkey 
FOREIGN KEY (food_item_id) REFERENCES food_item(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Also update food_item.nutrition_id foreign key to cascade on delete and update
ALTER TABLE food_item DROP CONSTRAINT IF EXISTS food_item_nutrition_id_fkey;
ALTER TABLE food_item 
ADD CONSTRAINT food_item_nutrition_id_fkey 
FOREIGN KEY (nutrition_id) REFERENCES nutrition(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Also add CASCADE to other food_item foreign key constraints for consistency
ALTER TABLE food_item DROP CONSTRAINT IF EXISTS food_item_allergens_id_fkey;
ALTER TABLE food_item 
ADD CONSTRAINT food_item_allergens_id_fkey 
FOREIGN KEY (allergens_id) REFERENCES allergens(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE food_item DROP CONSTRAINT IF EXISTS food_item_menu_category_id_fkey;
ALTER TABLE food_item 
ADD CONSTRAINT food_item_menu_category_id_fkey 
FOREIGN KEY (menu_category_id) REFERENCES menu_category(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Add CASCADE to menu_category foreign key as well
ALTER TABLE menu_category DROP CONSTRAINT IF EXISTS menu_category_menu_id_fkey;
ALTER TABLE menu_category 
ADD CONSTRAINT menu_category_menu_id_fkey 
FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add comments to explain the cascade behavior
COMMENT ON CONSTRAINT menu_location_id_fkey ON menu IS 'Cascade delete/update: when location is deleted/updated, all associated menus are deleted/updated';
COMMENT ON CONSTRAINT nutrition_food_item_id_fkey ON nutrition IS 'Cascade delete/update: when food item is deleted/updated, associated nutrition record is deleted/updated';
COMMENT ON CONSTRAINT food_item_nutrition_id_fkey ON food_item IS 'Cascade delete/update: when nutrition record is deleted/updated, associated food items are deleted/updated';
COMMENT ON CONSTRAINT food_item_allergens_id_fkey ON food_item IS 'Cascade delete/update: when allergens record is deleted/updated, associated food items are deleted/updated';
COMMENT ON CONSTRAINT food_item_menu_category_id_fkey ON food_item IS 'Cascade delete/update: when menu category is deleted/updated, associated food items are deleted/updated';
COMMENT ON CONSTRAINT menu_category_menu_id_fkey ON menu_category IS 'Cascade delete/update: when menu is deleted/updated, all associated menu categories are deleted/updated';
