import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const notification_types = sqliteTable('notification_type', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title'),
  body: text('body'),
  redirect_url: text('redirect_url'),
  type: text('type').references(() => notification_types.id),
  sent_at: text('sent_at').default('CURRENT_TIMESTAMP'),
});

export const location_type = sqliteTable('location_type', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  display_order: integer('display_order').notNull().default(0),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
});

export const location = sqliteTable('location', {
  id: text('id').primaryKey(),
  name: text('name'),
  colloquial_name: text('colloquial_name'),
  description: text('description').notNull().default(''),
  address: text('address').notNull().default(''),
  display_order: integer('display_order').notNull().default(0),
  type_id: text('type_id')
    .notNull()
    .references(() => location_type.id),
  regular_service_hours: text('regular_service_hours', { mode: 'json' }).notNull().default('{}'),
  methods_of_payment: text('methods_of_payment', { mode: 'json' }).notNull().default('[]'),
  meal_times: text('meal_times', { mode: 'json' }).notNull().default('[]'),
  google_maps_link: text('google_maps_link').notNull().default(''),
  apple_maps_link: text('apple_maps_link').notNull().default(''),
  image: text('image'),
  force_close: integer('force_close', { mode: 'boolean' }).notNull().default(false),
  has_menus: integer('has_menus', { mode: 'boolean' }).notNull().default(false),
  latitude: real('latitude'),
  longitude: real('longitude'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
});

export const menu = sqliteTable('menu', {
  id: integer('id').primaryKey(),
  name: text('name'),
  location_id: text('location_id').references(() => location.id),
  date: text('date').notNull(),
});

export const menu_category = sqliteTable('menu_category', {
  id: integer('id').primaryKey(),
  menu_id: integer('menu_id').references(() => menu.id),
  title: text('title'),
});

export const nutrition = sqliteTable('nutrition', {
  id: integer('id').primaryKey(),
  serving_size: text('serving_size'),
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

export const favorites = sqliteTable('favorites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // original_food_id: integer('original_food_id'), // Reference to original food item (optional)
  name: text('name').notNull(),
  location_name: text('location_name').notNull(),
  menu_name: text('menu_name').notNull(),
  category_name: text('category_name').notNull(),
  date_added: text('date_added').notNull(),
  link: text('link'),

  // Embedded nutrition data (denormalized for quick access)
  serving_size: text('serving_size'),
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

  // Embedded allergen data (denormalized)
  beef: integer('beef', { mode: 'boolean' }),
  egg: integer('egg', { mode: 'boolean' }),
  fish: integer('fish', { mode: 'boolean' }),
  peanuts: integer('peanuts', { mode: 'boolean' }),
  pork: integer('pork', { mode: 'boolean' }),
  shellfish: integer('shellfish', { mode: 'boolean' }),
  soy: integer('soy', { mode: 'boolean' }),
  tree_nuts: integer('tree_nuts', { mode: 'boolean' }),
  wheat: integer('wheat', { mode: 'boolean' }),
  sesame_seeds: integer('sesame_seeds', { mode: 'boolean' }),
  vegan: integer('vegan', { mode: 'boolean' }),
  vegetarian: integer('vegetarian', { mode: 'boolean' }),
  halal: integer('halal', { mode: 'boolean' }),
  milk: integer('milk', { mode: 'boolean' }),
});

export const app_information = sqliteTable('app_information', {
  id: text('id').primaryKey(),
  about_title: text('about_title'),
  about_description: text('about_description'),
  credits_contributors: text('credits_contributors', { mode: 'json' }),
  support_links: text('support_links', { mode: 'json' }),
});

export type Location = typeof location.$inferSelect;
export type LocationType = typeof location_type.$inferSelect;
export type Menu = typeof menu.$inferSelect;
export type MenuCategory = typeof menu_category.$inferSelect;
export type Nutrition = typeof nutrition.$inferSelect;
export type Allergens = typeof allergens.$inferSelect;
export type FoodItem = typeof food_item.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export interface LocationWithType extends Location {
  type: LocationType['name'];
}
export type NotificationType = typeof notification_types.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

type AppInfo = typeof app_information.$inferSelect;
export interface AppInformation extends AppInfo {
  credits_contributors: {
    id: string;
    name: string;
    order: number;
  }[];
  support_links: {
    id: string;
    url: string;
    label: string;
    order: number;
  }[];
}
