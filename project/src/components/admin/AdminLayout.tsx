import { useState } from 'react';
import { LayoutDashboard, Tag, Package, Image, Film, LogOut, Store, Settings, ImagePlus, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { StorePhotosManager } from '@/components/admin/StorePhotosManager';
import { VideosManager } from '@/components/admin/VideosManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { BannersManager } from '@/components/admin/BannersManager';
import { BrandsManager } from '@/components/admin/BrandsManager';

type Tab = 'dashboard' | 'settings' | 'categories' | 'products' | 'photos' | 'videos' | 'banners' | 'brands';

interface Props {
  onExit: () => void;
}

const nav: { id: Tab; label: string; icon: typeof Tag }[] = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'settings', label: 'Ajustes', icon: Settings },
  { id: 'banners', label: 'Banners', icon: ImagePlus },
  { id: 'categories', label: 'Categorías', icon: Tag },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'brands', label: 'Marcas', icon: Award },
  { id: 'photos', label: 'Fotos locales', icon: Image },
  { id: 'videos', label: 'Videos', icon: Film },
];

export function AdminLayout({ onExit }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard');

  async function signOut() {
    await supabase.auth.signOut();
    onExit();
  }

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <aside className="border-b border-slate-100 bg-white lg:h-screen lg:w-64 lg:shrink-0 lg:border-r">
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white">
            <span className="text-lg font-extrabold">F</span>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">FENUN</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </button>
            );
          })}
          <button
            onClick={signOut}
            className="mt-auto flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="container-app py-8">
          {tab === 'dashboard' && <Dashboard onJump={setTab} />}
          {tab === 'settings' && <SettingsManager />}
          {tab === 'banners' && <BannersManager />}
          {tab === 'categories' && <CategoriesManager />}
          {tab === 'products' && <ProductsManager />}
          {tab === 'brands' && <BrandsManager />}
          {tab === 'photos' && <StorePhotosManager />}
          {tab === 'videos' && <VideosManager />}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ onJump }: { onJump: (t: Tab) => void }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Resumen</h1>
      <p className="mt-1 text-sm text-slate-500">Gestiona el contenido visible en la tienda FENUN.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {nav.slice(1).map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => onJump(n.id)}
              className="card group flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-1 hover:shadow-cardHover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{n.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 card p-6">
        <div className="flex items-center gap-3">
          <Store className="h-5 w-5 text-ink" />
          <h2 className="text-lg font-bold text-ink">Bienvenido al panel</h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Desde aquí puedes crear, editar y eliminar categorías, productos, fotos de tus locales y videos de novedades.
          Los cambios se reflejan inmediatamente en la tienda pública.
        </p>
      </div>
    </div>
  );
}
