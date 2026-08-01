import { getSupabaseClient } from "../data/supabase-client.js";
import { CUSTOMER_PROTOTYPE_DATA } from "../data/customer-data.js";

export async function listCustomers(accessContext) {
  if (accessContext.isPrototype) return structuredClone(CUSTOMER_PROTOTYPE_DATA);
  const { data, error } = await getSupabaseClient()
    .from("customer_financial_summaries")
    .select("*")
    .eq("organization_id", accessContext.membership.organization_id)
    .order("company_name");
  if (error) throw error;
  return data || [];
}

export async function saveCustomer(accessContext, customer, id = null) {
  if (accessContext.isPrototype) throw new Error("PROTOTYPE_READ_ONLY");
  const client = getSupabaseClient();
  const payload = { ...customer, organization_id: accessContext.membership.organization_id };
  const query = id
    ? client.from("customers").update(payload).eq("id", id).eq("organization_id", payload.organization_id)
    : client.from("customers").insert(payload);
  const { data, error } = await query.select("*").single();
  if (error) throw error;
  return data;
}

export async function loadCustomerProjects(accessContext, customerId) {
  if (accessContext.isPrototype) return structuredClone(CUSTOMER_PROTOTYPE_DATA.find((row) => row.id === customerId)?.projects || []);
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .select("id, project_number, name, status, start_date, expected_completion_date, default_currency_code, project_services(service_types(name))")
    .eq("organization_id", accessContext.membership.organization_id)
    .eq("customer_id", customerId)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function loadCustomerStatement(accessContext, customerId) {
  if (accessContext.isPrototype) return structuredClone(CUSTOMER_PROTOTYPE_DATA.find((row) => row.id === customerId)?.statement || []);
  const client = getSupabaseClient();
  const organizationId = accessContext.membership.organization_id;
  const [invoicesResult, receiptsResult] = await Promise.all([
    client.from("customer_invoices").select("invoice_date, invoice_number, currency_code, total_original, total_base, projects(name)").eq("organization_id", organizationId).eq("customer_id", customerId).in("status", ["posted", "partially_paid", "paid"]),
    client.from("customer_receipts").select("receipt_date, receipt_number, currency_code, original_amount, base_amount").eq("organization_id", organizationId).eq("customer_id", customerId).eq("status", "posted")
  ]);
  if (invoicesResult.error) throw invoicesResult.error;
  if (receiptsResult.error) throw receiptsResult.error;
  return [
    ...(invoicesResult.data || []).map((row) => ({ date: row.invoice_date, type: "Invoice", reference: row.invoice_number, project: row.projects?.name || "—", currency: row.currency_code, original: row.total_original, debit: row.total_base, credit: 0 })),
    ...(receiptsResult.data || []).map((row) => ({ date: row.receipt_date, type: "Receipt", reference: row.receipt_number, project: "—", currency: row.currency_code, original: row.original_amount, debit: 0, credit: row.base_amount }))
  ].sort((a, b) => b.date.localeCompare(a.date));
}
