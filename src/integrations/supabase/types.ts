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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          session_token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          feedback: string | null
          file_name: string
          file_path: string
          file_type: string
          graded: boolean | null
          graded_at: string | null
          graded_by: string | null
          id: string
          marks: number | null
          student_email: string
          student_id: string
          student_name: string
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          feedback?: string | null
          file_name: string
          file_path: string
          file_type: string
          graded?: boolean | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          marks?: number | null
          student_email: string
          student_id: string
          student_name: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          feedback?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          graded?: boolean | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          marks?: number | null
          student_email?: string
          student_id?: string
          student_name?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          class_id: string
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          is_active: boolean | null
          max_marks: number
          results_released: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          max_marks?: number
          results_released?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          max_marks?: number
          results_released?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_tokens: {
        Row: {
          created_at: string
          id: string
          tokens_limit: number
          tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tokens_limit?: number
          tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tokens_limit?: number
          tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      class_enrollments: {
        Row: {
          auto_suspended: boolean | null
          class_id: string
          enrolled_at: string
          enrolled_by: string
          id: string
          is_active: boolean | null
          last_payment_date: string | null
          payment_amount: number | null
          payment_due_date: string | null
          payment_status: string | null
          student_email: string
          student_id: string
          suspension_reason: string | null
        }
        Insert: {
          auto_suspended?: boolean | null
          class_id: string
          enrolled_at?: string
          enrolled_by: string
          id?: string
          is_active?: boolean | null
          last_payment_date?: string | null
          payment_amount?: number | null
          payment_due_date?: string | null
          payment_status?: string | null
          student_email: string
          student_id: string
          suspension_reason?: string | null
        }
        Update: {
          auto_suspended?: boolean | null
          class_id?: string
          enrolled_at?: string
          enrolled_by?: string
          id?: string
          is_active?: boolean | null
          last_payment_date?: string | null
          payment_amount?: number | null
          payment_due_date?: string | null
          payment_status?: string | null
          student_email?: string
          student_id?: string
          suspension_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string
          year_level: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string
          year_level?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string
          year_level?: string
        }
        Relationships: []
      }
      downloads_materials: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          link: string
          material_type: string
          order_number: number | null
          title: string
          updated_at: string | null
          year: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          link: string
          material_type: string
          order_number?: number | null
          title: string
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          link?: string
          material_type?: string
          order_number?: number | null
          title?: string
          updated_at?: string | null
          year?: string | null
        }
        Relationships: []
      }
      exam_class_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          class_id: string
          exam_id: string
          id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          class_id: string
          exam_id: string
          id?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          class_id?: string
          exam_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_class_assignments_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          auto_activate: boolean | null
          auto_deactivate: boolean | null
          created_at: string
          created_by: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number
          end_time: string | null
          id: string
          start_time: string | null
          status: Database["public"]["Enums"]["exam_status"]
          subject: string
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          auto_activate?: boolean | null
          auto_deactivate?: boolean | null
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["exam_status"]
          subject?: string
          title: string
          total_marks?: number
          updated_at?: string
        }
        Update: {
          auto_activate?: boolean | null
          auto_deactivate?: boolean | null
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["exam_status"]
          subject?: string
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: []
      }
      learned_responses: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          response_text: string
          trigger_phrase: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          response_text: string
          trigger_phrase: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          response_text?: string
          trigger_phrase?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          last_login_at: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          account_status?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          last_login_at?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          category: string | null
          correct_answer: string | null
          created_at: string
          created_by: string
          difficulty_level: string | null
          id: string
          is_active: boolean | null
          marks: number
          options: Json | null
          programming_language:
            | Database["public"]["Enums"]["programming_language"]
            | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sample_code: string | null
          subject: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          created_at?: string
          created_by: string
          difficulty_level?: string | null
          id?: string
          is_active?: boolean | null
          marks?: number
          options?: Json | null
          programming_language?:
            | Database["public"]["Enums"]["programming_language"]
            | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sample_code?: string | null
          subject?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          created_at?: string
          created_by?: string
          difficulty_level?: string | null
          id?: string
          is_active?: boolean | null
          marks?: number
          options?: Json | null
          programming_language?:
            | Database["public"]["Enums"]["programming_language"]
            | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sample_code?: string | null
          subject?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          exam_id: string
          id: string
          marks: number
          options: Json | null
          order_number: number
          programming_language:
            | Database["public"]["Enums"]["programming_language"]
            | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sample_code: string | null
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          exam_id: string
          id?: string
          marks?: number
          options?: Json | null
          order_number?: number
          programming_language?:
            | Database["public"]["Enums"]["programming_language"]
            | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sample_code?: string | null
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          exam_id?: string
          id?: string
          marks?: number
          options?: Json | null
          order_number?: number
          programming_language?:
            | Database["public"]["Enums"]["programming_language"]
            | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sample_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      student_feedback: {
        Row: {
          created_at: string | null
          exam_id: string | null
          feedback_text: string
          id: string
          rating: number | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          exam_id?: string | null
          feedback_text: string
          id?: string
          rating?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          exam_id?: string | null
          feedback_text?: string
          id?: string
          rating?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_feedback_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      student_submissions: {
        Row: {
          answers: Json
          exam_id: string
          grade_details: Json | null
          graded: boolean | null
          grading_requested_at: string | null
          grading_status: string | null
          id: string
          max_score: number | null
          student_email: string | null
          student_name: string
          submitted_at: string
          time_taken_minutes: number | null
          total_score: number | null
        }
        Insert: {
          answers: Json
          exam_id: string
          grade_details?: Json | null
          graded?: boolean | null
          grading_requested_at?: string | null
          grading_status?: string | null
          id?: string
          max_score?: number | null
          student_email?: string | null
          student_name: string
          submitted_at?: string
          time_taken_minutes?: number | null
          total_score?: number | null
        }
        Update: {
          answers?: Json
          exam_id?: string
          grade_details?: Json | null
          graded?: boolean | null
          grading_requested_at?: string | null
          grading_status?: string | null
          id?: string
          max_score?: number | null
          student_email?: string | null
          student_name?: string
          submitted_at?: string
          time_taken_minutes?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_submissions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      study_tips: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          ai_response: string | null
          context_keywords: string[] | null
          id: string
          interaction_type: string | null
          sentiment: number | null
          session_id: string | null
          timestamp: string
          topics: string[] | null
          user_input: string
        }
        Insert: {
          ai_response?: string | null
          context_keywords?: string[] | null
          id?: string
          interaction_type?: string | null
          sentiment?: number | null
          session_id?: string | null
          timestamp?: string
          topics?: string[] | null
          user_input: string
        }
        Update: {
          ai_response?: string | null
          context_keywords?: string[] | null
          id?: string
          interaction_type?: string | null
          sentiment?: number | null
          session_id?: string | null
          timestamp?: string
          topics?: string[] | null
          user_input?: string
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
    }
    Views: {
      enrollment_payment_status: {
        Row: {
          auto_suspended: boolean | null
          class_id: string | null
          class_name: string | null
          enrolled_at: string | null
          id: string | null
          is_active: boolean | null
          last_payment_date: string | null
          payment_amount: number | null
          payment_due_date: string | null
          payment_status: string | null
          student_email: string | null
          student_id: string | null
          student_name: string | null
          subject: string | null
          suspension_reason: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_chat_tokens: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_chat_tokens: { Args: { _user_id: string }; Returns: undefined }
      request_grading: { Args: { submission_uuid: string }; Returns: boolean }
      suspend_overdue_enrollments: { Args: never; Returns: undefined }
      update_exam_status_by_schedule: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "student" | "user"
      exam_status: "draft" | "active" | "completed" | "archived"
      programming_language:
        | "python"
        | "java"
        | "vb"
        | "c"
        | "cpp"
        | "javascript"
      question_type: "multiple_choice" | "coding" | "flowchart" | "short_answer"
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
      app_role: ["admin", "student", "user"],
      exam_status: ["draft", "active", "completed", "archived"],
      programming_language: ["python", "java", "vb", "c", "cpp", "javascript"],
      question_type: ["multiple_choice", "coding", "flowchart", "short_answer"],
    },
  },
} as const
