-- Re-assert the administrative write policies for the two catalog tables.
-- The dashboard authenticates administrators with Supabase Auth.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_insert_categories" ON public.categories;
DROP POLICY IF EXISTS "auth_update_categories" ON public.categories;
DROP POLICY IF EXISTS "auth_delete_categories" ON public.categories;
CREATE POLICY "auth_insert_categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_categories" ON public.categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_categories" ON public.categories FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON public.products;
DROP POLICY IF EXISTS "auth_update_products" ON public.products;
DROP POLICY IF EXISTS "auth_delete_products" ON public.products;
CREATE POLICY "auth_insert_products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_products" ON public.products FOR DELETE TO authenticated USING (true);
