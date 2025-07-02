export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      allergens: {
        Row: {
          beef: boolean | null
          egg: boolean | null
          fish: boolean | null
          food_item_id: number | null
          halal: boolean | null
          id: number
          milk: boolean | null
          peanuts: boolean | null
          pork: boolean | null
          sesame_seeds: boolean | null
          shellfish: boolean | null
          soy: boolean | null
          tree_nuts: boolean | null
          vegan: boolean | null
          vegetarian: boolean | null
          wheat: boolean | null
        }
        Insert: {
          beef?: boolean | null
          egg?: boolean | null
          fish?: boolean | null
          food_item_id?: number | null
          halal?: boolean | null
          id?: number
          milk?: boolean | null
          peanuts?: boolean | null
          pork?: boolean | null
          sesame_seeds?: boolean | null
          shellfish?: boolean | null
          soy?: boolean | null
          tree_nuts?: boolean | null
          vegan?: boolean | null
          vegetarian?: boolean | null
          wheat?: boolean | null
        }
        Update: {
          beef?: boolean | null
          egg?: boolean | null
          fish?: boolean | null
          food_item_id?: number | null
          halal?: boolean | null
          id?: number
          milk?: boolean | null
          peanuts?: boolean | null
          pork?: boolean | null
          sesame_seeds?: boolean | null
          shellfish?: boolean | null
          soy?: boolean | null
          tree_nuts?: boolean | null
          vegan?: boolean | null
          vegetarian?: boolean | null
          wheat?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "allergens_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_item"
            referencedColumns: ["id"]
          },
        ]
      }
      app_information: {
        Row: {
          about_description: string | null
          about_title: string | null
          created_at: string
          credits_contributors: Json | null
          id: string
          support_links: Json | null
          updated_at: string | null
        }
        Insert: {
          about_description?: string | null
          about_title?: string | null
          created_at?: string
          credits_contributors?: Json | null
          id?: string
          support_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          about_description?: string | null
          about_title?: string | null
          created_at?: string
          credits_contributors?: Json | null
          id?: string
          support_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      food_item: {
        Row: {
          allergens_id: number | null
          id: number
          link: string | null
          menu_category_id: number | null
          name: string | null
          nutrition_id: number | null
        }
        Insert: {
          allergens_id?: number | null
          id?: number
          link?: string | null
          menu_category_id?: number | null
          name?: string | null
          nutrition_id?: number | null
        }
        Update: {
          allergens_id?: number | null
          id?: number
          link?: string | null
          menu_category_id?: number | null
          name?: string | null
          nutrition_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "food_item_allergens_id_fkey"
            columns: ["allergens_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_item_menu_category_id_fkey"
            columns: ["menu_category_id"]
            isOneToOne: false
            referencedRelation: "menu_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_item_nutrition_id_fkey"
            columns: ["nutrition_id"]
            isOneToOne: false
            referencedRelation: "nutrition"
            referencedColumns: ["id"]
          },
        ]
      }
      location: {
        Row: {
          address: string
          apple_maps_link: string
          colloquial_name: string | null
          created_at: string | null
          description: string
          display_order: number
          force_close: boolean
          google_maps_link: string
          has_menus: boolean | null
          id: string
          image: string | null
          meal_times: Json[]
          methods_of_payment: Database["public"]["Enums"]["payment_method"][]
          name: string | null
          regular_service_hours: Json
          type_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string
          apple_maps_link?: string
          colloquial_name?: string | null
          created_at?: string | null
          description?: string
          display_order?: number
          force_close?: boolean
          google_maps_link?: string
          has_menus?: boolean | null
          id?: string
          image?: string | null
          meal_times?: Json[]
          methods_of_payment?: Database["public"]["Enums"]["payment_method"][]
          name?: string | null
          regular_service_hours?: Json
          type_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          apple_maps_link?: string
          colloquial_name?: string | null
          created_at?: string | null
          description?: string
          display_order?: number
          force_close?: boolean
          google_maps_link?: string
          has_menus?: boolean | null
          id?: string
          image?: string | null
          meal_times?: Json[]
          methods_of_payment?: Database["public"]["Enums"]["payment_method"][]
          name?: string | null
          regular_service_hours?: Json
          type_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "location_type"
            referencedColumns: ["id"]
          },
        ]
      }
      location_type: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu: {
        Row: {
          date: string
          id: number
          location_id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          date: string
          id?: number
          location_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          date?: string
          id?: number
          location_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_category: {
        Row: {
          id: number
          menu_id: number
          title: string | null
        }
        Insert: {
          id?: number
          menu_id: number
          title?: string | null
        }
        Update: {
          id?: number
          menu_id?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_category_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition: {
        Row: {
          calcium: string | null
          calories: string | null
          cholesterol: string | null
          dietary_fiber: string | null
          food_item_id: number | null
          id: number
          ingredients: string | null
          iron: string | null
          potassium: string | null
          protein: string | null
          saturated_fat: string | null
          serving_size: string | null
          sodium: string | null
          total_carbohydrates: string | null
          total_fat: string | null
          total_sugars: string | null
          trans_fat: string | null
          vitamin_d: string | null
        }
        Insert: {
          calcium?: string | null
          calories?: string | null
          cholesterol?: string | null
          dietary_fiber?: string | null
          food_item_id?: number | null
          id?: number
          ingredients?: string | null
          iron?: string | null
          potassium?: string | null
          protein?: string | null
          saturated_fat?: string | null
          serving_size?: string | null
          sodium?: string | null
          total_carbohydrates?: string | null
          total_fat?: string | null
          total_sugars?: string | null
          trans_fat?: string | null
          vitamin_d?: string | null
        }
        Update: {
          calcium?: string | null
          calories?: string | null
          cholesterol?: string | null
          dietary_fiber?: string | null
          food_item_id?: number | null
          id?: number
          ingredients?: string | null
          iron?: string | null
          potassium?: string | null
          protein?: string | null
          saturated_fat?: string | null
          serving_size?: string | null
          sodium?: string | null
          total_carbohydrates?: string | null
          total_fat?: string | null
          total_sugars?: string | null
          trans_fat?: string | null
          vitamin_d?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_item"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_location_and_menus: {
        Args: { arg_data: Json }
        Returns: boolean
      }
      insert_multiple_locations_and_menus: {
        Args: { arg_data_array: Json[] }
        Returns: boolean
      }
    }
    Enums: {
      payment_method: "Bevo Pay" | "Cash" | "Credit/Debit" | "Dine In Dollars"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      payment_method: ["Bevo Pay", "Cash", "Credit/Debit", "Dine In Dollars"],
    },
  },
} as const

