export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      health_facilities: {
        Row: {
          capacity: number | null
          catchment_area: number | null
          code: string | null
          created_at: string
          created_by: string | null
          equipment_inventory: Json | null
          facility_type: string
          hmis_indicators: Json | null
          id: string
          latitude: number | null
          level: string
          longitude: number | null
          name: string
          operational_status: string | null
          region: string
          services_offered: string[] | null
          staff_count: number | null
          updated_at: string
          wereda: string | null
          zone: string
        }
        Insert: {
          capacity?: number | null
          catchment_area?: number | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          equipment_inventory?: Json | null
          facility_type: string
          hmis_indicators?: Json | null
          id?: string
          latitude?: number | null
          level: string
          longitude?: number | null
          name: string
          operational_status?: string | null
          region: string
          services_offered?: string[] | null
          staff_count?: number | null
          updated_at?: string
          wereda?: string | null
          zone: string
        }
        Update: {
          capacity?: number | null
          catchment_area?: number | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          equipment_inventory?: Json | null
          facility_type?: string
          hmis_indicators?: Json | null
          id?: string
          latitude?: number | null
          level?: string
          longitude?: number | null
          name?: string
          operational_status?: string | null
          region?: string
          services_offered?: string[] | null
          staff_count?: number | null
          updated_at?: string
          wereda?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_facilities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          can_approve_associations: boolean
          created_at: string
          department: string | null
          email: string
          facility_id: string | null
          full_name: string | null
          id: string
          is_active: boolean
          is_facility_owner: boolean | null
          primary_facility_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          can_approve_associations?: boolean
          created_at?: string
          department?: string | null
          email: string
          facility_id?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          is_facility_owner?: boolean | null
          primary_facility_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          can_approve_associations?: boolean
          created_at?: string
          department?: string | null
          email?: string
          facility_id?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          is_facility_owner?: boolean | null
          primary_facility_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_facility_id_fkey"
            columns: ["primary_facility_id"]
            isOneToOne: false
            referencedRelation: "health_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_facility_associations: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          association_type: string
          facility_id: string
          id: string
          notes: string | null
          requested_at: string
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          association_type: string
          facility_id: string
          id?: string
          notes?: string | null
          requested_at?: string
          user_id: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          association_type?: string
          facility_id?: string
          id?: string
          notes?: string | null
          requested_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_facility_associations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_facility_associations_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "health_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_facility_associations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          facility_id: string | null
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          facility_id?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          facility_id?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      user_has_facility_access: {
        Args: {
          _user_id: string
          _facility_id: string
          _required_type?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "admin"
        | "manager"
        | "analyst"
        | "viewer"
        | "zonal"
        | "regional"
        | "national"
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
  public: {
    Enums: {
      user_role: [
        "admin",
        "manager",
        "analyst",
        "viewer",
        "zonal",
        "regional",
        "national",
      ],
    },
  },
} as const
