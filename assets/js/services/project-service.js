import { getSupabaseClient } from "../data/supabase-client.js";
import { PROJECT_PROTOTYPE_DATA, PROJECT_PROTOTYPE_SETUP } from "../data/project-data.js";

const clone = (value) => structuredClone(value);

export async function listProjects(accessContext) {
  if (accessContext.isPrototype) return clone(PROJECT_PROTOTYPE_DATA);
  const { data, error } = await getSupabaseClient().from("project_financial_summaries").select("*").eq("organization_id", accessContext.membership.organization_id).order("start_date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function loadProjectSetup(accessContext) {
  if (accessContext.isPrototype) return clone(PROJECT_PROTOTYPE_SETUP);
  const client = getSupabaseClient();
  const organizationId = accessContext.membership.organization_id;
  const [customers, branches, services, memberships] = await Promise.all([
    client.from("customers").select("id, company_name").eq("organization_id", organizationId).eq("is_active", true).order("company_name"),
    client.from("branches").select("id, name").eq("organization_id", organizationId).eq("is_active", true).order("name"),
    client.from("service_types").select("id, code, name").eq("organization_id", organizationId).eq("is_active", true).order("name"),
    client.from("organization_memberships").select("user_id, profiles!organization_memberships_user_id_fkey(id, full_name)").eq("organization_id", organizationId).eq("is_active", true)
  ]);
  for (const result of [customers, branches, services, memberships]) if (result.error) throw result.error;
  return { customers: customers.data || [], branches: branches.data || [], serviceTypes: services.data || [], managers: (memberships.data || []).map((row) => row.profiles).filter(Boolean) };
}

export async function saveProject(accessContext, project, id = null) {
  if (accessContext.isPrototype) throw new Error("PROTOTYPE_READ_ONLY");
  const { service_type_ids, primary_service_type_id, ...header } = project;
  const { data, error } = await getSupabaseClient().rpc("save_project", { p_project_id: id, p_payload: { ...header, organization_id: accessContext.membership.organization_id }, p_service_type_ids: service_type_ids, p_primary_service_type_id: primary_service_type_id });
  if (error) throw error;
  return data;
}

export async function loadProjectTransactions(accessContext, project) {
  if (accessContext.isPrototype) return clone(project.transactions || {});
  const client = getSupabaseClient();
  const org = accessContext.membership.organization_id;
  const [invoices, bills, expenses] = await Promise.all([
    client.from("customer_invoices").select("id, invoice_date, invoice_number, currency_code, total_original, total_base, status, customers(company_name)").eq("organization_id", org).eq("project_id", project.id).order("invoice_date", { ascending: false }),
    client.from("supplier_bill_lines").select("bill_id, original_amount, base_amount, supplier_bills!inner(bill_date, bill_number, currency_code, status, suppliers(company_name))").eq("organization_id", org).eq("project_id", project.id),
    client.from("expense_lines").select("original_amount, base_amount, expenses!inner(expense_date, expense_number, currency_code, status, payee_name)").eq("organization_id", org).eq("project_id", project.id)
  ]);
  for (const result of [invoices, bills, expenses]) if (result.error) throw result.error;
  const invoiceIds = (invoices.data || []).map((r) => r.id);
  const billIds = [...new Set((bills.data || []).map((r) => r.bill_id))];
  const [receiptAllocations, paymentAllocations] = await Promise.all([
    invoiceIds.length ? client.from("customer_receipt_allocations").select("receipt_currency_amount, settled_base_amount, customer_receipts!inner(receipt_date, receipt_number, currency_code, status, customers(company_name))").eq("organization_id", org).in("invoice_id", invoiceIds) : Promise.resolve({ data: [], error: null }),
    billIds.length ? client.from("supplier_payment_allocations").select("payment_currency_amount, settled_base_amount, supplier_payments!inner(payment_date, payment_number, currency_code, status, suppliers(company_name))").eq("organization_id", org).in("bill_id", billIds) : Promise.resolve({ data: [], error: null })
  ]);
  if (receiptAllocations.error) throw receiptAllocations.error;
  if (paymentAllocations.error) throw paymentAllocations.error;
  return {
    invoices: (invoices.data || []).map((r) => ({ date: r.invoice_date, reference: r.invoice_number, party: r.customers?.company_name, currency: r.currency_code, original: r.total_original, base: r.total_base, status: r.status })),
    receipts: (receiptAllocations.data || []).map((r) => ({ date: r.customer_receipts.receipt_date, reference: r.customer_receipts.receipt_number, party: r.customer_receipts.customers?.company_name, currency: r.customer_receipts.currency_code, original: r.receipt_currency_amount, base: r.settled_base_amount, status: r.customer_receipts.status })),
    payments: (paymentAllocations.data || []).map((r) => ({ date: r.supplier_payments.payment_date, reference: r.supplier_payments.payment_number, party: r.supplier_payments.suppliers?.company_name, currency: r.supplier_payments.currency_code, original: r.payment_currency_amount, base: r.settled_base_amount, status: r.supplier_payments.status })),
    bills: (bills.data || []).map((r) => ({ date: r.supplier_bills.bill_date, reference: r.supplier_bills.bill_number, party: r.supplier_bills.suppliers?.company_name, currency: r.supplier_bills.currency_code, original: r.original_amount, base: r.base_amount, status: r.supplier_bills.status })),
    expenses: (expenses.data || []).map((r) => ({ date: r.expenses.expense_date, reference: r.expenses.expense_number, party: r.expenses.payee_name, currency: r.expenses.currency_code, original: r.original_amount, base: r.base_amount, status: r.expenses.status }))
  };
}

export async function loadProjectServiceProfitability(accessContext, project) {
  if (accessContext.isPrototype) return clone(project.service_profitability || []);
  const { data, error } = await getSupabaseClient().from("project_service_financial_summaries").select("service, revenue_base, direct_cost_base").eq("organization_id", accessContext.membership.organization_id).eq("project_id", project.id).order("service");
  if (error) throw error;
  return (data || []).map((row) => ({ service: row.service, revenue: row.revenue_base, cost: row.direct_cost_base }));
}

export async function addProjectNote(accessContext, projectId, text) {
  if (accessContext.isPrototype) throw new Error("PROTOTYPE_READ_ONLY");
  const { error } = await getSupabaseClient().from("project_notes").insert({ organization_id: accessContext.membership.organization_id, project_id: projectId, note_text: text, created_by: accessContext.profile.id });
  if (error) throw error;
}
