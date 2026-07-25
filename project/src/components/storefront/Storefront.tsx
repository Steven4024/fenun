import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, Banner, Brand, Video, ProductWithCategory } from '@/lib/types';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { Header } from '@/components/storefront/Header';
import { Hero } from '@/components/storefront/Hero';
import { Brands } from '@/components/storefront/Brands';
import { CategoryCircles } from '@/components/storefront/CategoryCircles';
import { VideoReels } from '@/components/storefront/VideoReels';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { FloatingWhatsApp } from '@/components/storefront/FloatingWhatsApp';
import { Footer } from '@/components/storefront/Footer';

export function Storefront() {
  const settings = useSiteSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [cats, prods, bans, brs, vids] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('sort_order'),
        supabase.from('brands').select('*').order('sort_order'),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
      ]);
      setCategories(cats.data ?? []);
      setProducts(prods.data ?? []);
      setBanners(bans.data ?? []);
      setBrands(brs.data ?? []);
      setVideos(vids.data ?? []);
      setLoading(false);
    })();
  }, []);

  const withCategory: ProductWithCategory[] = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        category: categories.find((c) => c.id === p.category_id) ?? null,
      })),
    [products, categories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withCategory.filter((p) => {
      const matchesCat = activeCategory ? p.category?.slug === activeCategory : true;
      const matchesQuery = q
        ? p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQuery;
    });
  }, [withCategory, query, activeCategory]);

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Header query={query} onQuery={setQuery} onLogo={goHome} settings={settings} />
      <Hero banners={banners} settings={settings} />
      <Brands brands={brands} />
      <CategoryCircles categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      <ProductGrid products={filtered} loading={loading} settings={settings} />
      <VideoReels videos={videos} />
      <Footer settings={settings} categories={categories} />
      <FloatingWhatsApp settings={settings} />
    </div>
  );
}
