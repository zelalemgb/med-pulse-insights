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
      conditional_permissions: {
        Row: {
          conditions: Json
          created_at: string
          expires_at: string | null
          facility_id: string | null
          granted_by: string | null
          id: string
          is_active: boolean
          permission_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conditions?: Json
          created_at?: string
          expires_at?: string | null
          facility_id?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean
          permission_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          expires_at?: string | null
          facility_id?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean
          permission_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conditional_permissions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "health_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_specific_roles: {
        Row: {
          facility_id: string
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          facility_id: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          facility_id?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_specific_roles_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "health_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
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
      navigation_analytics: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          page_visited: string
          referrer_page: string | null
          session_id: string | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          page_visited: string
          referrer_page?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          page_visited?: string
          referrer_page?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      permission_usage_log: {
        Row: {
          access_granted: boolean
          access_method: string | null
          conditions_met: Json | null
          created_at: string
          facility_id: string | null
          id: string
          ip_address: unknown | null
          permission_name: string
          resource_id: string | null
          resource_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_granted?: boolean
          access_method?: string | null
          conditions_met?: Json | null
          created_at?: string
          facility_id?: string | null
          id?: string
          ip_address?: unknown | null
          permission_name: string
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_granted?: boolean
          access_method?: string | null
          conditions_met?: Json | null
          created_at?: string
          facility_id?: string | null
          id?: string
          ip_address?: unknown | null
          permission_name?: string
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_usage_log_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "health_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          can_approve_associations: boolean
          created_at: string
          department: string | null
          email: string
          facility_id: string | null
          full_name: string | null
          id: string
          is_active: boolean
          is_facility_owner: boolean | null
          language: string | null
          last_login_at: string | null
          login_count: number | null
          primary_facility_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          can_approve_associations?: boolean
          created_at?: string
          department?: string | null
          email: string
          facility_id?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          is_facility_owner?: boolean | null
          language?: string | null
          last_login_at?: string | null
          login_count?: number | null
          primary_facility_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          can_approve_associations?: boolean
          created_at?: string
          department?: string | null
          email?: string
          facility_id?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          is_facility_owner?: boolean | null
          language?: string | null
          last_login_at?: string | null
          login_count?: number | null
          primary_facility_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
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
      role_audit_log: {
        Row: {
          action: string
          created_at: string
          facility_id: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_role: Database["public"]["Enums"]["user_role"] | null
          old_role: Database["public"]["Enums"]["user_role"] | null
          reason: string | null
          role_type: string
          target_user_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          facility_id?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_role?: Database["public"]["Enums"]["user_role"] | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          role_type: string
          target_user_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          facility_id?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_role?: Database["public"]["Enums"]["user_role"] | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          role_type?: string
          target_user_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_audit_log_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "health_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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
      user_management_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["user_role"] | null
          new_status: string | null
          old_role: Database["public"]["Enums"]["user_role"] | null
          old_status: string | null
          reason: string | null
          target_user_id: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"] | null
          new_status?: string | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          old_status?: string | null
          reason?: string | null
          target_user_id: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"] | null
          new_status?: string | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          old_status?: string | null
          reason?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          id: string
          notification_settings: Json | null
          theme_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_settings?: Json | null
          theme_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_settings?: Json | null
          theme_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      approve_user: {
        Args: {
          _user_id: string
          _approved_by: string
          _new_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      bulk_assign_facility_roles: {
        Args: {
          _user_ids: string[]
          _facility_id: string
          _role: Database["public"]["Enums"]["user_role"]
          _granted_by: string
        }
        Returns: number
      }
      can_approve_associations: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      change_user_role: {
        Args: {
          _user_id: string
          _changed_by: string
          _new_role: Database["public"]["Enums"]["user_role"]
          _reason?: string
        }
        Returns: boolean
      }
      check_conditional_permissions: {
        Args: {
          _user_id: string
          _facility_id: string
          _permission_name: string
          _current_time?: string
          _user_location?: Json
        }
        Returns: boolean
      }
      create_default_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_first_admin: {
        Args: { _user_id: string; _email: string; _full_name: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          _user_id: string
          _title: string
          _message: string
          _type?: string
          _action_url?: string
          _expires_at?: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_effective_role_for_facility: {
        Args: { _user_id: string; _facility_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_role_audit_analytics: {
        Args: { _start_date?: string; _end_date?: string }
        Returns: Json
      }
      get_user_dashboard_stats: {
        Args: { _user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_national_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      log_permission_usage: {
        Args: {
          _user_id: string
          _permission_name: string
          _resource_type: string
          _resource_id?: string
          _facility_id?: string
          _access_granted?: boolean
          _access_method?: string
          _conditions_met?: Json
          _session_id?: string
        }
        Returns: string
      }
      log_role_change: {
        Args: {
          _user_id: string
          _target_user_id: string
          _action: string
          _role_type: string
          _old_role?: Database["public"]["Enums"]["user_role"]
          _new_role?: Database["public"]["Enums"]["user_role"]
          _facility_id?: string
          _reason?: string
          _metadata?: Json
        }
        Returns: string
      }
      reject_user: {
        Args: { _user_id: string; _rejected_by: string; _reason?: string }
        Returns: boolean
      }
      track_navigation: {
        Args: {
          _user_id: string
          _page_visited: string
          _referrer_page?: string
          _session_id?: string
          _device_type?: string
        }
        Returns: string
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
        | "facility_officer"
        | "facility_manager"
        | "data_analyst"
        | "program_manager"
        | "procurement"
        | "finance"
        | "qa"
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
        "facility_officer",
        "facility_manager",
        "data_analyst",
        "program_manager",
        "procurement",
        "finance",
        "qa",
      ],
    },
  },
} as const
