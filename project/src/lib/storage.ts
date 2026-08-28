import { supabase } from '@/lib/supabase';

const BUCKET = 'images';

export async function uploadImage(file: File, folder: string): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}

export async function uploadVideo(file: File, folder: string): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const filename = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: '3600', upsert: false, contentType: file.type,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}
