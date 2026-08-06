// Hand-written database types matching supabase/migrations/0001_init.sql.
// Kept inline to avoid depending on the Supabase CLI codegen step. The structure
// follows @supabase/supabase-js GenericSchema so deep query inference works.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          author: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          tags: string[] | null;
          meta_title: string | null;
          meta_description: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          author?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          tags?: string[] | null;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          author?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          tags?: string[] | null;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          published: boolean;
          created_at: string;
          updated_at: string;
          meta_title: string | null;
          meta_description: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
