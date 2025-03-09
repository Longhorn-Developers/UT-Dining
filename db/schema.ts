import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const location = sqliteTable('location', {
  id: integer('id').primaryKey(),
  name: text('name'),
  updated_at: text('updated_at'),
});

export const menu = sqliteTable('menu', {
  id: integer('id').primaryKey(),
  name: text('name'),
  location_id: integer('location_id').references(() => location.id),
});

export const menu_category = sqliteTable('menu_category', {
  id: integer('id').primaryKey(),
  menu_id: integer('menu_id').references(() => menu.id),
  title: text('title'),
});

export const nutrition = sqliteTable('nutrition', {
  id: integer('id').primaryKey(),
  // Doesn't have food_item_id key. Might be error here, watch out
  calories: text('calories'),
  total_fat: text('total_fat'),
  saturated_fat: text('saturated_fat'),
  cholesterol: text('cholesterol'),
  sodium: text('sodium'),
  total_carbohydrates: text('total_carbohydrates'),
  dietary_fiber: text('dietary_fiber'),
  total_sugars: text('total_sugars'),
  protein: text('protein'),
  vitamin_d: text('vitamin_d'),
  calcium: text('calcium'),
  iron: text('iron'),
  potassium: text('potassium'),
  ingredients: text('ingredients'),
  trans_fat: text('trans_fat'),
});
export const allergens = sqliteTable('allergens', {
  id: integer('id').primaryKey(),
  // Doesn't have food_item_id key. Might be error here, watch out
  beef: integer('beef', {
    mode: 'boolean',
  }),
  egg: integer('egg', {
    mode: 'boolean',
  }),
  fish: integer('fish', {
    mode: 'boolean',
  }),
  peanuts: integer('peanuts', {
    mode: 'boolean',
  }),
  pork: integer('pork', {
    mode: 'boolean',
  }),
  shellfish: integer('shellfish', {
    mode: 'boolean',
  }),
  soy: integer('soy', {
    mode: 'boolean',
  }),
  tree_nuts: integer('tree_nuts', {
    mode: 'boolean',
  }),
  wheat: integer('wheat', {
    mode: 'boolean',
  }),
  sesame_seeds: integer('sesame_seeds', {
    mode: 'boolean',
  }),
  vegan: integer('vegan', {
    mode: 'boolean',
  }),
  vegetarian: integer('vegetarian', {
    mode: 'boolean',
  }),
  halal: integer('halal', {
    mode: 'boolean',
  }),
  milk: integer('milk', {
    mode: 'boolean',
  }),
});

export const food_item = sqliteTable('food_item', {
  id: integer('id').primaryKey(),
  name: text('name'),
  link: text('link'),
  menu_category_id: integer('menu_category_id').references(() => menu_category.id),
  nutrition_id: integer('nutrition_id').references(() => nutrition.id),
  allergens_id: integer('allergens_id').references(() => allergens.id),
});

export type Location = typeof location.$inferSelect;
export type Menu = typeof menu.$inferSelect;
export type MenuCategory = typeof menu_category.$inferSelect;
export type Nutrition = typeof nutrition.$inferSelect;
export type Allergens = typeof allergens.$inferSelect;
export type FoodItem = typeof food_item.$inferSelect;
