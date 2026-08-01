import { renderAppShell } from "../components/app-shell.js";
import { initializeDashboard, renderDashboard } from "../modules/dashboard.js";
import { initializeCustomers, renderCustomers } from "../modules/customers.js";
import { initializeProjects, renderProjects } from "../modules/projects.js";
import { initializeAccounting, renderAccounting } from "../modules/accounting.js";
import { initializeBanking, renderBanking } from "../modules/banking.js";
import { performSignOut, requireAuthorizedUser } from "./auth-guard.js";
import { getDisplayIdentity } from "../services/auth-service.js";

const PAGE_DESCRIPTIONS = {
  dashboard: "Your financial and operational overview.",
  customers: "Manage customer accounts, statements, projects, and profitability.",
  projects: "Track sourcing, trading, and shipping work from start to completion.",
  suppliers: "Manage supplier bills, payments, purchase history, and documents.",
  accounting: "Review the chart of accounts, journals, ledgers, and financial statements.",
  banking: "Track PKR and CNY bank, cash, WeChat, and Alipay accounts.",
  reports: "Analyze financial performance, profitability, exposure, and cash position.",
  settings: "Configure the organization, branches, users, roles, and accounting options."
};

const root = document.querySelector("#app-shell");
const initialPage = root?.dataset.activePage || "dashboard";

if (!root) {
  throw new Error("Application shell root was not found.");
}

root.innerHTML = `
  <main class="session-loading" aria-live="polite">
    <span class="session-loading-mark" aria-hidden="true">SCS</span>
    <p>Securing your workspace…</p>
  </main>
`;

const accessContext = await requireAuthorizedUser();
if (accessContext) {
  renderAppShell(root, initialPage, getDisplayIdentity(accessContext));

const pageContent = document.querySelector("[data-page-content]");
const pageActions = document.querySelector("[data-page-actions]");
const modulePlaceholder = document.querySelector("[data-module-placeholder]");
let dashboardCleanup = null;

const layout = document.querySelector("[data-app-layout]");
const mobileMenuButton = document.querySelector("[data-mobile-menu]");
const mobileBackdrop = document.querySelector("[data-mobile-backdrop]");
const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
const profileToggle = document.querySelector("[data-profile-toggle]");
const profileMenu = document.querySelector("[data-profile-menu]");
const searchInput = document.querySelector("#global-search");
const signOutButton = document.querySelector("[data-sign-out]");

function closeMobileNavigation() {
  layout.classList.remove("mobile-nav-open");
  mobileMenuButton.setAttribute("aria-expanded", "false");
}

function closeProfileMenu() {
  profileMenu.hidden = true;
  profileToggle.setAttribute("aria-expanded", "false");
}

function selectPage(pageId) {
  const label = pageId.charAt(0).toUpperCase() + pageId.slice(1);
  document.querySelectorAll("[data-page]").forEach((link) => {
    if (link.dataset.page === pageId) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector("[data-page-title]").textContent = label;
  document.querySelector("[data-breadcrumb-current]").textContent = label;
  document.querySelector("[data-page-description]").textContent = PAGE_DESCRIPTIONS[pageId];
  dashboardCleanup?.();
  dashboardCleanup = null;

  if (pageId === "dashboard") {
    modulePlaceholder.hidden = true;
    pageContent.hidden = false;
    pageContent.innerHTML = renderDashboard();
    pageActions.innerHTML = '<span class="prototype-badge">Prototype data</span>';
    dashboardCleanup = initializeDashboard(pageContent);
  } else if (pageId === "customers") {
    modulePlaceholder.hidden = true;
    pageContent.hidden = false;
    pageContent.innerHTML = renderCustomers(accessContext);
    pageActions.innerHTML = accessContext.isPrototype
      ? '<span class="prototype-badge">Read-only prototype</span>'
      : "";
    dashboardCleanup = initializeCustomers(pageContent, accessContext);
  } else if (pageId === "projects") {
    modulePlaceholder.hidden = true;
    pageContent.hidden = false;
    pageContent.innerHTML = renderProjects(accessContext);
    pageActions.innerHTML = accessContext.isPrototype
      ? '<span class="prototype-badge">Read-only prototype</span>'
      : "";
    dashboardCleanup = initializeProjects(pageContent, accessContext);
  } else if (pageId === "accounting") {
    modulePlaceholder.hidden = true;
    pageContent.hidden = false;
    pageContent.innerHTML = renderAccounting();
    pageActions.innerHTML = accessContext.isPrototype
      ? '<span class="prototype-badge">Read-only prototype</span>'
      : "";
    dashboardCleanup = initializeAccounting(pageContent, accessContext);
  } else if (pageId === "banking") {
    modulePlaceholder.hidden = true;
    pageContent.hidden = false;
    pageContent.innerHTML = renderBanking();
    pageActions.innerHTML = accessContext.isPrototype
      ? '<span class="prototype-badge">Read-only prototype</span>'
      : "";
    dashboardCleanup = initializeBanking(pageContent, accessContext);
  } else {
    pageContent.hidden = true;
    pageContent.innerHTML = "";
    pageActions.innerHTML = "";
    modulePlaceholder.hidden = false;
    document.querySelector("[data-placeholder-title]").textContent = `${label} shell ready`;
    document.querySelector("[data-placeholder-copy]").textContent = `${label} content and database actions will be implemented in its approved module.`;
  }
  document.title = `${label} | Shaikh China Sourcing ERP`;
  closeMobileNavigation();
}

mobileMenuButton.addEventListener("click", () => {
  const isOpen = layout.classList.toggle("mobile-nav-open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
});

selectPage(initialPage);

const initialHash = (window.top === window ? window.location.hash : window.top.location.hash).slice(1);
if (initialHash in PAGE_DESCRIPTIONS) {
  selectPage(initialHash);
}

mobileBackdrop.addEventListener("click", closeMobileNavigation);

sidebarToggle.addEventListener("click", () => {
  const isCollapsed = layout.classList.toggle("sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
});

profileToggle.addEventListener("click", () => {
  const willOpen = profileMenu.hidden;
  profileMenu.hidden = !willOpen;
  profileToggle.setAttribute("aria-expanded", String(willOpen));
});

signOutButton.addEventListener("click", async () => {
  signOutButton.disabled = true;
  signOutButton.textContent = "Signing out…";
  try {
    await performSignOut();
  } catch {
    signOutButton.disabled = false;
    signOutButton.textContent = "Sign out";
  }
});

document.querySelectorAll("[data-page]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectPage(link.dataset.page);
  });
});

document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
  event.preventDefault();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".profile")) closeProfileMenu();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") {
    closeMobileNavigation();
    closeProfileMenu();
  }
});
}
