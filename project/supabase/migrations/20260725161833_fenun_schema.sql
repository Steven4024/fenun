/*
# FENUN hardware store schema

1. Overview
   Public e-commerce storefront for the FENUN hardware store. Customers browse
   categories, products, store photos and "novedades" (new-arrival reels) without
   signing in. A private /admin route is protected by Supabase email/password auth;
   only authenticated admins can create/edit/delete content.

2. New Tables
   - `categories` ... product categories shown as circular nav icons.
       id (uuid pk), name (text not null), slug (text unique not null),
       icon (text, lucide icon name), image_url (text), sort_order (int default 0),
       created_at (timestamptz default now()).
   - `products` ... catalog items.
       id (uuid pk), name (text not null), description (text),
       category_id (uuid fk -> categories on delete set null),
       image_url (text), video_url (text), tags (text[] default '{}'),
       price (numeric(10,2) nullable), created_at (timestamptz default now()).
   - `store_photos` ... photos of physical store locations shown in the hero.
       id (uuid pk), title (text), image_url (text not null),
       sort_order (int default 0), created_at (timestamptz default now()).
   - `videos` ... vertical "reels" of new arrivals.
       id (uuid pk), title (text), video_url (text not null),
       created_at (timestamptz default now()).

3. Security
   - RLS enabled on every table.
   - Public read: SELECT for `anon, authenticated` (USING true) because the
     storefront is intentionally public and shared.
   - Admin write: INSERT/UPDATE/DELETE for `authenticated` only (USING/WITH CHECK
     true). The /admin route uses Supabase email/password auth, so only signed-in
     admins can mutate content. No multi-tenant ownership column is needed because
     there is a single shared catalog.

4. Notes
   - No user_id columns: this is a single-tenant shared catalog, not per-user data.
   - Email confirmation stays OFF so the admin can sign in immediately.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  video_url text,
  tags text[] NOT NULL DEFAULT '{}',
  price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  video_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- categories policies
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- products policies
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- store_photos policies
DROP POLICY IF EXISTS "anon_select_store_photos" ON store_photos;
CREATE POLICY "anon_select_store_photos" ON store_photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_store_photos" ON store_photos;
CREATE POLICY "auth_insert_store_photos" ON store_photos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_store_photos" ON store_photos;
CREATE POLICY "auth_update_store_photos" ON store_photos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_store_photos" ON store_photos;
CREATE POLICY "auth_delete_store_photos" ON store_photos FOR DELETE
  TO authenticated USING (true);

-- videos policies
DROP POLICY IF EXISTS "anon_select_videos" ON videos;
CREATE POLICY "anon_select_videos" ON videos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_videos" ON videos;
CREATE POLICY "auth_insert_videos" ON videos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_videos" ON videos;
CREATE POLICY "auth_update_videos" ON videos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_videos" ON videos;
CREATE POLICY "auth_delete_videos" ON videos FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_store_photos_sort_order ON store_photos(sort_order);
