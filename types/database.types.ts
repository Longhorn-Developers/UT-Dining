export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      allergens: {
        Row: {
          beef: boolean | null;
          egg: boolean | null;
          fish: boolean | null;
          food_item_id: number | null;
          halal: boolean | null;
          id: number;
          milk: boolean | null;
          peanuts: boolean | null;
          pork: boolean | null;
          sesame_seeds: boolean | null;
          shellfish: boolean | null;
          soy: boolean | null;
          tree_nuts: boolean | null;
          vegan: boolean | null;
          vegetarian: boolean | null;
          wheat: boolean | null;
        };
        Insert: {
          beef?: boolean | null;
          egg?: boolean | null;
          fish?: boolean | null;
          food_item_id?: number | null;
          halal?: boolean | null;
          id?: number;
          milk?: boolean | null;
          peanuts?: boolean | null;
          pork?: boolean | null;
          sesame_seeds?: boolean | null;
          shellfish?: boolean | null;
          soy?: boolean | null;
          tree_nuts?: boolean | null;
          vegan?: boolean | null;
          vegetarian?: boolean | null;
          wheat?: boolean | null;
        };
        Update: {
          beef?: boolean | null;
          egg?: boolean | null;
          fish?: boolean | null;
          food_item_id?: number | null;
          halal?: boolean | null;
          id?: number;
          milk?: boolean | null;
          peanuts?: boolean | null;
          pork?: boolean | null;
          sesame_seeds?: boolean | null;
          shellfish?: boolean | null;
          soy?: boolean | null;
          tree_nuts?: boolean | null;
          vegan?: boolean | null;
          vegetarian?: boolean | null;
          wheat?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'allergens_food_item_id_fkey';
            columns: ['food_item_id'];
            isOneToOne: false;
            referencedRelation: 'food_item';
            referencedColumns: ['id'];
          },
        ];
      };
      food_item: {
        Row: {
          allergens_id: number | null;
          id: number;
          link: string | null;
          menu_category_id: number | null;
          name: string | null;
          nutrition_id: number | null;
        };
        Insert: {
          allergens_id?: number | null;
          id?: number;
          link?: string | null;
          menu_category_id?: number | null;
          name?: string | null;
          nutrition_id?: number | null;
        };
        Update: {
          allergens_id?: number | null;
          id?: number;
          link?: string | null;
          menu_category_id?: number | null;
          name?: string | null;
          nutrition_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'food_item_allergens_id_fkey';
            columns: ['allergens_id'];
            isOneToOne: false;
            referencedRelation: 'allergens';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'food_item_menu_category_id_fkey';
            columns: ['menu_category_id'];
            isOneToOne: false;
            referencedRelation: 'menu_category';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'food_item_nutrition_id_fkey';
            columns: ['nutrition_id'];
            isOneToOne: false;
            referencedRelation: 'nutrition';
            referencedColumns: ['id'];
          },
        ];
      };
      location: {
        Row: {
          id: number;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      menu: {
        Row: {
          id: number;
          location_id: number | null;
          name: string | null;
        };
        Insert: {
          id?: number;
          location_id?: number | null;
          name?: string | null;
        };
        Update: {
          id?: number;
          location_id?: number | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'menu_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'location';
            referencedColumns: ['id'];
          },
        ];
      };
      menu_category: {
        Row: {
          id: number;
          menu_id: number;
          title: string | null;
        };
        Insert: {
          id?: number;
          menu_id: number;
          title?: string | null;
        };
        Update: {
          id?: number;
          menu_id?: number;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'menu_category_menu_id_fkey';
            columns: ['menu_id'];
            isOneToOne: false;
            referencedRelation: 'menu';
            referencedColumns: ['id'];
          },
        ];
      };
      nutrition: {
        Row: {
          calcium: string | null;
          calories: string | null;
          cholesterol: string | null;
          dietary_fiber: string | null;
          food_item_id: number | null;
          id: number;
          ingredients: string | null;
          iron: string | null;
          potassium: string | null;
          protein: string | null;
          saturated_fat: string | null;
          serving_size: string | null;
          sodium: string | null;
          total_carbohydrates: string | null;
          total_fat: string | null;
          total_sugars: string | null;
          trans_fat: string | null;
          vitamin_d: string | null;
        };
        Insert: {
          calcium?: string | null;
          calories?: string | null;
          cholesterol?: string | null;
          dietary_fiber?: string | null;
          food_item_id?: number | null;
          id?: number;
          ingredients?: string | null;
          iron?: string | null;
          potassium?: string | null;
          protein?: string | null;
          saturated_fat?: string | null;
          serving_size?: string | null;
          sodium?: string | null;
          total_carbohydrates?: string | null;
          total_fat?: string | null;
          total_sugars?: string | null;
          trans_fat?: string | null;
          vitamin_d?: string | null;
        };
        Update: {
          calcium?: string | null;
          calories?: string | null;
          cholesterol?: string | null;
          dietary_fiber?: string | null;
          food_item_id?: number | null;
          id?: number;
          ingredients?: string | null;
          iron?: string | null;
          potassium?: string | null;
          protein?: string | null;
          saturated_fat?: string | null;
          serving_size?: string | null;
          sodium?: string | null;
          total_carbohydrates?: string | null;
          total_fat?: string | null;
          total_sugars?: string | null;
          trans_fat?: string | null;
          vitamin_d?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'nutrition_food_item_id_fkey';
            columns: ['food_item_id'];
            isOneToOne: false;
            referencedRelation: 'food_item';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      insert_location_and_menus: {
        Args: {
          arg_data: Json;
        };
        Returns: boolean;
      };
      insert_multiple_locations_and_menus: {
        Args: {
          arg_data_array: Json[];
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
