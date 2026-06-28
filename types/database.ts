export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          plan: 'free' | 'starter' | 'pro' | 'agency'
          credits_text: number
          credits_image: number
          credits_video: number
          affiliate_code: string | null
          referred_by: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'starter' | 'pro' | 'agency'
          credits_text?: number
          credits_image?: number
          credits_video?: number
          affiliate_code?: string | null
          referred_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'starter' | 'pro' | 'agency'
          credits_text?: number
          credits_image?: number
          credits_video?: number
          affiliate_code?: string | null
          referred_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'starter' | 'pro' | 'agency'
          status: 'active' | 'cancelled' | 'past_due' | 'pending'
          asaas_subscription_id: string | null
          current_period_start: string
          current_period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'starter' | 'pro' | 'agency'
          status: 'active' | 'cancelled' | 'past_due' | 'pending'
          asaas_subscription_id?: string | null
          current_period_start?: string
          current_period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'starter' | 'pro' | 'agency'
          status?: 'active' | 'cancelled' | 'past_due' | 'pending'
          asaas_subscription_id?: string | null
          current_period_start?: string
          current_period_end?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          product_name: string
          product_description: string | null
          target_audience: string | null
          niche: string | null
          status: 'active' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          product_name: string
          product_description?: string | null
          target_audience?: string | null
          niche?: string | null
          status?: 'active' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          product_name?: string
          product_description?: string | null
          target_audience?: string | null
          niche?: string | null
          status?: 'active' | 'archived'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      script_generations: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          product_name: string
          target_audience: string | null
          main_pain: string | null
          main_desire: string | null
          tone: string
          platform: string
          hook: string
          script_body: string
          cta: string
          variations: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          product_name: string
          target_audience?: string | null
          main_pain?: string | null
          main_desire?: string | null
          tone: string
          platform: string
          hook: string
          script_body: string
          cta: string
          variations: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          product_name?: string
          target_audience?: string | null
          main_pain?: string | null
          main_desire?: string | null
          tone?: string
          platform?: string
          hook?: string
          script_body?: string
          cta?: string
          variations?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      image_generations: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          prompt_used: string
          image_url: string
          image_type: string
          platform: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          prompt_used: string
          image_url: string
          image_type: string
          platform: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          prompt_used?: string
          image_url?: string
          image_type?: string
          platform?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      video_generations: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          script_id: string | null
          status: 'processing' | 'completed' | 'failed'
          video_url: string | null
          thumbnail_url: string | null
          duration_seconds: number | null
          provider: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          script_id?: string | null
          status?: 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          duration_seconds?: number | null
          provider: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          script_id?: string | null
          status?: 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          duration_seconds?: number | null
          provider?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_generations_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "script_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      viral_library: {
        Row: {
          id: string
          title: string
          content: string
          type: 'hook' | 'script' | 'cta' | 'caption'
          niche: string | null
          emotion: string | null
          platform: string
          performance_score: number
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: 'hook' | 'script' | 'cta' | 'caption'
          niche?: string | null
          emotion?: string | null
          platform?: string
          performance_score?: number
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'hook' | 'script' | 'cta' | 'caption'
          niche?: string | null
          emotion?: string | null
          platform?: string
          performance_score?: number
          is_featured?: boolean
          created_at?: string
        }
        Relationships: []
      }
      trending_products: {
        Row: {
          id: string
          name: string
          description: string
          niche: string
          image_url: string
          opportunity_score: number
          competition_level: 'baixa' | 'média' | 'alta'
          trend_reason: string
          affiliate_links: Json
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          niche: string
          image_url: string
          opportunity_score: number
          competition_level: 'baixa' | 'média' | 'alta'
          trend_reason: string
          affiliate_links: Json
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          niche?: string
          image_url?: string
          opportunity_score?: number
          competition_level?: 'baixa' | 'média' | 'alta'
          trend_reason?: string
          affiliate_links?: Json
          is_featured?: boolean
          created_at?: string
        }
        Relationships: []
      }
      affiliate_referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          subscription_id: string | null
          commission_amount: number
          status: 'pending' | 'paid'
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          subscription_id?: string | null
          commission_amount: number
          status?: 'pending' | 'paid'
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          subscription_id?: string | null
          commission_amount?: number
          status?: 'pending' | 'paid'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_credit: {
        Args: {
          user_id: string
          credit_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
