export const PROJECT_PROTOTYPE_DATA = Object.freeze([
  {
    id: "p1", project_number: "SCS-26031", name: "Kitchen Storage Range", customer_id: "c1", customer_name: "Pak Home Stores",
    branch_id: "b1", branch_name: "Lahore Office", status: "active", start_date: "2026-06-12", expected_completion_date: "2026-09-20",
    completed_date: null, default_currency_code: "CNY", project_manager_id: "u1", project_manager_name: "Ahmad Iqbal",
    description: "Source, inspect and ship a coordinated range of airtight kitchen-storage products.", services: ["Sourcing", "Shipping"], primary_service: "Sourcing",
    revenue_base: 3420000, direct_cost_base: 2634000, receivable_base: 1840000,
    transactions: {
      invoices: [{ date: "2026-08-01", reference: "INV-26081", party: "Pak Home Stores", currency: "PKR", original: 1240000, base: 1240000, status: "posted" }],
      receipts: [{ date: "2026-07-24", reference: "RCP-26046", party: "Pak Home Stores", currency: "PKR", original: 800000, base: 800000, status: "posted" }],
      bills: [{ date: "2026-07-29", reference: "BILL-26054", party: "Yiwu Homeware Co.", currency: "CNY", original: 34200, base: 1325000, status: "posted" }],
      payments: [{ date: "2026-07-31", reference: "PAY-26039", party: "Yiwu Homeware Co.", currency: "CNY", original: 20500, base: 794000, status: "posted" }],
      expenses: [{ date: "2026-07-18", reference: "EXP-26072", party: "Dragon Inspection", currency: "CNY", original: 2200, base: 85200, status: "posted" }]
    },
    service_profitability: [
      { service: "Sourcing", revenue: 2280000, cost: 1756000 },
      { service: "Shipping", revenue: 1140000, cost: 878000 }
    ],
    documents: [{ id: "d1", name: "Supplier quotation - revised.pdf", type: "Supplier quotation", size: "1.8 MB", uploaded: "2026-07-28" }, { id: "d2", name: "Inspection report.pdf", type: "Inspection report", size: "3.4 MB", uploaded: "2026-07-19" }],
    notes: [{ id: "n1", text: "Final packaging artwork approved by customer on WhatsApp.", pinned: true, author: "Ahmad Iqbal", created_at: "2026-07-30T09:40:00Z" }]
  },
  { id: "p2", project_number: "SCS-26028", name: "Retail Display Units", customer_id: "c2", customer_name: "Karachi Retail Group", branch_id: "b1", branch_name: "Lahore Office", status: "active", start_date: "2026-06-04", expected_completion_date: "2026-08-28", default_currency_code: "CNY", project_manager_id: "u2", project_manager_name: "Fatima Noor", description: "Trading and delivery of modular retail display units.", services: ["Trading", "Shipping"], primary_service: "Trading", revenue_base: 2800000, direct_cost_base: 2128000, receivable_base: 920000, transactions: {}, service_profitability: [{ service: "Trading", revenue: 2240000, cost: 1736000 }, { service: "Shipping", revenue: 560000, cost: 392000 }], documents: [], notes: [] },
  { id: "p3", project_number: "SCS-26025", name: "Hotel Amenities", customer_id: "c3", customer_name: "Gulf Trade Partners", branch_id: "b2", branch_name: "China Office", status: "on_hold", start_date: "2026-05-20", expected_completion_date: "2026-09-05", default_currency_code: "CNY", project_manager_id: "u1", project_manager_name: "Ahmad Iqbal", description: "Supplier sourcing and consolidation for a hotel amenity programme.", services: ["Sourcing", "Shipping"], primary_service: "Sourcing", revenue_base: 1900000, direct_cost_base: 1472500, receivable_base: 1380000, transactions: {}, service_profitability: [{ service: "Sourcing", revenue: 1330000, cost: 1015000 }, { service: "Shipping", revenue: 570000, cost: 457500 }], documents: [], notes: [] },
  { id: "p4", project_number: "SCS-26033", name: "Lighting Collection", customer_id: "c4", customer_name: "Nova Living", branch_id: "b1", branch_name: "Lahore Office", status: "draft", start_date: "2026-07-22", expected_completion_date: "2026-10-10", default_currency_code: "CNY", project_manager_id: "u2", project_manager_name: "Fatima Noor", description: "Factory shortlisting and sample approval for decorative lighting.", services: ["Sourcing"], primary_service: "Sourcing", revenue_base: 0, direct_cost_base: 0, receivable_base: 0, transactions: {}, service_profitability: [{ service: "Sourcing", revenue: 0, cost: 0 }], documents: [], notes: [] },
  { id: "p5", project_number: "SCS-25142", name: "Home Textile Shipment", customer_id: "c1", customer_name: "Pak Home Stores", branch_id: "b2", branch_name: "China Office", status: "completed", start_date: "2025-10-05", expected_completion_date: "2025-12-12", completed_date: "2025-12-10", default_currency_code: "PKR", project_manager_id: "u1", project_manager_name: "Ahmad Iqbal", description: "Standalone freight coordination and documentation.", services: ["Shipping"], primary_service: "Shipping", revenue_base: 1250000, direct_cost_base: 937500, receivable_base: 0, transactions: {}, service_profitability: [{ service: "Shipping", revenue: 1250000, cost: 937500 }], documents: [], notes: [] },
  { id: "p6", project_number: "SCS-26036", name: "Fitness Accessories", customer_id: "c2", customer_name: "Karachi Retail Group", branch_id: "b1", branch_name: "Lahore Office", status: "active", start_date: "2026-07-29", expected_completion_date: "2026-11-15", default_currency_code: "CNY", project_manager_id: "u2", project_manager_name: "Fatima Noor", description: "Purchase and ship private-label fitness accessories.", services: ["Trading", "Shipping"], primary_service: "Trading", revenue_base: 980000, direct_cost_base: 704000, receivable_base: 490000, transactions: {}, service_profitability: [{ service: "Trading", revenue: 735000, cost: 528000 }, { service: "Shipping", revenue: 245000, cost: 176000 }], documents: [], notes: [] }
]);

export const PROJECT_PROTOTYPE_SETUP = Object.freeze({
  customers: [{ id: "c1", company_name: "Pak Home Stores" }, { id: "c2", company_name: "Karachi Retail Group" }, { id: "c3", company_name: "Gulf Trade Partners" }, { id: "c4", company_name: "Nova Living" }],
  branches: [{ id: "b1", name: "Lahore Office" }, { id: "b2", name: "China Office" }],
  managers: [{ id: "u1", full_name: "Ahmad Iqbal" }, { id: "u2", full_name: "Fatima Noor" }],
  serviceTypes: [{ id: "s1", code: "SOURCING", name: "Sourcing" }, { id: "s2", code: "TRADING", name: "Trading" }, { id: "s3", code: "SHIPPING", name: "Shipping" }]
});
