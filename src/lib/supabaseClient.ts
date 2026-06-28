import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function sanitizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let clean = url.trim();
  // Remove trailing slashes
  while (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  // Remove /rest/v1 suffix if present
  if (clean.toLowerCase().endsWith('/rest/v1')) {
    clean = clean.slice(0, -8);
  } else if (clean.toLowerCase().endsWith('/restv1')) {
    clean = clean.slice(0, -7);
  }
  // Trim trailing slashes again just in case
  while (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

export function initSupabase(url: string, anonKey: string) {
  if (!url || !anonKey || url.includes('placeholder') || anonKey.includes('placeholder')) {
    supabaseInstance = null;
    return null;
  }
  const cleanUrl = sanitizeSupabaseUrl(url);
  supabaseInstance = createClient(cleanUrl, anonKey);
  return supabaseInstance;
}

export function getSupabase() {
  return supabaseInstance;
}
