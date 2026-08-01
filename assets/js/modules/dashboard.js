import { icon } from "../components/icons.js";
import { DASHBOARD_DATA } from "../data/dashboard-data.js";

const formatter = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

function money(value, compact = false) {
  if (compact) {
    return `PKR ${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;
  }
  return `PKR ${formatter.format(value)}`;
}

function metricCard(id, label, iconName, emphasis = "") {
  const metric = DASHBOARD_DATA.month.metrics[id];
  const positive = metric.change >= 0;
  const changeClass = id === "receivables" || id === "payables" ? "neutral" : positive ? "positive" : "negative";
  return `
    <article class="metric-card ${emphasis}" data-metric-card="${id}">
      <div class="metric-card-top">
        <span class="metric-label">${label}</span>
        <span class="metric-icon">${icon(iconName)}</span>
      </div>
      <strong class="metric-value" data-metric-value>${money(metric.value, true)}</strong>
      <div class="metric-foot">
        <span class="metric-change ${changeClass}" data-metric-change>
          ${icon(positive ? "arrowUp" : "arrowDown")} <span>${Math.abs(metric.change)}%</span>
        </span>
        <span data-metric-caption>${metric.caption}</span>
      </div>
    </article>`;
}

function trendChart() {
  const values = DASHBOARD_DATA.trend;
  const width = 680;
  const height = 220;
  const pad = { x: 42, y: 22, bottom: 34 };
  const max = 10;
  const x = (index) => pad.x + index * ((width - pad.x * 2) / (values.length - 1));
  const y = (value) => height - pad.bottom - (value / max) * (height - pad.y - pad.bottom);
  const line = (key) => values.map((item, index) => `${index ? "L" : "M"}${x(index)},${y(item[key])}`).join(" ");
  const area = `${line("revenue")} L${x(values.length - 1)},${height - pad.bottom} L${x(0)},${height - pad.bottom} Z`;
  const grid = [0, 2.5, 5, 7.5, 10].map((value) => `<g><line x1="${pad.x}" y1="${y(value)}" x2="${width - pad.x}" y2="${y(value)}"/><text x="4" y="${y(value) + 4}">${value}m</text></g>`).join("");
  const labels = values.map((item, index) => `<text x="${x(index)}" y="${height - 7}" text-anchor="middle">${item.month}</text>`).join("");
  return `<svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Revenue and gross profit trend from March to August 2026 in millions of Pakistani rupees">
    <g class="chart-grid">${grid}${labels}</g>
    <path class="chart-area" d="${area}"/>
    <path class="chart-line revenue-line" d="${line("revenue")}"/>
    <path class="chart-line profit-line" d="${line("profit")}"/>
    ${values.map((item, index) => `<circle class="revenue-point" cx="${x(index)}" cy="${y(item.revenue)}" r="3.5"><title>${item.month}: PKR ${item.revenue}m revenue</title></circle>`).join("")}
  </svg>`;
}

function statusChart() {
  const total = DASHBOARD_DATA.projectStatus.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const stops = DASHBOARD_DATA.projectStatus.map((item) => {
    const start = cursor;
    cursor += (item.value / total) * 100;
    return `${item.color} ${start}% ${cursor}%`;
  }).join(", ");
  return `
    <div class="status-chart" style="--status-gradient: conic-gradient(${stops})" role="img" aria-label="17 projects in progress: 12 on track, 3 at risk, and 2 delayed">
      <div><strong>${total}</strong><span>in progress</span></div>
    </div>
    <ul class="status-legend">
      ${DASHBOARD_DATA.projectStatus.map((item) => `<li><span class="legend-key" style="--legend-color:${item.color}"></span><span>${item.label}</span><strong>${item.value}</strong></li>`).join("")}
    </ul>`;
}

function leaderCard(kind, label) {
  const item = DASHBOARD_DATA.leaders[kind];
  return `<article class="leader-card">
    <div class="leader-eyebrow"><span>${label}</span><span class="leader-rank">#1</span></div>
    <h3>${item.name}</h3>
    <p>${item.detail}</p>
    <div class="leader-result"><strong>${money(item.value)}</strong><span>${item.margin}</span></div>
  </article>`;
}

export function renderDashboard() {
  return `
    <section class="dashboard" aria-label="Dashboard overview">
      <div class="dashboard-toolbar">
        <p><span class="data-status-dot"></span> Representative figures for layout review</p>
        <label>Reporting period
          <select data-period-select aria-label="Dashboard reporting period">
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
            <option value="year">Year to date</option>
          </select>
        </label>
      </div>

      <section class="metric-grid" aria-label="Financial summary">
        ${metricCard("revenue", "Revenue", "reports", "metric-primary")}
        ${metricCard("grossProfit", "Gross profit", "arrowUp")}
        ${metricCard("netProfit", "Net profit", "wallet")}
        ${metricCard("receivables", "Customer receivables", "invoice")}
        ${metricCard("payables", "Supplier payables", "receipt")}
        ${metricCard("cash", "Cash balance", "banking")}
      </section>

      <div class="dashboard-main-grid">
        <section class="dashboard-panel trend-panel" aria-labelledby="trend-title">
          <div class="panel-heading">
            <div><h2 id="trend-title">Revenue & gross profit</h2><p>Six-month performance in PKR</p></div>
            <div class="chart-legend"><span class="revenue-key">Revenue</span><span class="profit-key">Gross profit</span></div>
          </div>
          ${trendChart()}
        </section>

        <section class="dashboard-panel projects-panel" aria-labelledby="projects-title">
          <div class="panel-heading"><div><h2 id="projects-title">Active projects</h2><p>Status across all services</p></div><button class="text-button" type="button" data-demo-action="projects">View projects ${icon("external")}</button></div>
          <div class="status-chart-wrap">${statusChart()}</div>
        </section>
      </div>

      <section class="dashboard-panel leaders-panel" aria-labelledby="leaders-title">
        <div class="panel-heading"><div><h2 id="leaders-title">Profitability leaders</h2><p>Gross profit contribution this month</p></div></div>
        <div class="leader-grid">${leaderCard("customer", "Most profitable customer")}${leaderCard("project", "Most profitable project")}</div>
      </section>

      <div class="dashboard-bottom-grid">
        <section class="dashboard-panel transactions-panel" aria-labelledby="transactions-title">
          <div class="panel-heading"><div><h2 id="transactions-title">Recent transactions</h2><p>Latest operational activity</p></div><button class="text-button" type="button" data-demo-action="transactions">View all ${icon("external")}</button></div>
          <div class="table-scroll">
            <table>
              <thead><tr><th>Date</th><th>Transaction</th><th>Party / detail</th><th>Account</th><th class="amount-cell">Amount</th></tr></thead>
              <tbody>${DASHBOARD_DATA.transactions.map((row) => `<tr><td class="date-cell">${row.date}</td><td><strong>${row.type}</strong><span class="table-reference">${row.reference}</span></td><td>${row.party}</td><td><span class="account-badge">${row.account}</span></td><td class="amount-cell ${row.direction}">${row.direction === "out" ? "−" : "+"}${money(row.amount)}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </section>

        <aside class="dashboard-panel quick-panel" aria-labelledby="quick-title">
          <div class="panel-heading"><div><h2 id="quick-title">Quick actions</h2><p>Start a common workflow</p></div></div>
          <div class="quick-actions">
            <button type="button" data-demo-action="invoice"><span>${icon("invoice")}</span><span><strong>New invoice</strong><small>Bill a customer</small></span>${icon("chevronDown")}</button>
            <button type="button" data-demo-action="receipt"><span>${icon("receipt")}</span><span><strong>Record receipt</strong><small>Apply customer payment</small></span>${icon("chevronDown")}</button>
            <button type="button" data-demo-action="expense"><span>${icon("expense")}</span><span><strong>Add expense</strong><small>Project or overhead</small></span>${icon("chevronDown")}</button>
            <button type="button" data-demo-action="project"><span>${icon("projects")}</span><span><strong>New project</strong><small>Sourcing, trading or shipping</small></span>${icon("plus")}</button>
          </div>
        </aside>
      </div>
      <div class="dashboard-toast" role="status" aria-live="polite" data-dashboard-toast hidden></div>
    </section>`;
}

export function initializeDashboard(root) {
  const select = root.querySelector("[data-period-select]");
  const toast = root.querySelector("[data-dashboard-toast]");
  let toastTimer;

  const onPeriodChange = () => {
    const period = DASHBOARD_DATA[select.value];
    Object.entries(period.metrics).forEach(([id, metric]) => {
      const card = root.querySelector(`[data-metric-card="${id}"]`);
      card.querySelector("[data-metric-value]").textContent = money(metric.value, true);
      card.querySelector("[data-metric-change] span").textContent = `${Math.abs(metric.change)}%`;
      card.querySelector("[data-metric-caption]").textContent = metric.caption;
    });
  };

  const onAction = (event) => {
    const action = event.target.closest("[data-demo-action]");
    if (!action) return;
    toast.textContent = "This action will be connected in its approved module.";
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
  };

  select.addEventListener("change", onPeriodChange);
  root.addEventListener("click", onAction);
  return () => {
    clearTimeout(toastTimer);
    select.removeEventListener("change", onPeriodChange);
    root.removeEventListener("click", onAction);
  };
}
