import { getSession, loadAccessContext, signOut } from "../services/auth-service.js";
import { hasSupabaseConfiguration } from "../data/supabase-client.js";

function authUrl(state) {
  const url = new URL("../../../pages/auth/", import.meta.url);
  url.searchParams.set("return_to", window.location.href);
  if (state) url.searchParams.set("state", state);
  return url.href;
}

export async function requireAuthorizedUser() {
  if (!hasSupabaseConfiguration()) {
    const search = window.top === window ? window.location.search : window.top.location.search;
    const previewModule = new URLSearchParams(search).get("prototype");
    if (["customers", "projects", "accounting", "banking"].includes(previewModule)) {
      return {
        isPrototype: true,
        profile: { full_name: "Ahmad Iqbal" },
        membership: { organization_id: "prototype" },
        organization: { id: "prototype", display_name: "Shaikh China Sourcing", is_active: true },
        roles: [{ name: "Administrator", code: "admin" }]
      };
    }
    window.location.replace(authUrl("configuration_required"));
    return null;
  }

  const session = await getSession();
  if (!session) {
    window.location.replace(authUrl("signed_out"));
    return null;
  }

  const accessContext = await loadAccessContext(session);
  if (!accessContext?.membership || !accessContext.organization?.is_active) {
    window.location.replace(authUrl("pending"));
    return null;
  }

  return accessContext;
}

export async function performSignOut() {
  await signOut();
  window.location.replace(authUrl("signed_out"));
}
