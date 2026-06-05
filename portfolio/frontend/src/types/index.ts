// Types pour le Portfolio

export interface Profile {
  id?: number;
  name: string;
  title: string;
  bio?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  photo_url?: string;
  social_links?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface Diploma {
  id?: number;
  title: string;
  institution: string;
  year: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id?: number;
  job_title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id?: number;
  name: string;
  category: string;
  level: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  technologies?: string[];
  image_url?: string;
  github_link?: string;
  live_link?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
}