import { getSupabaseClient } from "../data/supabase-client.js";

function fallbackName(user) {
  const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (metadataName?.trim()) return metadataName.trim();

  const localPart = user?.email?.split("@")[0] || "ERP user";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function getSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signIn(email, password) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim(),
    password
  });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut({ scope: "local" });
  if (error) throw error;
}

export async function requestPasswordReset(email, redirectTo) {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
    redirectTo
  });
  if (error) throw error;
}

export async function updatePassword(password) {
  const { error } = await getSupabaseClient().auth.updateUser({ password });
  if (error) throw error;
}

export async function ensureProfile(user) {
  const client = getSupabaseClient();
  const { data: existing, error: readError } = await client
    .from("profiles")
    .select("id, full_name, avatar_path, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) throw readError;
  if (existing) return existing;

  const { data, error } = await client
    .from("profiles")
    .insert({ id: user.id, full_name: fallbackName(user) })
    .select("id, full_name, avatar_path, is_active")
    .single();

  if (error) throw error;
  return data;
}

export async function loadAccessContext(session) {
  if (!session?.user) return null;

  const client = getSupabaseClient();
  const profile = await ensureProfile(session.user);

  const { data: membership, error: membershipError } = await client
    .from("organization_memberships")
    .select("id, organization_id, default_branch_id, joined_at")
    .eq("user_id", session.user.id)
    .eq("is_active", true)
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) throw membershipError;
  if (!membership || !profile.is_active) {
    return { session, profile, membership: null, organization: null, roles: [] };
  }

  const [{ data: organization, error: organizationError }, { data: roleAssignments, error: assignmentsError }] = await Promise.all([
    client
      .from("organizations")
      .select("id, display_name, base_currency_code, timezone, is_active")
      .eq("id", membership.organization_id)
      .single(),
    client
      .from("membership_roles")
      .select("role_id")
      .eq("membership_id", membership.id)
  ]);

  if (organizationError) throw organizationError;
  if (assignmentsError) throw assignmentsError;

  const roleIds = (roleAssignments || []).map((assignment) => assignment.role_id);
  let roles = [];

  if (roleIds.length) {
    const { data: roleRows, error: rolesError } = await client
      .from("roles")
      .select("id, name, code, is_active")
      .in("id", roleIds);

    if (rolesError) throw rolesError;
    roles = (roleRows || []).filter((role) => role.is_active);
  }

  return { session, profile, membership, organization, roles };
}

export function getDisplayIdentity(accessContext) {
  const name = accessContext?.profile?.full_name || fallbackName(accessContext?.session?.user);
  const role = accessContext?.roles?.[0]?.name || "Team member";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SC";

  return { name, role, initials };
}
