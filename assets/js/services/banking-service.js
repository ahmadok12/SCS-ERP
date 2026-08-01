import { getSupabaseClient } from "../data/supabase-client.js";
import { BANKING_PROTOTYPE_DATA } from "../data/banking-data.js";

const clone = (value) => structuredClone(value);

async function query(client, table, organizationId, order) {
  let request = client.from(table).select("*").eq("organization_id", organizationId);
  if (order) request = request.order(order.column, { ascending: order.ascending ?? true });
  const { data, error } = await request;
  if (error) throw error;
  return data || [];
}

export async function loadBankingWorkspace(accessContext) {
  if (accessContext.isPrototype) return clone(BANKING_PROTOTYPE_DATA);
  const client = getSupabaseClient();
  const organizationId = accessContext.membership.organization_id;
  const [accounts, transactions, statements, branches, ledgerAccounts] = await Promise.all([
    query(client, "banking_account_balances", organizationId, { column: "code" }),
    query(client, "banking_transaction_register", organizationId, { column: "transaction_date", ascending: false }),
    query(client, "banking_reconciliation_overview", organizationId, { column: "statement_to", ascending: false }),
    query(client, "branches", organizationId, { column: "name" }),
    query(client, "accounts", organizationId, { column: "code" })
  ]);
  return {
    asOf: new Date().toISOString().slice(0, 10),
    branches,
    ledgerAccounts: ledgerAccounts.filter((row) => ["bank", "cash"].includes(row.control_type)),
    accounts: accounts.map((row) => ({ id: row.id, branchId: row.branch_id, ledgerAccountId: row.ledger_account_id, code: row.code, name: row.name, kind: row.account_kind, currency: row.currency_code, branch: row.branch_name, institution: row.institution_name, maskedNumber: row.masked_account_number, originalBalance: row.original_balance, baseBalance: row.base_balance, reconciledThrough: row.reconciled_through, unreconciled: row.unreconciled_count, active: row.is_active })),
    transactions: transactions.map((row) => ({ id: row.id, date: row.transaction_date, accountId: row.bank_account_id, account: row.bank_account_name, direction: row.direction, type: row.entry_type, reference: row.reference, party: row.counterparty, currency: row.original_currency_code, originalAmount: row.original_amount, rate: row.exchange_rate, baseAmount: row.base_amount, reconciled: row.is_reconciled })),
    statements: statements.map((row) => ({ id: row.id, accountId: row.bank_account_id, account: row.bank_account_name, number: row.statement_number, from: row.statement_from, to: row.statement_to, opening: row.opening_balance, closing: row.closing_balance, currency: row.currency_code, status: row.status, matched: row.matched_lines, total: row.total_lines, difference: row.unmatched_amount }))
  };
}

export async function saveBankAccount(accessContext, values) {
  if (accessContext.isPrototype) throw new Error("PROTOTYPE_READ_ONLY");
  const client = getSupabaseClient();
  const row = { organization_id: accessContext.membership.organization_id, branch_id: values.branchId, ledger_account_id: values.ledgerAccountId, code: values.code.trim().toUpperCase(), name: values.name.trim(), account_kind: values.kind, currency_code: values.currency, institution_name: values.institution?.trim() || null, masked_account_number: values.maskedNumber?.trim() || null, is_active: true };
  if (values.id) row.id = values.id;
  const { data, error } = await client.from("bank_accounts").upsert(row).select().single();
  if (error) throw error;
  return data;
}

export async function postBankTransfer(accessContext, values) {
  if (accessContext.isPrototype) throw new Error("PROTOTYPE_READ_ONLY");
  const { data, error } = await getSupabaseClient().rpc("create_and_post_bank_transfer", {
    p_organization_id: accessContext.membership.organization_id,
    p_source_bank_account_id: values.sourceAccountId,
    p_destination_bank_account_id: values.destinationAccountId,
    p_transfer_date: values.date,
    p_source_amount: values.sourceAmount,
    p_source_exchange_rate: values.sourceRate,
    p_destination_amount: values.destinationAmount,
    p_destination_exchange_rate: values.destinationRate,
    p_reference: values.reference || null,
    p_description: values.description || null
  });
  if (error) throw error;
  return data;
}
