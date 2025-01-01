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
      alerts: {
        Row: {
          id: string
          title: string
          message: string
          type: string
          urgency: string
          city: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: string
          urgency: string
          city: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: string
          urgency?: string
          city?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string | null
          start_time: string
          end_time: string
          image_url: string | null
          city: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location?: string | null
          start_time: string
          end_time: string
          image_url?: string | null
          city: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string | null
          start_time?: string
          end_time?: string
          image_url?: string | null
          city?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      marketplace_items: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number | null
          category: string | null
          image_urls: string[] | null
          status: string | null
          city: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number | null
          category?: string | null
          image_urls?: string[] | null
          status?: string | null
          city: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number | null
          category?: string | null
          image_urls?: string[] | null
          status?: string | null
          city?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          image_url: string | null
          sender_id: string | null
          receiver_id: string | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          image_url?: string | null
          sender_id?: string | null
          receiver_id?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          image_url?: string | null
          sender_id?: string | null
          receiver_id?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          username: string | null
          neighborhood: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          neighborhood?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          neighborhood?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_neighborhood: {
        Args: {
          lat: number
          lon: number
        }
        Returns: string
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