/*
# FENUN visual identity & data update

1. Overview
   Extends the FENUN schema to support the brand identity update: an official
   logo, rotating banners, allied brands, real contact info, and product stock.

2. New Tables
   - `site_settings` ... single-row table holding global brand settings.
       id (int pk, default 1), logo_url (text), store_photo_url (text),
       store_photo_title (text), whatsapp_number (text), slogan (text).
   - `banners` ... rotating/static banners for the homepage hero.
       id (uuid pk), title (text), image_url (text not null), link_url (text),
       sort_order (int default 0), active (bool default true), created_at.
   - `brands` ... allied brand logos ("Marcas con las que trabajamos").
       id (uuid pk), name (text not null), logo_url (text), sort_order (int default 0),
       created_at.

3. Modified Tables
   - `products` ... add `stock` (int, default 0) to track availability.

4. Security
   - RLS enabled on all new tables.
   - Public read (anon, authenticated) for banners, brands, site_settings.
   - Admin write (authenticated only) for all new tables.
   - products already has authenticated write policies; the new stock column is
     covered by the existing UPDATE policy.

5. Notes
   - site_settings is seeded with a single row (id=1) with sensible defaults so
     the frontend always has a settings row to read.
   - Default WhatsApp number set to the real FENUN number (51927324371).
*/

-- site_settings (single row, id fixed at 1)
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  logo_url text,
  store_photo_url text,
  store_photo_title text,
  whatsapp_number text NOT NULL DEFAULT '51927324371',
  slogan text NOT NULL DEFAULT 'Una familia pensando en tu familia',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- banners
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  link_url text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_banners" ON banners;
CREATE POLICY "anon_select_banners" ON banners FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_banners" ON banners;
CREATE POLICY "auth_insert_banners" ON banners FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_banners" ON banners;
CREATE POLICY "auth_update_banners" ON banners FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_banners" ON banners;
CREATE POLICY "auth_delete_banners" ON banners FOR DELETE
  TO authenticated USING (true);

-- brands
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_brands" ON brands;
CREATE POLICY "anon_select_brands" ON brands FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_brands" ON brands;
CREATE POLICY "auth_insert_brands" ON brands FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_brands" ON brands;
CREATE POLICY "auth_update_brands" ON brands FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_brands" ON brands;
CREATE POLICY "auth_delete_brands" ON brands FOR DELETE
  TO authenticated USING (true);

-- add stock column to products
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'products' AND column_name = 'stock') THEN
    ALTER TABLE products ADD COLUMN stock int NOT NULL DEFAULT 0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_banners_sort_order ON banners(sort_order);
CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands(sort_order);
