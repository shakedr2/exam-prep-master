export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      topics: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          icon?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          topic_id: string
          text: string
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          correct_answer: string | null
          explanation: string | null
          difficulty: string | null
          question_type: string
          code_snippet: string | null
          expected_output: string | null
          pattern_family: string | null
          common_mistake: string | null
        }
        Insert: {
          id?: string
          topic_id: string
          text: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          correct_answer?: string | null
          explanation?: string | null
          difficulty?: string | null
          question_type: string
          code_snippet?: string | null
          expected_output?: string | null
          pattern_family?: string | null
          common_mistake?: string | null
        }
        Update: {
          id?: string
          topic_id?: string
          text?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          correct_answer?: string | null
          explanation?: string | null
          difficulty?: string | null
          question_type?: string
          code_snippet?: string | null
          expected_output?: string | null
          pattern_family?: string | null
          common_mistake?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          username: string | null
          last_topic_id: string | null
          last_question_index: number | null
          welcome_email_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          last_topic_id?: string | null
          last_question_index?: number | null
          welcome_email_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          last_topic_id?: string | null
          last_question_index?: number | null
          welcome_email_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          question_id: string
          topic_id: string
          is_correct: boolean
          answered_at: string
          attempts: number
          last_attempted_at: string
          pattern_family: string | null
          common_mistake: string | null
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          topic_id: string
          is_correct: boolean
          answered_at?: string
          attempts?: number
          last_attempted_at?: string
          pattern_family?: string | null
          common_mistake?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          topic_id?: string
          is_correct?: boolean
          answered_at?: string
          attempts?: number
          last_attempted_at?: string
          pattern_family?: string | null
          common_mistake?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          }
        ]
      }
      user_learning_progress: {
        Row: {
          id: number
          user_id: string
          topic_id: string
          concept_index: number
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          topic_id: string
          concept_index: number
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          topic_id?: string
          concept_index?: number
          completed_at?: string
        }
        Relationships: []
      }
      user_topic_completions: {
        Row: {
          id: number
          user_id: string
          topic_id: string
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          topic_id: string
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          topic_id?: string
          completed_at?: string
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          user_id: string
          xp: number
          level: number
          updated_at: string
        }
        Insert: {
          user_id: string
          xp?: number
          level?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          xp?: number
          level?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_xp_events: {
        Row: {
          id: number
          user_id: string
          amount: number
          reason: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          amount: number
          reason: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          amount?: number
          reason?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      topic_progress: {
        Row: {
          id: number
          user_id: string
          topic_id: string
          module_id: string
          lesson_id: string
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          topic_id: string
          module_id: string
          lesson_id: string
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          topic_id?: string
          module_id?: string
          lesson_id?: string
          completed_at?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          user_id: string
          milestone: string
          achieved_at: string
        }
        Insert: {
          user_id: string
          milestone: string
          achieved_at?: string
        }
        Update: {
          user_id?: string
          milestone?: string
          achieved_at?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          user_id: string
          completed: boolean
          goal_daily_questions: number | null
          goal_exam_date: string | null
          preferred_topics: string[]
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          completed?: boolean
          goal_daily_questions?: number | null
          goal_exam_date?: string | null
          preferred_topics?: string[]
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          completed?: boolean
          goal_daily_questions?: number | null
          goal_exam_date?: string | null
          preferred_topics?: string[]
          completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          user_id: string
          total_questions_answered: number
          correct_answers: number
          total_practice_time_seconds: number
          current_streak: number
          longest_streak: number
          last_activity_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          total_questions_answered?: number
          correct_answers?: number
          total_practice_time_seconds?: number
          current_streak?: number
          longest_streak?: number
          last_activity_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_questions_answered?: number
          correct_answers?: number
          total_practice_time_seconds?: number
          current_streak?: number
          longest_streak?: number
          last_activity_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_data: {
        Args: { p_user_id: string }
        Returns: {
          learning: Array<{ topic_id: string; concept_index: number }>
          topic_counts: Record<string, number>
        }
      }
      upsert_user_progress: {
        Args: {
          p_user_id: string
          p_question_id: string
          p_topic_id: string
          p_is_correct: boolean
        }
        Returns: { attempts: number; answered_at: string }
      }
      award_xp: {
        Args: {
          p_amount: number
          p_reason: string
          p_metadata?: Json
        }
        Returns: { xp: number; level: number; leveled_up: boolean }[]
      }
      touch_streak: {
        Args: Record<string, never>
        Returns: {
          current_streak: number
          longest_streak: number
          incremented: boolean
        }[]
      }
      claim_milestone: {
        Args: { p_milestone: string }
        Returns: boolean
      }
      get_dashboard_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      backfill_dashboard_stats: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
