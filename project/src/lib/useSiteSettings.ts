import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

const FALLBACK: SiteSettings = {
  id: 1,
  logo_url: null,
  store_photo_url: null,
  store_photo_title: null,
  whatsapp_number: DEFAULT_WHATSAPP_NUMBER,
  slogan: 'Una familia pensando en tu familia',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings);
      });
  }, []);

  return settings;
}
