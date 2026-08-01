import { icon } from "../components/icons.js";
import { listCustomers, loadCustomerProjects, loadCustomerStatement, saveCustomer } from "../services/customer-service.js";
import { normalizeCustomerForm, validateCustomer } from "../validation/customer-validation.js";

const money = (value, compact = false) => `PKR ${new Intl.NumberFormat("en-PK", compact ? { notation: "compact", maximumFractionDigits: 1 } : { maximumFractionDigits: 0 }).format(Number(value || 0))}`;
const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const countryName = (code) => ({ PK: "Pakistan", CN: "China", AE: "UAE", US: "United States", GB: "United Kingdom" }[code] || code || "Not specified");
const margin = (row) => Number(row.revenue_base) ? ((Number(row.revenue_base) - Number(row.direct_cost_base)) / Number(row.revenue_base)) * 100 : 0;

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function listMarkup(customers) {
  if (!customers.length) return `<div class="customer-empty"><span>${icon("customers")}</span><h3>No customers found</h3><p>Adjust the filters or add the first customer.</p></div>`;
  return `<div class="customer-table-scroll"><table class="customer-table"><thead><tr><th>Customer</th><th>Contact</th><th>Projects</th><th>Receivable</th><th>Revenue</th><th>Margin</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${customers.map((row) => `<tr data-customer-row="${escapeHtml(row.id)}"><td><button class="customer-identity" type="button" data-open-customer="${escapeHtml(row.id)}"><span class="customer-avatar">${escapeHtml(initials(row.company_name))}</span><span><strong>${escapeHtml(row.company_name)}</strong><small>${escapeHtml(row.customer_code)}</small></span></button></td><td><strong class="contact-name">${escapeHtml(row.contact_person || "—")}</strong><small>${escapeHtml(row.email || row.phone || "No contact details")}</small></td><td><strong>${Number(row.active_projects || 0)} active</strong><small>${Number(row.project_count || 0)} total</small></td><td class="numeric"><strong>${money(row.receivable_base, true)}</strong></td><td class="numeric">${money(row.revenue_base, true)}</td><td><span class="margin-value ${margin(row) >= 20 ? "healthy" : "watch"}">${margin(row).toFixed(1)}%</span></td><td><span class="status-badge ${row.is_active ? "active" : "inactive"}">${row.is_active ? "Active" : "Inactive"}</span></td><td><button class="row-action" type="button" data-edit-customer="${escapeHtml(row.id)}" aria-label="Edit ${escapeHtml(row.company_name)}">${icon("edit")}</button></td></tr>`).join("")}</tbody></table></div>`;
}

function summaryMarkup(customers) {
  const active = customers.filter((row) => row.is_active).length;
  const receivable = customers.reduce((sum, row) => sum + Number(row.receivable_base || 0), 0);
  const revenue = customers.reduce((sum, row) => sum + Number(row.revenue_base || 0), 0);
  const profit = customers.reduce((sum, row) => sum + Number(row.revenue_base || 0) - Number(row.direct_cost_base || 0), 0);
  return `<div class="customer-summary"><article><span>Total customers</span><strong>${customers.length}</strong><small>${active} active accounts</small></article><article><span>Total receivables</span><strong>${money(receivable, true)}</strong><small>Posted invoices less allocations</small></article><article><span>Customer revenue</span><strong>${money(revenue, true)}</strong><small>Company revenue only</small></article><article><span>Gross profit</span><strong>${money(profit, true)}</strong><small>${revenue ? (profit / revenue * 100).toFixed(1) : "0.0"}% blended margin</small></article></div>`;
}

function formMarkup(row = {}) {
  return `<dialog class="customer-dialog" data-customer-dialog><form method="dialog" data-customer-form novalidate><div class="dialog-heading"><div><h2>${row.id ? "Edit customer" : "Add customer"}</h2><p>Contact and credit-control information</p></div><button class="dialog-close" type="button" data-close-dialog aria-label="Close">${icon("close")}</button></div><input type="hidden" name="id" value="${escapeHtml(row.id || "")}"><div class="form-grid"><label><span>Customer code *</span><input name="customer_code" required maxlength="20" value="${escapeHtml(row.customer_code || "")}" placeholder="CUS-0006"><small data-error="customer_code"></small></label><label class="field-wide"><span>Company name *</span><input name="company_name" required maxlength="160" value="${escapeHtml(row.company_name || "")}" placeholder="Company legal or trading name"><small data-error="company_name"></small></label><label><span>Contact person</span><input name="contact_person" maxlength="120" value="${escapeHtml(row.contact_person || "")}"></label><label><span>Email</span><input name="email" type="email" value="${escapeHtml(row.email || "")}"><small data-error="email"></small></label><label><span>Phone</span><input name="phone" value="${escapeHtml(row.phone || "")}"></label><label><span>WhatsApp</span><input name="whatsapp" value="${escapeHtml(row.whatsapp || "")}"></label><label><span>Country code</span><input name="country_code" maxlength="2" value="${escapeHtml(row.country_code || "PK")}" placeholder="PK"><small data-error="country_code"></small></label><label><span>Payment terms</span><div class="input-suffix"><input name="payment_terms_days" type="number" min="0" max="365" value="${Number(row.payment_terms_days || 0)}"><span>days</span></div><small data-error="payment_terms_days"></small></label><label class="field-wide"><span>Credit limit (PKR)</span><input name="credit_limit_base" type="number" min="0" step="1" value="${Number(row.credit_limit_base || 0)}"><small data-error="credit_limit_base"></small></label><label class="field-full"><span>Billing address</span><textarea name="billing_address" rows="3">${escapeHtml(row.billing_address || "")}</textarea></label><label class="toggle-field field-full"><input name="is_active" type="checkbox" ${row.is_active !== false ? "checked" : ""}><span><strong>Active customer</strong><small>Inactive customers remain in reports but cannot be used for new projects.</small></span></label></div><div class="dialog-footer"><span class="form-status" data-form-status></span><button class="secondary-button" type="button" data-close-dialog>Cancel</button><button class="primary-button" type="submit">${row.id ? "Save changes" : "Add customer"}</button></div></form></dialog>`;
}

function overviewTab(row) {
  return `<div class="customer-overview-grid"><section class="customer-card"><h3>Contact information</h3><dl class="detail-list"><div><dt>${icon("customers")} Contact person</dt><dd>${escapeHtml(row.contact_person || "—")}</dd></div><div><dt>${icon("mail")} Email</dt><dd>${escapeHtml(row.email || "—")}</dd></div><div><dt>${icon("phone")} Phone</dt><dd>${escapeHtml(row.phone || "—")}</dd></div><div><dt>${icon("location")} Billing address</dt><dd>${escapeHtml(row.billing_address || countryName(row.country_code))}</dd></div></dl></section><section class="customer-card"><h3>Commercial terms</h3><dl class="commercial-list"><div><dt>Payment terms</dt><dd>${Number(row.payment_terms_days || 0)} days</dd></div><div><dt>Credit limit</dt><dd>${money(row.credit_limit_base)}</dd></div><div><dt>Credit used</dt><dd>${money(row.receivable_base)} <span>${row.credit_limit_base ? Math.min(100, row.receivable_base / row.credit_limit_base * 100).toFixed(0) : 0}%</span></dd></div></dl><div class="credit-meter"><span style="width:${row.credit_limit_base ? Math.min(100, row.receivable_base / row.credit_limit_base * 100) : 0}%"></span></div></section></div>`;
}

function projectsTab(projects) {
  if (!projects.length) return '<div class="tab-empty">No projects recorded for this customer.</div>';
  return `<div class="detail-table-scroll"><table><thead><tr><th>Project</th><th>Services</th><th>Status</th><th class="numeric">Revenue</th><th class="numeric">Gross profit</th></tr></thead><tbody>${projects.map((project) => `<tr><td><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.project_number)}</small></td><td>${(project.services || project.project_services?.map((item) => item.service_types?.name) || []).map((service) => `<span class="service-tag">${escapeHtml(service)}</span>`).join(" ")}</td><td><span class="status-badge ${project.status === "active" ? "active" : "inactive"}">${escapeHtml(project.status)}</span></td><td class="numeric">${project.revenue == null ? "—" : money(project.revenue)}</td><td class="numeric">${project.gross_profit == null ? "—" : money(project.gross_profit)}</td></tr>`).join("")}</tbody></table></div>`;
}

function statementTab(rows) {
  if (!rows.length) return '<div class="tab-empty">No posted invoices or receipts for this customer.</div>';
  let balance = 0;
  const ascending = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const withBalance = ascending.map((row) => ({ ...row, balance: balance += Number(row.debit) - Number(row.credit) })).reverse();
  return `<div class="statement-note">Balances are shown in PKR. Original transaction currency is preserved alongside each entry.</div><div class="detail-table-scroll"><table><thead><tr><th>Date</th><th>Type / reference</th><th>Project</th><th>Original</th><th class="numeric">Debit</th><th class="numeric">Credit</th><th class="numeric">Balance</th></tr></thead><tbody>${withBalance.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td><strong>${escapeHtml(row.type)}</strong><small>${escapeHtml(row.reference)}</small></td><td>${escapeHtml(row.project)}</td><td>${escapeHtml(row.currency)} ${new Intl.NumberFormat("en").format(row.original)}</td><td class="numeric">${row.debit ? money(row.debit) : "—"}</td><td class="numeric">${row.credit ? money(row.credit) : "—"}</td><td class="numeric"><strong>${money(row.balance)}</strong></td></tr>`).join("")}</tbody></table></div>`;
}

function profitabilityTab(row) {
  const profit = Number(row.revenue_base) - Number(row.direct_cost_base);
  return `<div class="profitability-grid"><article><span>Company revenue</span><strong>${money(row.revenue_base)}</strong><small>Excludes customer funds held for suppliers</small></article><article><span>Direct project costs</span><strong>${money(row.direct_cost_base)}</strong><small>Supplier bills and direct expenses</small></article><article class="profit-highlight"><span>Gross profit</span><strong>${money(profit)}</strong><small>${margin(row).toFixed(1)}% gross margin</small></article></div><div class="profit-rule"><strong>Accounting rule</strong><p>Customer profitability uses posted company revenue less direct project costs. Company overhead is excluded from gross profit and reported at company level.</p></div>`;
}

export function renderCustomers() {
  return `<section class="customers-module" aria-label="Customers"><div class="customer-toolbar"><div class="customer-search"><label class="sr-only" for="customer-search">Search customers</label>${icon("search")}<input id="customer-search" type="search" placeholder="Search company, contact or customer code…"></div><select data-customer-status aria-label="Filter by status"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select><select data-customer-country aria-label="Filter by country"><option value="all">All countries</option></select><button class="primary-button" type="button" data-add-customer>${icon("plus")} Add customer</button></div><div data-customer-summary class="loading-block">Loading customer summary…</div><section class="customer-list-panel"><div class="list-heading"><div><h2>Customer accounts</h2><p data-result-count>Loading records…</p></div><span class="accounting-hint">Figures in PKR</span></div><div data-customer-list class="loading-block">Loading customers…</div></section><div data-customer-detail></div><div data-customer-modal></div><div class="dashboard-toast" role="status" aria-live="polite" data-customer-toast hidden></div></section>`;
}

export function initializeCustomers(root, accessContext) {
  let customers = [];
  let selectedCustomer = null;
  let destroyed = false;
  const search = root.querySelector("#customer-search");
  const status = root.querySelector("[data-customer-status]");
  const country = root.querySelector("[data-customer-country]");
  const list = root.querySelector("[data-customer-list]");
  const summary = root.querySelector("[data-customer-summary]");
  const detail = root.querySelector("[data-customer-detail]");
  const modalHost = root.querySelector("[data-customer-modal]");
  const toast = root.querySelector("[data-customer-toast]");
  let toastTimer;

  const notify = (message) => { toast.textContent = message; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 3200); };
  const renderList = () => {
    const term = search.value.trim().toLowerCase();
    const filtered = customers.filter((row) => (!term || [row.company_name, row.contact_person, row.customer_code, row.email].some((value) => String(value || "").toLowerCase().includes(term))) && (status.value === "all" || (status.value === "active") === row.is_active) && (country.value === "all" || country.value === row.country_code));
    list.innerHTML = listMarkup(filtered);
    root.querySelector("[data-result-count]").textContent = `${filtered.length} of ${customers.length} customers`;
  };

  const openForm = (row = {}) => {
    modalHost.innerHTML = formMarkup(row);
    const dialog = modalHost.querySelector("dialog");
    const form = dialog.querySelector("form");
    dialog.showModal();
    dialog.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("close", () => { modalHost.innerHTML = ""; });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = normalizeCustomerForm(new FormData(form));
      const errors = validateCustomer(payload);
      form.querySelectorAll("[data-error]").forEach((element) => { element.textContent = errors[element.dataset.error] || ""; });
      if (Object.keys(errors).length) return;
      if (accessContext.isPrototype) { form.querySelector("[data-form-status]").textContent = "Read-only prototype — connect Supabase to save."; return; }
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        await saveCustomer(accessContext, payload, form.elements.id.value || null);
        customers = await listCustomers(accessContext);
        summary.innerHTML = summaryMarkup(customers);
        renderList();
        dialog.close();
        notify(row.id ? "Customer updated." : "Customer added.");
      } catch (error) {
        form.querySelector("[data-form-status]").textContent = error.code === "23505" ? "That customer code is already in use." : "Could not save the customer. Please try again.";
        submit.disabled = false;
      }
    });
  };

  const openDetail = async (row) => {
    selectedCustomer = row;
    detail.innerHTML = `<section class="customer-detail-view"><button class="back-button" type="button" data-back-customers>${icon("back")} All customers</button><div class="customer-detail-head"><span class="customer-avatar large">${escapeHtml(initials(row.company_name))}</span><div><div class="detail-title-line"><h2>${escapeHtml(row.company_name)}</h2><span class="status-badge ${row.is_active ? "active" : "inactive"}">${row.is_active ? "Active" : "Inactive"}</span></div><p>${escapeHtml(row.customer_code)} · ${escapeHtml(countryName(row.country_code))}</p></div><button class="secondary-button" type="button" data-detail-edit>${icon("edit")} Edit customer</button></div><div class="detail-kpis"><article><span>Receivable</span><strong>${money(row.receivable_base)}</strong></article><article><span>Total revenue</span><strong>${money(row.revenue_base)}</strong></article><article><span>Gross profit</span><strong>${money(Number(row.revenue_base) - Number(row.direct_cost_base))}</strong></article><article><span>Gross margin</span><strong>${margin(row).toFixed(1)}%</strong></article></div><div class="detail-tabs" role="tablist"><button class="active" type="button" data-tab="overview">Overview</button><button type="button" data-tab="projects">Project history</button><button type="button" data-tab="statement">Statement</button><button type="button" data-tab="profitability">Profitability</button></div><div class="detail-tab-panel" data-tab-panel>${overviewTab(row)}</div></section>`;
    root.querySelector(".customer-list-panel").hidden = true;
    summary.hidden = true;
    root.querySelector(".customer-toolbar").hidden = true;
    detail.scrollIntoView({ block: "start" });
  };

  const handleClick = async (event) => {
    const openButton = event.target.closest("[data-open-customer]");
    const editButton = event.target.closest("[data-edit-customer]");
    if (event.target.closest("[data-add-customer]")) openForm();
    if (editButton) openForm(customers.find((row) => row.id === editButton.dataset.editCustomer));
    if (openButton) await openDetail(customers.find((row) => row.id === openButton.dataset.openCustomer));
    if (event.target.closest("[data-back-customers]")) { selectedCustomer = null; detail.innerHTML = ""; root.querySelector(".customer-list-panel").hidden = false; summary.hidden = false; root.querySelector(".customer-toolbar").hidden = false; }
    if (event.target.closest("[data-detail-edit]")) openForm(selectedCustomer);
    const tab = event.target.closest("[data-tab]");
    if (tab && selectedCustomer) {
      detail.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("active", button === tab));
      const panel = detail.querySelector("[data-tab-panel]");
      panel.innerHTML = '<div class="loading-block">Loading…</div>';
      try {
        if (tab.dataset.tab === "overview") panel.innerHTML = overviewTab(selectedCustomer);
        if (tab.dataset.tab === "profitability") panel.innerHTML = profitabilityTab(selectedCustomer);
        if (tab.dataset.tab === "projects") panel.innerHTML = projectsTab(await loadCustomerProjects(accessContext, selectedCustomer.id));
        if (tab.dataset.tab === "statement") panel.innerHTML = statementTab(await loadCustomerStatement(accessContext, selectedCustomer.id));
      } catch { panel.innerHTML = '<div class="tab-empty error">Could not load this customer view.</div>'; }
    }
  };

  const load = async () => {
    try {
      customers = await listCustomers(accessContext);
      if (destroyed) return;
      summary.innerHTML = summaryMarkup(customers);
      [...new Set(customers.map((row) => row.country_code).filter(Boolean))].sort().forEach((code) => country.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(code)}">${escapeHtml(countryName(code))}</option>`));
      renderList();
    } catch {
      summary.innerHTML = "";
      list.innerHTML = '<div class="customer-empty error"><h3>Customers could not be loaded</h3><p>Check the Supabase connection and database migrations, then refresh.</p></div>';
    }
  };

  root.addEventListener("click", handleClick);
  [search, status, country].forEach((control) => control.addEventListener(control === search ? "input" : "change", renderList));
  load();
  return () => { destroyed = true; clearTimeout(toastTimer); root.removeEventListener("click", handleClick); };
}
