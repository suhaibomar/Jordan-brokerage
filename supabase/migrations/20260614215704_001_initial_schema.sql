/*
# Initial Real Estate Platform Schema

1. Overview
This migration creates the foundational schema for a single-broker real estate platform in Jordan.
The admin (broker) manages all properties, owners, and customers. No public submissions allowed.

2. New Tables
- `profiles` - Extends auth.users with role information (admin/user)
- `owners` - Private owner CRM (admin only access)
- `customers` - Customer CRM managed by admin
- `properties` - Base table for all property types with common fields
- `apartments` - Apartment-specific attributes
- `lands` - Land-specific attributes  
- `buildings` - Building-specific attributes
- `building_floors` - Floor details for buildings
- `property_images` - Image gallery for properties
- `property_videos` - Video gallery for properties
- `property_views` - Analytics tracking
- `favorites` - User saved properties
- `appointments` - Property visit scheduling
- `inquiries` - Contact/inquiry submissions
- `notifications` - System notifications
- `audit_logs` - Activity tracking

3. Security
- RLS enabled on all tables
- Admin has full access to all tables
- Users can only access their own data and public property info
- Owner info is NEVER exposed publicly
- Customer data is admin-only
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
  dark_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Property Owners (PRIVATE - Admin Only)
CREATE TABLE IF NOT EXISTS owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternative_phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  last_contact_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Customers CRM (Admin Managed)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  follow_up_status TEXT DEFAULT 'new' CHECK (follow_up_status IN ('new', 'contacted', 'interested', 'not_interested', 'converted')),
  last_contact_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Base Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_number TEXT UNIQUE NOT NULL DEFAULT 'PRP-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6),
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'land', 'building')),
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  
  -- Location
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  full_address TEXT,
  google_maps_link TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Pricing
  price DECIMAL(15, 2) NOT NULL,
  price_type TEXT DEFAULT 'total' CHECK (price_type IN ('total', 'per_meter', 'per_dunum')),
  negotiable BOOLEAN DEFAULT false,
  
  -- Availability
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'archived', 'pending')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'both')),
  
  -- Owner Reference (Admin Only)
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  
  -- Contact
  public_contact_number TEXT,
  
  -- Admin Only
  internal_notes TEXT,
  
  -- Statistics
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Apartments (extends properties)
CREATE TABLE IF NOT EXISTS apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  building_age INTEGER,
  building_floors INTEGER,
  apartment_floor INTEGER,
  area DECIMAL(10, 2) NOT NULL, -- square meters
  
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  kitchens INTEGER DEFAULT 1,
  living_rooms INTEGER DEFAULT 1,
  balconies INTEGER DEFAULT 0,
  
  -- Features
  has_elevator BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_solar_system BOOLEAN DEFAULT false,
  has_water_well BOOLEAN DEFAULT false,
  is_furnished BOOLEAN DEFAULT false,
  has_air_conditioning BOOLEAN DEFAULT false,
  has_central_heating BOOLEAN DEFAULT false,
  
  monthly_service_fees DECIMAL(10, 2),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lands (extends properties)
CREATE TABLE IF NOT EXISTS lands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  area_dunum DECIMAL(10, 2) NOT NULL, -- Land area in Dunum
  
  -- Zoning
  is_residential BOOLEAN DEFAULT false,
  is_commercial BOOLEAN DEFAULT false,
  is_agricultural BOOLEAN DEFAULT false,
  is_industrial BOOLEAN DEFAULT false,
  
  -- Utilities
  has_water BOOLEAN DEFAULT false,
  has_electricity BOOLEAN DEFAULT false,
  has_sewer BOOLEAN DEFAULT false,
  has_road_access BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Buildings (extends properties)
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  land_area DECIMAL(10, 2),
  building_area DECIMAL(10, 2) NOT NULL,
  building_age INTEGER,
  total_floors INTEGER NOT NULL,
  
  has_roof BOOLEAN DEFAULT false,
  has_yard BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  has_separate_storage BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Building Floors Detail
CREATE TABLE IF NOT EXISTS building_floors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL,
  num_apartments INTEGER DEFAULT 0,
  apartment_area DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property Images
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption_ar TEXT,
  caption_en TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property Videos
CREATE TABLE IF NOT EXISTS property_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property Views Analytics
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- User Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Appointments/Property Visits
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'rescheduled', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'callback', 'question', 'visit_request')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  message_ar TEXT,
  message_en TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customer Property Interests (many-to-many)
CREATE TABLE IF NOT EXISTS customer_property_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, property_id)
);

-- Customer Communication History
CREATE TABLE IF NOT EXISTS customer_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('call', 'email', 'whatsapp', 'meeting', 'other')),
  notes TEXT,
  initiated_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Owner Deal History
CREATE TABLE IF NOT EXISTS owner_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('sale', 'rent', 'purchase')),
  amount DECIMAL(15, 2),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  deal_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lands ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_property_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_deals ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id OR is_admin()) WITH CHECK (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "admin_insert_profile" ON profiles;
CREATE POLICY "admin_insert_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- RLS Policies for owners (Admin Only)
DROP POLICY IF EXISTS "admin_owners_access" ON owners;
CREATE POLICY "admin_owners_access" ON owners
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for customers (Admin Only)
DROP POLICY IF EXISTS "admin_customers_access" ON customers;
CREATE POLICY "admin_customers_access" ON customers
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for properties
DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties" ON properties FOR SELECT
  TO anon, authenticated USING (status != 'archived' OR is_admin());

DROP POLICY IF EXISTS "admin_properties_access" ON properties;
CREATE POLICY "admin_properties_access" ON properties
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for apartments
DROP POLICY IF EXISTS "public_read_apartments" ON apartments;
CREATE POLICY "public_read_apartments" ON apartments FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = apartments.property_id));

DROP POLICY IF EXISTS "admin_apartments_access" ON apartments;
CREATE POLICY "admin_apartments_access" ON apartments
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for lands
DROP POLICY IF EXISTS "public_read_lands" ON lands;
CREATE POLICY "public_read_lands" ON lands FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = lands.property_id));

DROP POLICY IF EXISTS "admin_lands_access" ON lands;
CREATE POLICY "admin_lands_access" ON lands
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for buildings
DROP POLICY IF EXISTS "public_read_buildings" ON buildings;
CREATE POLICY "public_read_buildings" ON buildings FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = buildings.property_id));

DROP POLICY IF EXISTS "admin_buildings_access" ON buildings;
CREATE POLICY "admin_buildings_access" ON buildings
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for building_floors
DROP POLICY IF EXISTS "public_read_building_floors" ON building_floors;
CREATE POLICY "public_read_building_floors" ON building_floors FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM buildings WHERE buildings.id = building_floors.building_id));

DROP POLICY IF EXISTS "admin_building_floors_access" ON building_floors;
CREATE POLICY "admin_building_floors_access" ON building_floors
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for property_images
DROP POLICY IF EXISTS "public_read_property_images" ON property_images;
CREATE POLICY "public_read_property_images" ON property_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_property_images_access" ON property_images;
CREATE POLICY "admin_property_images_access" ON property_images
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for property_videos
DROP POLICY IF EXISTS "public_read_property_videos" ON property_videos;
CREATE POLICY "public_read_property_videos" ON property_videos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_property_videos_access" ON property_videos;
CREATE POLICY "admin_property_videos_access" ON property_videos
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for property_views
DROP POLICY IF EXISTS "admin_property_views_access" ON property_views;
CREATE POLICY "admin_property_views_access" ON property_views
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "anon_insert_property_view" ON property_views;
CREATE POLICY "anon_insert_property_view" ON property_views FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- RLS Policies for favorites (User-scoped)
DROP POLICY IF EXISTS "users_read_own_favorites" ON favorites;
CREATE POLICY "users_read_own_favorites" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_favorites" ON favorites;
CREATE POLICY "users_insert_own_favorites" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_favorites" ON favorites;
CREATE POLICY "users_delete_own_favorites" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for appointments
DROP POLICY IF EXISTS "users_read_own_appointments" ON appointments;
CREATE POLICY "users_read_own_appointments" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "admin_appointments_access" ON appointments;
CREATE POLICY "admin_appointments_access" ON appointments
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "anon_insert_appointment" ON appointments;
CREATE POLICY "anon_insert_appointment" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- RLS Policies for inquiries
DROP POLICY IF EXISTS "admin_inquiries_access" ON inquiries;
CREATE POLICY "admin_inquiries_access" ON inquiries
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "anon_insert_inquiry" ON inquiries;
CREATE POLICY "anon_insert_inquiry" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- RLS Policies for notifications
DROP POLICY IF EXISTS "users_read_own_notifications" ON notifications;
CREATE POLICY "users_read_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "users_update_own_notifications" ON notifications;
CREATE POLICY "users_update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

-- RLS Policies for audit_logs (Admin Only)
DROP POLICY IF EXISTS "admin_audit_logs_access" ON audit_logs;
CREATE POLICY "admin_audit_logs_access" ON audit_logs
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "authenticated_insert_audit_log" ON audit_logs;
CREATE POLICY "authenticated_insert_audit_log" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- RLS Policies for customer_property_interests (Admin Only)
DROP POLICY IF EXISTS "admin_customer_interests_access" ON customer_property_interests;
CREATE POLICY "admin_customer_interests_access" ON customer_property_interests
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for customer_communications (Admin Only)
DROP POLICY IF EXISTS "admin_customer_communications_access" ON customer_communications;
CREATE POLICY "admin_customer_communications_access" ON customer_communications
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for owner_deals (Admin Only)
DROP POLICY IF EXISTS "admin_owner_deals_access" ON owner_deals;
CREATE POLICY "admin_owner_deals_access" ON owner_deals
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_governorate ON properties(governorate);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_apartments_bedrooms ON apartments(bedrooms);
CREATE INDEX IF NOT EXISTS idx_apartments_bathrooms ON apartments(bathrooms);
CREATE INDEX IF NOT EXISTS idx_apartments_area ON apartments(area);

CREATE INDEX IF NOT EXISTS idx_lands_area ON lands(area_dunum);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_videos_property ON property_videos(property_id);

CREATE INDEX IF NOT EXISTS idx_property_views_property ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_date ON property_views(viewed_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON apartments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lands_updated_at BEFORE UPDATE ON lands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
