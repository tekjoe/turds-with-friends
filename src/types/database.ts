export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          stripe_customer_id: string | null;
          xp_total: number;
          current_streak: number;
          longest_streak: number;
          privacy_settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          xp_total?: number;
          current_streak?: number;
          longest_streak?: number;
          privacy_settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          xp_total?: number;
          current_streak?: number;
          longest_streak?: number;
          privacy_settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      movement_logs: {
        Row: {
          id: string;
          user_id: string;
          bristol_type: number;
          pre_weight: number | null;
          post_weight: number | null;
          weight_unit: "lbs" | "kg";
          logged_at: string;
          xp_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bristol_type: number;
          pre_weight?: number | null;
          post_weight?: number | null;
          weight_unit?: "lbs" | "kg";
          logged_at?: string;
          xp_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bristol_type?: number;
          pre_weight?: number | null;
          post_weight?: number | null;
          weight_unit?: "lbs" | "kg";
          logged_at?: string;
          xp_earned?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movement_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: "pending" | "accepted" | "blocked";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: "pending" | "accepted" | "blocked";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: "pending" | "accepted" | "blocked";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friendships_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friendships_addressee_id_fkey";
            columns: ["addressee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          criteria: Json | null;
          icon_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          criteria?: Json | null;
          icon_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          criteria?: Json | null;
          icon_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          status: "active" | "canceled" | "past_due" | "incomplete";
          plan: "monthly" | "annual";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          status?: "active" | "canceled" | "past_due" | "incomplete";
          plan: "monthly" | "annual";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string;
          status?: "active" | "canceled" | "past_due" | "incomplete";
          plan?: "monthly" | "annual";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      location_logs: {
        Row: {
          id: string;
          movement_log_id: string;
          user_id: string;
          latitude: number;
          longitude: number;
          place_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          movement_log_id: string;
          user_id: string;
          latitude: number;
          longitude: number;
          place_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          movement_log_id?: string;
          user_id?: string;
          latitude?: number;
          longitude?: number;
          place_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "location_logs_movement_log_id_fkey";
            columns: ["movement_log_id"];
            isOneToOne: false;
            referencedRelation: "movement_logs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "location_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      challenges: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          challenge_type: "most_logs" | "longest_streak" | "most_weight_lost";
          start_date: string;
          end_date: string;
          status: "pending" | "active" | "completed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          challenge_type: "most_logs" | "longest_streak" | "most_weight_lost";
          start_date: string;
          end_date: string;
          status?: "pending" | "active" | "completed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          challenge_type?: "most_logs" | "longest_streak" | "most_weight_lost";
          start_date?: string;
          end_date?: string;
          status?: "pending" | "active" | "completed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenges_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      challenge_participants: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          progress: number;
          status: "invited" | "accepted" | "declined";
          joined_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          progress?: number;
          status?: "invited" | "accepted" | "declined";
          joined_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          progress?: number;
          status?: "invited" | "accepted" | "declined";
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "challenge_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          table_name: string;
          record_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          table_name: string;
          record_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          table_name?: string;
          record_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      friendship_status: "pending" | "accepted" | "blocked";
      subscription_status: "active" | "canceled" | "past_due" | "incomplete";
      subscription_plan: "monthly" | "annual";
      weight_unit: "lbs" | "kg";
      challenge_type: "most_logs" | "longest_streak" | "most_weight_lost";
      challenge_status: "pending" | "active" | "completed";
      participant_status: "invited" | "accepted" | "declined";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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

// Insert types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type MovementLogInsert = Database["public"]["Tables"]["movement_logs"]["Insert"];
export type FriendshipInsert = Database["public"]["Tables"]["friendships"]["Insert"];
export type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];
export type LocationLogInsert = Database["public"]["Tables"]["location_logs"]["Insert"];
export type ChallengeInsert = Database["public"]["Tables"]["challenges"]["Insert"];
export type ChallengeParticipantInsert = Database["public"]["Tables"]["challenge_participants"]["Insert"];
