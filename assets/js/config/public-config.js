export const PUBLIC_CONFIG = Object.freeze({
  supabaseUrl: "https://lkskjdydvbvjtezbbxzn.supabase.co",
  supabasePublishableKey: "sb_publishable_cC8QPnLKjXr-sYNxzgRWsA_v2tkySxg",
  appName: "Shaikh China Sourcing ERP"
});

export function isSupabaseConfigured(config = PUBLIC_CONFIG) {
  const urlIsValid = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.supabaseUrl);
  const keyIsPresent = Boolean(config.supabasePublishableKey)
    && !config.supabasePublishableKey.includes("YOUR_SUPABASE");

  return urlIsValid && keyIsPresent;
}
