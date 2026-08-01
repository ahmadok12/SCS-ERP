import { icon } from "./icons.js";

const NAVIGATION = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "customers", label: "Customers", icon: "customers" },
      { id: "projects", label: "Projects", icon: "projects" },
      { id: "suppliers", label: "Suppliers", icon: "suppliers" }
    ]
  },
  {
    label: "Finance",
    items: [
      { id: "accounting", label: "Accounting", icon: "accounting" },
      { id: "banking", label: "Banking", icon: "banking" },
      { id: "reports", label: "Reports", icon: "reports" }
    ]
  },
  {
    label: "Administration",
    items: [{ id: "settings", label: "Settings", icon: "settings" }]
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function navigationMarkup(activePage) {
  return NAVIGATION.map((group) => `
    <p class="nav-label">${group.label}</p>
    <ul class="nav-list">
      ${group.items.map((item) => `
        <li>
          <a class="nav-link" href="#${item.id}" data-page="${item.id}"
             ${item.id === activePage ? 'aria-current="page"' : ""}
             title="${item.label}">
            ${icon(item.icon, "nav-icon")}
            <span class="nav-text">${item.label}</span>
          </a>
        </li>
      `).join("")}
    </ul>
  `).join("");
}

export function renderAppShell(root, activePage = "dashboard", identity = {}) {
  const displayName = escapeHtml(identity.name || "ERP user");
  const displayRole = escapeHtml(identity.role || "Team member");
  const initials = escapeHtml(identity.initials || "SC");

  root.innerHTML = `
    <div class="app-layout" data-app-layout>
      <aside class="sidebar" id="primary-navigation" aria-label="Primary navigation">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">SCS</span>
          <span class="brand-copy">
            <span class="brand-name">Shaikh China Sourcing</span>
            <span class="brand-product">Business ERP</span>
          </span>
        </div>
        <nav class="nav-scroll">${navigationMarkup(activePage)}</nav>
        <div class="sidebar-footer">
          <button class="sidebar-toggle" type="button" data-sidebar-toggle aria-label="Collapse sidebar" aria-expanded="true">
            ${icon("collapse", "button-icon")}
            <span>Collapse sidebar</span>
          </button>
        </div>
      </aside>

      <button class="mobile-backdrop" type="button" data-mobile-backdrop aria-label="Close navigation"></button>

      <div class="main-column">
        <header class="topbar">
          <button class="mobile-menu-button" type="button" data-mobile-menu aria-controls="primary-navigation" aria-expanded="false" aria-label="Open navigation">
            ${icon("menu")}
          </button>
          <form class="search-form" role="search" data-search-form>
            <label class="sr-only" for="global-search">Search the ERP</label>
            ${icon("search")}
            <input class="search-input" id="global-search" name="q" type="search" placeholder="Search customers, projects, invoices…" autocomplete="off">
            <span class="search-shortcut" aria-hidden="true">Ctrl K</span>
          </form>
          <div class="topbar-actions">
            <button class="icon-button notification-button" type="button" aria-label="Notifications">
              ${icon("bell")}
              <span class="notification-dot" aria-hidden="true"></span>
            </button>
            <div class="profile">
              <button class="profile-button" type="button" data-profile-toggle aria-haspopup="menu" aria-expanded="false">
                <span class="avatar" aria-hidden="true">${initials}</span>
                <span class="profile-copy">
                  <span class="profile-name">${displayName}</span>
                  <span class="profile-role">${displayRole}</span>
                </span>
                ${icon("chevronDown")}
              </button>
              <div class="profile-menu" data-profile-menu role="menu" hidden>
                <a href="#profile" role="menuitem">My profile</a>
                <a href="#settings" role="menuitem">Account settings</a>
                <button type="button" role="menuitem" data-sign-out>Sign out</button>
              </div>
            </div>
          </div>
        </header>

        <main class="main-content" id="main-content" tabindex="-1">
          <div class="content-container">
            <nav aria-label="Breadcrumb">
              <ol class="breadcrumb">
                <li><a href="#dashboard">Home</a></li>
                <li aria-hidden="true">/</li>
                <li data-breadcrumb-current aria-current="page">Dashboard</li>
              </ol>
            </nav>
            <div class="page-heading">
              <div>
                <h1 data-page-title>Dashboard</h1>
                <p data-page-description>Your financial and operational overview.</p>
              </div>
              <div class="page-heading-actions" data-page-actions></div>
            </div>
            <div data-page-content></div>
            <section class="module-placeholder" data-module-placeholder aria-labelledby="placeholder-title" hidden>
              <div class="placeholder-content">
                <div class="placeholder-icon">${icon("placeholder")}</div>
                <h2 id="placeholder-title" data-placeholder-title>Navigation layout ready</h2>
                <p data-placeholder-copy>Dashboard cards and live financial data will be added in Module 5 after this application shell is approved.</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  `;
}
