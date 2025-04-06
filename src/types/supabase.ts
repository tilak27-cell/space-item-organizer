
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
      cargo_items: {
        Row: {
          id: string
          name: string
          priority: string
          status: string
          location: string
          weight: number
          volume: number
          last_modified: string
          expiration_date: string | null
          usage_count: number
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          priority: string
          status: string
          location: string
          weight: number
          volume: number
          last_modified?: string
          expiration_date?: string | null
          usage_count?: number
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          priority?: string
          status?: string
          location?: string
          weight?: number
          volume?: number
          last_modified?: string
          expiration_date?: string | null
          usage_count?: number
          user_id?: string | null
        }
      }
      storage_containers: {
        Row: {
          id: string
          name: string
          capacity: number
          used_capacity: number
          location: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          capacity: number
          used_capacity?: number
          location: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          capacity?: number
          used_capacity?: number
          location?: string
          user_id?: string | null
        }
      }
      action_logs: {
        Row: {
          id: string
          timestamp: string
          action: string
          item_id: string
          item_name: string
          location: string | null
          user: string
          details: string | null
        }
        Insert: {
          id?: string
          timestamp?: string
          action: string
          item_id: string
          item_name: string
          location?: string | null
          user: string
          details?: string | null
        }
        Update: {
          id?: string
          timestamp?: string
          action?: string
          item_id?: string
          item_name?: string
          location?: string | null
          user?: string
          details?: string | null
        }
      }
    }
  }
}
