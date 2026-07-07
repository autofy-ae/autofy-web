import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export type Listing = {
  id: string;
  owner_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  location: string | null;
  description: string | null;
  status: string;
  created_at: string;
  expires_at: string;
  trim: string | null;
  specification: string | null;
  interior_color: string | null;
  exterior_color: string | null;
  drivetrain: string | null;
  fuel_type: string | null;
  engine: string | null;
  transmission: string | null;
  seats: number | null;
  horsepower: string | null;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  whatsapp_preferred: boolean;
};

export type ListingPhoto = {
  id: string;
  listing_id: string;
  url: string;
  position: number;
};
