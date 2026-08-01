import { getSupabaseClient } from "../data/supabase-client.js";
import { ACCOUNTING_PROTOTYPE_DATA } from "../data/accounting-data.js";

const clone = (value) => structuredClone(value);

async function query(client, table, organizationId, order = null) {
  let request = client.from(table).select("*").eq("organization_id", organizationId);
  if (order) request = request.order(order.column, { ascending: order.ascending ?? true });
  const { data, error } = await request;
  if (error) throw error;
  return data || [];
}

export async function loadAccountingWorkspace(accessContext) {
  if (accessContext.isPrototype) return clone(ACCOUNTING_PROTOTYPE_DATA);
  const client = getSupabaseClient();
  const organizationId = accessContext.membership.organization_id;
  const [accounts, journals, ledger, trialBalance, incomeStatement, balanceSheet, receivables, payables] = await Promise.all([
    query(client, "accounts", organizationId, { column: "code" }),
    query(client, "accounting_journal_register", organizationId, { column: "entry_date", ascending: false }),
    query(client, "general_ledger_rows", organizationId, { column: "entry_date", ascending: false }),
    query(client, "trial_balance_rows", organizationId, { column: "account_code" }),
    query(client, "income_statement_rows", organizationId, { column: "account_code" }),
    query(client, "balance_sheet_rows", organizationId, { column: "account_code" }),
    query(client, "accounts_receivable_open_items", organizationId, { column: "due_date" }),
    query(client, "accounts_payable_open_items", organizationId, { column: "due_date" })
  ]);
  const totals = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
  const revenue = totals(incomeStatement.filter((r) => r.account_type === "revenue"), "report_amount");
  const cost = totals(incomeStatement.filter((r) => r.account_type === "cost_of_sales"), "report_amount");
  const operating = totals(incomeStatement.filter((r) => r.account_type === "operating_expense"), "report_amount");
  return {
    summary: { period: "Current period", revenue, grossProfit: revenue - cost, netProfit: revenue - cost - operating, receivables: totals(receivables, "outstanding_base"), payables: totals(payables, "outstanding_base"), assets: totals(balanceSheet.filter((r) => r.account_type === "asset"), "report_amount"), liabilities: totals(balanceSheet.filter((r) => r.account_type === "liability"), "report_amount"), equity: totals(balanceSheet.filter((r) => r.account_type === "equity"), "report_amount") },
    accounts: accounts.map((r) => ({ ...r, type: r.account_type, parent: r.parent_account_id, normal: r.normal_balance, control: r.control_type || (r.allow_manual_posting ? "Posting" : "Header"), active: r.is_active })),
    journals: journals.map((r) => ({ id: r.id, number: r.entry_number, date: r.entry_date, type: r.entry_type, description: r.description, branch: r.branch_name, debit: r.total_debit, credit: r.total_credit, status: r.status, source: r.source_reference, lines: [] })),
    ledger: ledger.map((r) => ({ date: r.entry_date, journal: r.entry_number, account: `${r.account_code} ${r.account_name}`, description: r.description, branch: r.branch_name, project: r.project_number || "—", debit: r.base_debit, credit: r.base_credit, balance: r.running_balance })),
    trialBalance: trialBalance.map((r) => ({ code: r.account_code, account: r.account_name, type: r.account_type, debit: r.debit_balance, credit: r.credit_balance })),
    incomeStatement: incomeStatement.map((r) => ({ group: r.account_type, label: r.account_name, amount: Number(r.report_amount) * (r.account_type === "revenue" || r.account_type === "other_income" ? 1 : -1) })),
    balanceSheet: balanceSheet.map((r) => ({ group: r.account_type, label: r.account_name, amount: r.report_amount })),
    receivables: receivables.map((r) => ({ party: r.customer_name, document: r.invoice_number, project: r.project_number, due: r.due_date, currency: r.currency_code, original: r.total_original, base: r.total_base, outstanding: r.outstanding_base, age: r.age_bucket })),
    payables: payables.map((r) => ({ party: r.supplier_name, document: r.bill_number, project: r.project_number || "—", due: r.due_date, currency: r.currency_code, original: r.total_original, base: r.total_base, outstanding: r.outstanding_base, age: r.age_bucket }))
  };
}

export async function loadJournalLines(accessContext, journal) {
  if (accessContext.isPrototype) return clone(journal.lines || []);
  const { data, error } = await getSupabaseClient().from("general_ledger_rows").select("*").eq("organization_id", accessContext.membership.organization_id).eq("journal_entry_id", journal.id).order("line_number");
  if (error) throw error;
  return (data || []).map((r) => ({ account: `${r.account_code} ${r.account_name}`, description: r.description, currency: r.original_currency_code, originalDebit: r.original_debit, originalCredit: r.original_credit, rate: r.exchange_rate, debit: r.base_debit, credit: r.base_credit, project: r.project_number || "—" }));
}

export async function postManualJournal(accessContext, payload) {
  if (accessContext.isPrototype) throw new Error("PROTOTYPE_READ_ONLY");
  const { data, error } = await getSupabaseClient().rpc("post_manual_journal", {
    p_organization_id: accessContext.membership.organization_id,
    p_branch_id: payload.branchId,
    p_entry_date: payload.date,
    p_description: payload.description,
    p_lines: payload.lines
  });
  if (error) throw error;
  return data;
}
