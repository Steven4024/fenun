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
import { CartDrawer, type CartItem } from '@/components/storefront/CartDrawer';
import { CategoryHero } from '@/components/storefront/CategoryHero';

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

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

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return withCategory.filter((product) => product.name.toLowerCase().includes(q) || (product.description?.toLowerCase().includes(q) ?? false) || product.tags.some((tag) => tag.toLowerCase().includes(q)));
  }, [withCategory, query]);

  const selectedCategory = categories.find((category) => category.slug === activeCategory) ?? null;
  const recommendations = useMemo(() => activeCategory ? withCategory.filter((product) => product.category?.slug !== activeCategory && product.stock > 0).slice(0, 4) : [], [withCategory, activeCategory]);

  const addToCart = (product: ProductWithCategory) => {
    setCart((current) => {
      const item = current.find((entry) => entry.product.id === product.id);
      if (item) return current.map((entry) => entry.product.id === product.id ? { ...entry, quantity: Math.min(entry.quantity + 1, product.stock) } : entry);
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => setCart((current) => current.flatMap((item) => item.product.id === id ? (quantity > 0 ? [{ ...item, quantity: Math.min(quantity, item.product.stock) }] : []) : [item]));

  const selectResult = (product: ProductWithCategory) => {
    setQuery('');
    setActiveCategory(product.category?.slug ?? null);
    window.setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Header query={query} onQuery={setQuery} onLogo={goHome} settings={settings} results={searchResults} onSelectResult={selectResult} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => setCartOpen(true)} />
      <Hero banners={banners} settings={settings} />
      <Brands brands={brands} />
      <CategoryCircles categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      {selectedCategory && <CategoryHero category={selectedCategory} onBack={() => { setActiveCategory(null); window.setTimeout(() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }} />}
      <ProductGrid products={filtered} loading={loading} settings={settings} title={selectedCategory ? `Categoría: ${selectedCategory.name}` : 'Catálogo'} onAdd={addToCart} />
      {selectedCategory && recommendations.length > 0 && <ProductGrid products={recommendations} loading={false} settings={settings} title="También te puede interesar" onAdd={addToCart} />}
      <VideoReels videos={videos} />
      <Footer settings={settings} categories={categories} />
      <FloatingWhatsApp settings={settings} />
      <CartDrawer items={cart} open={cartOpen} onClose={() => setCartOpen(false)} onQuantity={updateQuantity} settings={settings} />
    </div>
  );
}
