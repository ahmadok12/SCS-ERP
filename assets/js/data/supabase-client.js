import { PUBLIC_CONFIG, isSupabaseConfigured } from "../config/public-config.js";

let client;

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  if (!globalThis.supabase?.createClient) {
    throw new Error("SUPABASE_CLIENT_UNAVAILABLE");
  }

  if (!client) {
    client = globalThis.supabase.createClient(
      PUBLIC_CONFIG.supabaseUrl,
      PUBLIC_CONFIG.supabasePublishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce"
        }
      }
    );
  }

  return client;
}

export function hasSupabaseConfiguration() {
  return isSupabaseConfigured();
}
