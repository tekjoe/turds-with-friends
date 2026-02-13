export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string
          criteria: Json | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          id: string
          joined_at: string
          progress: number
          status: Database["public"]["Enums"]["participant_status"]
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          joined_at?: string
          progress?: number
          status?: Database["public"]["Enums"]["participant_status"]
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          joined_at?: string
          progress?: number
          status?: Database["public"]["Enums"]["participant_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: Database["public"]["Enums"]["challenge_type"]
          created_at: string
          creator_id: string
          end_date: string
          id: string
          start_date: string
          status: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at: string
        }
        Insert: {
          challenge_type: Database["public"]["Enums"]["challenge_type"]
          created_at?: string
          creator_id: string
          end_date: string
          id?: string
          start_date: string
          status?: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at?: string
        }
        Update: {
          challenge_type?: Database["public"]["Enums"]["challenge_type"]
          created_at?: string
          creator_id?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fcm_tokens: {
        Row: {
          created_at: string | null
          id: string
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          location_log_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          location_log_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          location_log_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_comments_location_log_id_fkey"
            columns: ["location_log_id"]
            isOneToOne: false
            referencedRelation: "location_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_logs: {
        Row: {
          created_at: string
          id: string
          latitude: number
          longitude: number
          movement_log_id: string
          place_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          movement_log_id: string
          place_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          movement_log_id?: string
          place_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_logs_movement_log_id_fkey"
            columns: ["movement_log_id"]
            isOneToOne: false
            referencedRelation: "movement_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      movement_logs: {
        Row: {
          bristol_type: number
          created_at: string
          id: string
          logged_at: string
          post_weight: number | null
          pre_weight: number | null
          user_id: string
          weight_unit: Database["public"]["Enums"]["weight_unit"]
          xp_earned: number
        }
        Insert: {
          bristol_type: number
          created_at?: string
          id?: string
          logged_at?: string
          post_weight?: number | null
          pre_weight?: number | null
          user_id: string
          weight_unit?: Database["public"]["Enums"]["weight_unit"]
          xp_earned?: number
        }
        Update: {
          bristol_type?: number
          created_at?: string
          id?: string
          logged_at?: string
          post_weight?: number | null
          pre_weight?: number | null
          user_id?: string
          weight_unit?: Database["public"]["Enums"]["weight_unit"]
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "movement_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          message: string
          read: boolean
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          id?: string
          message: string
          read?: boolean
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak: number
          display_name: string | null
          id: string
          invite_code: string | null
          longest_streak: number
          privacy_settings: Json | null
          stripe_customer_id: string | null
          updated_at: string
          username: string | null
          xp_total: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id: string
          invite_code?: string | null
          longest_streak?: number
          privacy_settings?: Json | null
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
          xp_total?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id?: string
          invite_code?: string | null
          longest_streak?: number
          privacy_settings?: Json | null
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
          xp_total?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          invite_code: string
          xp_awarded: boolean
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          invite_code: string
          xp_awarded?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          invite_code?: string
          xp_awarded?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_ratings: {
        Row: {
          id: string
          location_log_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          location_log_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          location_log_id?: string
          user_id?: string
          rating?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_ratings_location_log_id_fkey"
            columns: ["location_log_id"]
            isOneToOne: false
            referencedRelation: "location_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      territory_claims: {
        Row: {
          id: string
          h3_index: string
          user_id: string
          log_count: number
          last_claimed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          h3_index: string
          user_id: string
          log_count?: number
          last_claimed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          h3_index?: string
          user_id?: string
          log_count?: number
          last_claimed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_territory_claim: {
        Args: {
          p_h3_index: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      challenge_status: "pending" | "active" | "completed"
      challenge_type: "most_logs" | "longest_streak" | "most_weight_lost"
      friendship_status: "pending" | "accepted" | "blocked"
      participant_status: "invited" | "accepted" | "declined"
      subscription_plan: "monthly" | "annual"
      subscription_status: "active" | "canceled" | "past_due" | "incomplete"
      weight_unit: "lbs" | "kg"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      challenge_status: ["pending", "active", "completed"],
      challenge_type: ["most_logs", "longest_streak", "most_weight_lost"],
      friendship_status: ["pending", "accepted", "blocked"],
      participant_status: ["invited", "accepted", "declined"],
      subscription_plan: ["monthly", "annual"],
      subscription_status: ["active", "canceled", "past_due", "incomplete"],
      weight_unit: ["lbs", "kg"],
    },
  },
} as const

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type MovementLog = Database["public"]["Tables"]["movement_logs"]["Row"];
export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type LocationLog = Database["public"]["Tables"]["location_logs"]["Row"];
export type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
export type ChallengeParticipant = Database["public"]["Tables"]["challenge_participants"]["Row"];
export type LocationComment = Database["public"]["Tables"]["location_comments"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type FCMToken = Database["public"]["Tables"]["fcm_tokens"]["Row"];

// Insert types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type MovementLogInsert = Database["public"]["Tables"]["movement_logs"]["Insert"];
export type FriendshipInsert = Database["public"]["Tables"]["friendships"]["Insert"];
export type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];
export type LocationLogInsert = Database["public"]["Tables"]["location_logs"]["Insert"];
export type ChallengeInsert = Database["public"]["Tables"]["challenges"]["Insert"];
export type ChallengeParticipantInsert = Database["public"]["Tables"]["challenge_participants"]["Insert"];
export type LocationCommentInsert = Database["public"]["Tables"]["location_comments"]["Insert"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type FCMTokenInsert = Database["public"]["Tables"]["fcm_tokens"]["Insert"];
export type TerritoryClaim = Database["public"]["Tables"]["territory_claims"]["Row"];
export type TerritoryClaimInsert = Database["public"]["Tables"]["territory_claims"]["Insert"];
export type LocationRating = Database["public"]["Tables"]["location_ratings"]["Row"];
export type LocationRatingInsert = Database["public"]["Tables"]["location_ratings"]["Insert"];
export type Referral = Database["public"]["Tables"]["referrals"]["Row"];
export type ReferralInsert = Database["public"]["Tables"]["referrals"]["Insert"];
