-- ============================================================
-- BuyandShip Nigeria — Initial Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Enable UUID extension (already enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  nin text UNIQUE,
  nin_verified boolean DEFAULT false,
  id_document_url text,
  created_at timestamptz DEFAULT now()
);

-- RLS: customers can only read/update their own row
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_select_own" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "customers_update_own" ON customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "customers_insert_own" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- SHIPPING REQUESTS
-- ============================================================
CREATE TABLE shipping_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  origin text NOT NULL CHECK (origin IN ('USA','UK','CHINA')),
  item_name text NOT NULL,
  tracking_number text NOT NULL,
  declared_value numeric,
  declared_currency text,
  actual_weight_lbs numeric,
  actual_weight_kg numeric,
  dimensional_weight numeric,
  charged_weight numeric,
  estimated_cost numeric,
  estimated_currency text,
  delivery_address text NOT NULL,
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid')),
  paystack_reference text,
  status text DEFAULT 'pending' CHECK (
    status IN ('pending','received_at_warehouse','in_transit','out_for_delivery','delivered')
  ),
  status_history jsonb DEFAULT '[]',
  notes text,
  invoice_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_requests ENABLE ROW LEVEL SECURITY;

-- Customers see only their own
CREATE POLICY "shipping_select_own" ON shipping_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "shipping_insert_own" ON shipping_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Admins have full access (via service role — bypasses RLS)

-- ============================================================
-- PROCUREMENT REQUESTS
-- ============================================================
CREATE TABLE procurement_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  origin text NOT NULL CHECK (origin IN ('USA','UK','CHINA')),
  product_links jsonb NOT NULL DEFAULT '[]',
  estimated_cost numeric,
  procurement_fee numeric,
  total_estimate numeric,
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid')),
  paystack_reference text,
  status text DEFAULT 'pending' CHECK (
    status IN ('pending','reviewing','cost_sent','approved','purchased','shipped','delivered')
  ),
  status_history jsonb DEFAULT '[]',
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "procurement_select_own" ON procurement_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "procurement_insert_own" ON procurement_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- ============================================================
-- ADMINS
-- ============================================================
CREATE TABLE admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Only service role can insert admins (via seed script)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_select_self" ON admins
  FOR SELECT USING (auth.uid() = id);

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE settings (
  key text PRIMARY KEY,
  value text
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Admins read/write settings via service role; public can read certain keys
CREATE POLICY "settings_public_read" ON settings
  FOR SELECT USING (true);

-- ============================================================
-- STORAGE BUCKET: id-documents
-- Run separately in Supabase Dashboard > Storage
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('id-documents', 'id-documents', false);

-- Storage policy: users can upload their own docs
-- CREATE POLICY "users_upload_own_doc" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'id-documents' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================================
-- SEED INITIAL SETTINGS
-- ============================================================
INSERT INTO settings (key, value) VALUES
  ('whatsapp', '2348029155825'),
  ('admin_email', 'admin@buyandshiptonigeria.com'),
  ('business_hours', 'Mon–Fri, 9am–5pm WAT'),
  ('usa_rate_per_lb', '9'),
  ('uk_rate_per_kg', '9'),
  ('china_rate_per_kg', '10'),
  ('usa_minimum_lbs', '4'),
  ('usa_minimum_cost', '35'),
  ('uk_minimum_kg', '5'),
  ('china_minimum_kg', '10')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_shipping_customer_id ON shipping_requests(customer_id);
CREATE INDEX idx_shipping_status ON shipping_requests(status);
CREATE INDEX idx_shipping_payment_status ON shipping_requests(payment_status);
CREATE INDEX idx_shipping_tracking ON shipping_requests(tracking_number);
CREATE INDEX idx_procurement_customer_id ON procurement_requests(customer_id);
CREATE INDEX idx_procurement_status ON procurement_requests(status);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_nin ON customers(nin) WHERE nin IS NOT NULL;

-- ============================================================
-- STORAGE — invoices bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload to their own sub-folder
CREATE POLICY "Users can upload own invoices" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'invoices'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Anyone can read (URLs are not guessable — include user UUID + timestamp)
CREATE POLICY "Anyone can view invoices" ON storage.objects
  FOR SELECT USING (bucket_id = 'invoices');

-- ============================================================
-- LIVE DATABASE PATCH (run separately if schema already exists)
-- ALTER TABLE customers ADD CONSTRAINT customers_nin_unique UNIQUE (nin);
-- ALTER TABLE shipping_requests ADD COLUMN IF NOT EXISTS invoice_url text;
-- ============================================================
