import { useEffect, useState } from 'react';
import { Storefront } from '@/components/storefront/Storefront';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useSession } from '@/lib/useSession';

function useRoute() {
  const [route, setRoute] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return route;
}

function App() {
  const route = useRoute();
  const { session, loading } = useSession();
  const isAdmin = route === '/admin';

  function go(path: string) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  if (isAdmin) {
    if (loading) {
      return <div className="grid min-h-screen place-items-center bg-canvas"><p className="text-sm text-slate-400">Cargando...</p></div>;
    }
    if (!session) return <AdminLogin onBack={() => go('/')} />;
    return <AdminLayout onExit={() => go('/')} />;
  }

  return <Storefront />;
}

export default App;
