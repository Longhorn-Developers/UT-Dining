CREATE OR REPLACE FUNCTION insert_location_and_menus(arg_data JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  location_id UUID;
  new_menu_id BIGINT;
  new_menu_cat_id BIGINT;
  new_food_item_id BIGINT;
  nutrit_id BIGINT;
  allerg_id BIGINT;
  menu_item JSONB;
  menu_cat_item JSONB;
  food_item JSONB;
  nutrition JSONB;
BEGIN
  -- Attempt to fetch an existing location by name or colloquial_name (case-insensitive)
  SELECT id INTO location_id
  FROM location
  WHERE LOWER(name) = LOWER(arg_data->>'locationName')
     OR LOWER(colloquial_name) = LOWER(arg_data->>'locationName');

  -- If not found, insert a new location
  IF location_id IS NULL THEN
    INSERT INTO location (name, updated_at)
    VALUES (arg_data->>'locationName', NOW())
    RETURNING id INTO location_id;
  END IF;

  IF location_id IS NULL THEN
    RAISE EXCEPTION 'Failed to insert or resolve location for name %', arg_data->>'locationName';
  END IF;

  FOR menu_item IN SELECT * FROM jsonb_array_elements(arg_data->'menus') LOOP
    INSERT INTO menu (location_id, name)
    VALUES (location_id, menu_item->>'type')
    RETURNING id INTO new_menu_id;

    IF new_menu_id IS NULL THEN
      RAISE EXCEPTION 'Failed to insert menu for location_id %', location_id;
    END IF;

    FOR menu_cat_item IN SELECT * FROM jsonb_array_elements(menu_item->'menuCategories') LOOP
      INSERT INTO menu_category (title, menu_id)
      VALUES (menu_cat_item->>'categoryName', new_menu_id)
      RETURNING id INTO new_menu_cat_id;

      IF new_menu_cat_id IS NULL THEN
        RAISE EXCEPTION 'Failed to insert menu category for menu_id %', new_menu_id;
      END IF;

      FOR food_item IN SELECT * FROM jsonb_array_elements(menu_cat_item->'foods') LOOP
        nutrition := food_item->'nutrition';

        INSERT INTO food_item (name, link, menu_category_id)
        VALUES (food_item->>'name', food_item->>'link', new_menu_cat_id)
        RETURNING id INTO new_food_item_id;

        IF new_food_item_id IS NULL THEN
          RAISE EXCEPTION 'Failed to insert food item for menu_category_id %', new_menu_cat_id;
        END IF;

        INSERT INTO nutrition (
          food_item_id, serving_size, calories, total_fat, saturated_fat,
          trans_fat, cholesterol, sodium, total_carbohydrates, dietary_fiber,
          total_sugars, protein, vitamin_d, calcium, iron, potassium, ingredients
        ) VALUES (
          new_food_item_id,
          nutrition->>'servingSize', nutrition->>'calories', nutrition->>'totalFat',
          nutrition->>'saturatedFat', nutrition->>'transFat', nutrition->>'cholesterol',
          nutrition->>'sodium', nutrition->>'totalCarbohydrates', nutrition->>'dietaryFiber',
          nutrition->>'totalSugars', nutrition->>'protein', nutrition->>'vitaminD',
          nutrition->>'calcium', nutrition->>'iron', nutrition->>'potassium',
          nutrition->>'ingredients'
        )
        RETURNING id INTO nutrit_id;

        IF nutrit_id IS NULL THEN
          RAISE EXCEPTION 'Failed to insert nutrition for food_item_id %', new_food_item_id;
        END IF;

        INSERT INTO allergens (
          food_item_id, beef, egg, fish, milk, peanuts, pork, shellfish,
          soy, tree_nuts, wheat, sesame_seeds, vegan, vegetarian, halal
        ) VALUES (
          new_food_item_id,
          (food_item#>'{allergens,beef}')::boolean,
          (food_item#>'{allergens,egg}')::boolean,
          (food_item#>'{allergens,fish}')::boolean,
          (food_item#>'{allergens,milk}')::boolean,
          (food_item#>'{allergens,peanuts}')::boolean,
          (food_item#>'{allergens,pork}')::boolean,
          (food_item#>'{allergens,shellfish}')::boolean,
          (food_item#>'{allergens,soy}')::boolean,
          (food_item#>'{allergens,tree_nuts}')::boolean,
          (food_item#>'{allergens,wheat}')::boolean,
          (food_item#>'{allergens,sesame_seeds}')::boolean,
          (food_item#>'{allergens,vegan}')::boolean,
          (food_item#>'{allergens,vegetarian}')::boolean,
          (food_item#>'{allergens,halal}')::boolean
        )
        RETURNING id INTO allerg_id;

        IF allerg_id IS NULL THEN
          RAISE EXCEPTION 'Failed to insert allergens for food_item_id %', new_food_item_id;
        END IF;

        UPDATE food_item
        SET nutrition_id = nutrit_id, allergens_id = allerg_id
        WHERE id = new_food_item_id;

      END LOOP;
    END LOOP;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to insert multiple locations and menus and update force_close
CREATE OR REPLACE FUNCTION insert_multiple_locations_and_menus(arg_data_array JSONB[])
RETURNS BOOLEAN AS $$
DECLARE
  arg_data JSONB;
  result BOOLEAN;
BEGIN
  FOREACH arg_data IN ARRAY arg_data_array LOOP
    result := insert_location_and_menus(arg_data);
    IF NOT result THEN
      RAISE EXCEPTION 'Failed to insert data for: %', arg_data;
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;