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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analysis_notes: {
        Row: {
          blockchain: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          is_shared: boolean
          tags: string[] | null
          token: string
          updated_at: string
          upvotes: number | null
          user_email: string
          view_count: number | null
        }
        Insert: {
          blockchain: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_shared?: boolean
          tags?: string[] | null
          token: string
          updated_at?: string
          upvotes?: number | null
          user_email: string
          view_count?: number | null
        }
        Update: {
          blockchain?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_shared?: boolean
          tags?: string[] | null
          token?: string
          updated_at?: string
          upvotes?: number | null
          user_email?: string
          view_count?: number | null
        }
        Relationships: []
      }
      analysis_votes: {
        Row: {
          analysis_id: string
          created_at: string
          id: string
          user_email: string
          vote_type: string
        }
        Insert: {
          analysis_id: string
          created_at?: string
          id?: string
          user_email: string
          vote_type: string
        }
        Update: {
          analysis_id?: string
          created_at?: string
          id?: string
          user_email?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_votes_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          blockchain: string
          created_at: string
          id: string
          message_type: string
          text: string
          updated_at: string
          user_email: string
        }
        Insert: {
          blockchain: string
          created_at?: string
          id?: string
          message_type?: string
          text: string
          updated_at?: string
          user_email: string
        }
        Update: {
          blockchain?: string
          created_at?: string
          id?: string
          message_type?: string
          text?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      crypto_payments: {
        Row: {
          amount_usd: number
          block_confirmation_count: number | null
          created_at: string
          crypto_amount: number
          crypto_currency: string
          id: string
          payment_status: string
          subscription_id: string
          transaction_hash: string | null
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          amount_usd: number
          block_confirmation_count?: number | null
          created_at?: string
          crypto_amount: number
          crypto_currency: string
          id?: string
          payment_status?: string
          subscription_id: string
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          amount_usd?: number
          block_confirmation_count?: number | null
          created_at?: string
          crypto_amount?: number
          crypto_currency?: string
          id?: string
          payment_status?: string
          subscription_id?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "crypto_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_token_picks: {
        Row: {
          blockchain: string
          confidence_score: number | null
          created_at: string
          date: string
          id: string
          is_featured: boolean | null
          market_cap_usd: number | null
          position_type: string
          price_change_24h: number | null
          price_usd: number
          rsi_4h: number | null
          signals: string[] | null
          stop_loss_usd: number | null
          target_price_usd: number | null
          token_address: string
          token_name: string
          token_symbol: string
          trade_reasoning: string
          updated_at: string
          volume_24h_usd: number | null
        }
        Insert: {
          blockchain: string
          confidence_score?: number | null
          created_at?: string
          date?: string
          id?: string
          is_featured?: boolean | null
          market_cap_usd?: number | null
          position_type?: string
          price_change_24h?: number | null
          price_usd: number
          rsi_4h?: number | null
          signals?: string[] | null
          stop_loss_usd?: number | null
          target_price_usd?: number | null
          token_address: string
          token_name: string
          token_symbol: string
          trade_reasoning: string
          updated_at?: string
          volume_24h_usd?: number | null
        }
        Update: {
          blockchain?: string
          confidence_score?: number | null
          created_at?: string
          date?: string
          id?: string
          is_featured?: boolean | null
          market_cap_usd?: number | null
          position_type?: string
          price_change_24h?: number | null
          price_usd?: number
          rsi_4h?: number | null
          signals?: string[] | null
          stop_loss_usd?: number | null
          target_price_usd?: number | null
          token_address?: string
          token_name?: string
          token_symbol?: string
          trade_reasoning?: string
          updated_at?: string
          volume_24h_usd?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_sol: number
          amount_usd: number
          buyer_wallet_address: string
          completed_at: string | null
          created_at: string
          dispute_created_at: string | null
          dispute_reason: string | null
          escrow_address: string | null
          id: string
          notes: string | null
          product_id: string
          seller_wallet_address: string
          shipping_address: Json | null
          status: string | null
          tracking_number: string | null
          transaction_hash: string | null
          updated_at: string
        }
        Insert: {
          amount_sol: number
          amount_usd: number
          buyer_wallet_address: string
          completed_at?: string | null
          created_at?: string
          dispute_created_at?: string | null
          dispute_reason?: string | null
          escrow_address?: string | null
          id?: string
          notes?: string | null
          product_id: string
          seller_wallet_address: string
          shipping_address?: Json | null
          status?: string | null
          tracking_number?: string | null
          transaction_hash?: string | null
          updated_at?: string
        }
        Update: {
          amount_sol?: number
          amount_usd?: number
          buyer_wallet_address?: string
          completed_at?: string | null
          created_at?: string
          dispute_created_at?: string | null
          dispute_reason?: string | null
          escrow_address?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          seller_wallet_address?: string
          shipping_address?: Json | null
          status?: string | null
          tracking_number?: string | null
          transaction_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string
          certificate_url: string | null
          condition: string
          created_at: string
          description: string
          features: string[] | null
          id: string
          images: string[] | null
          likes: number | null
          price_sol: number | null
          price_usd: number
          seller_wallet_address: string
          serial_number: string | null
          status: string | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          brand?: string | null
          category: string
          certificate_url?: string | null
          condition: string
          created_at?: string
          description: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          likes?: number | null
          price_sol?: number | null
          price_usd: number
          seller_wallet_address: string
          serial_number?: string | null
          status?: string | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          brand?: string | null
          category?: string
          certificate_url?: string | null
          condition?: string
          created_at?: string
          description?: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          likes?: number | null
          price_sol?: number | null
          price_usd?: number
          seller_wallet_address?: string
          serial_number?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_verified: boolean | null
          member_since: string
          reputation_score: number | null
          total_sales: number | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          member_since?: string
          reputation_score?: number | null
          total_sales?: number | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          member_since?: string
          reputation_score?: number | null
          total_sales?: number | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_cycle: string
          created_at: string
          features: Json
          id: string
          name: string
          price_usd: number
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          features?: Json
          id?: string
          name: string
          price_usd: number
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          features?: Json
          id?: string
          name?: string
          price_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          crypto_payment_address: string | null
          id: string
          payment_transaction_hash: string | null
          plan_id: string
          status: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crypto_payment_address?: string | null
          id?: string
          payment_transaction_hash?: string | null
          plan_id: string
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crypto_payment_address?: string | null
          id?: string
          payment_transaction_hash?: string | null
          plan_id?: string
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      whale_stats: {
        Row: {
          address: string
          avg_buy_size_usd: number | null
          id: string
          last_seen: string | null
          realized_pnl_usd: number | null
          trade_count: number
          updated_at: string
          win_rate: number | null
        }
        Insert: {
          address: string
          avg_buy_size_usd?: number | null
          id?: string
          last_seen?: string | null
          realized_pnl_usd?: number | null
          trade_count?: number
          updated_at?: string
          win_rate?: number | null
        }
        Update: {
          address?: string
          avg_buy_size_usd?: number | null
          id?: string
          last_seen?: string | null
          realized_pnl_usd?: number | null
          trade_count?: number
          updated_at?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "whale_stats_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "whale_wallets"
            referencedColumns: ["address"]
          },
        ]
      }
      whale_trades: {
        Row: {
          address: string
          amount: number | null
          block_time: string | null
          created_at: string
          id: string
          price_usd: number | null
          side: string | null
          token_mint: string | null
          tx_signature: string | null
          usd_value: number | null
        }
        Insert: {
          address: string
          amount?: number | null
          block_time?: string | null
          created_at?: string
          id?: string
          price_usd?: number | null
          side?: string | null
          token_mint?: string | null
          tx_signature?: string | null
          usd_value?: number | null
        }
        Update: {
          address?: string
          amount?: number | null
          block_time?: string | null
          created_at?: string
          id?: string
          price_usd?: number | null
          side?: string | null
          token_mint?: string | null
          tx_signature?: string | null
          usd_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "whale_trades_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "whale_wallets"
            referencedColumns: ["address"]
          },
        ]
      }
      whale_wallets: {
        Row: {
          address: string
          created_at: string
          is_active: boolean
          label: string | null
          source: string
        }
        Insert: {
          address: string
          created_at?: string
          is_active?: boolean
          label?: string | null
          source?: string
        }
        Update: {
          address?: string
          created_at?: string
          is_active?: boolean
          label?: string | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
