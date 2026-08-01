export const CUSTOMER_PROTOTYPE_DATA = Object.freeze([
  {
    id: "c1", customer_code: "CUS-0001", company_name: "Pak Home Stores", contact_person: "Usman Khalid",
    phone: "+92 300 812 4471", whatsapp: "+92 300 812 4471", email: "usman@pakhomestores.pk",
    country_code: "PK", billing_address: "Gulberg III, Lahore, Pakistan", payment_terms_days: 15,
    credit_limit_base: 5000000, is_active: true, active_projects: 3, project_count: 8,
    revenue_base: 9150000, receivable_base: 1840000, direct_cost_base: 6679500,
    projects: [
      { project_number: "SCS-26031", name: "Kitchen Storage Range", services: ["Sourcing", "Shipping"], status: "active", revenue: 3420000, gross_profit: 786000 },
      { project_number: "SCS-26018", name: "Bamboo Organizers", services: ["Trading"], status: "active", revenue: 2680000, gross_profit: 603000 },
      { project_number: "SCS-25142", name: "Home Textile Shipment", services: ["Shipping"], status: "completed", revenue: 1250000, gross_profit: 312500 }
    ],
    statement: [
      { date: "2026-07-01", type: "Opening balance", reference: "B/F", project: "—", currency: "PKR", original: 1000000, debit: 1000000, credit: 0 },
      { date: "2026-08-01", type: "Invoice", reference: "INV-26081", project: "Kitchen Storage Range", currency: "PKR", original: 1240000, debit: 1240000, credit: 0 },
      { date: "2026-07-24", type: "Receipt", reference: "RCP-26046", project: "Kitchen Storage Range", currency: "PKR", original: 800000, debit: 0, credit: 800000 },
      { date: "2026-07-15", type: "Invoice", reference: "INV-26069", project: "Bamboo Organizers", currency: "CNY", original: 28800, debit: 1120000, credit: 0 },
      { date: "2026-07-06", type: "Receipt", reference: "RCP-26038", project: "Bamboo Organizers", currency: "PKR", original: 720000, debit: 0, credit: 720000 }
    ]
  },
  {
    id: "c2", customer_code: "CUS-0002", company_name: "Karachi Retail Group", contact_person: "Sara Ahmed",
    phone: "+92 321 445 9082", whatsapp: "+92 321 445 9082", email: "sara@krg.com.pk", country_code: "PK",
    billing_address: "Shahrah-e-Faisal, Karachi, Pakistan", payment_terms_days: 30, credit_limit_base: 4000000,
    is_active: true, active_projects: 2, project_count: 5, revenue_base: 6840000, receivable_base: 920000,
    direct_cost_base: 5108580, projects: [{ project_number: "SCS-26028", name: "Retail Display Units", services: ["Trading", "Shipping"], status: "active", revenue: 2800000, gross_profit: 672000 }], statement: []
  },
  {
    id: "c3", customer_code: "CUS-0003", company_name: "Gulf Trade Partners", contact_person: "Hassan Mirza",
    phone: "+971 50 284 1061", whatsapp: "+971 50 284 1061", email: "hassan@gulftrade.ae", country_code: "AE",
    billing_address: "Business Bay, Dubai, UAE", payment_terms_days: 30, credit_limit_base: 8000000,
    is_active: true, active_projects: 1, project_count: 4, revenue_base: 5230000, receivable_base: 1380000,
    direct_cost_base: 4053250, projects: [{ project_number: "SCS-26025", name: "Hotel Amenities", services: ["Sourcing", "Shipping"], status: "active", revenue: 1900000, gross_profit: 427500 }], statement: []
  },
  {
    id: "c4", customer_code: "CUS-0004", company_name: "Nova Living", contact_person: "Ayesha Salman",
    phone: "+92 333 192 0007", whatsapp: "+92 333 192 0007", email: "accounts@novaliving.pk", country_code: "PK",
    billing_address: "DHA Phase 5, Lahore, Pakistan", payment_terms_days: 7, credit_limit_base: 2500000,
    is_active: true, active_projects: 1, project_count: 3, revenue_base: 3970000, receivable_base: 460000,
    direct_cost_base: 3176000, projects: [{ project_number: "SCS-26033", name: "Lighting Collection", services: ["Sourcing"], status: "active", revenue: 1480000, gross_profit: 296000 }], statement: []
  },
  {
    id: "c5", customer_code: "CUS-0005", company_name: "BuildRight Pakistan", contact_person: "Ali Raza",
    phone: "+92 301 665 8320", whatsapp: "+92 301 665 8320", email: "ali@buildright.pk", country_code: "PK",
    billing_address: "I-9 Industrial Area, Islamabad, Pakistan", payment_terms_days: 30, credit_limit_base: 3500000,
    is_active: false, active_projects: 0, project_count: 2, revenue_base: 2140000, receivable_base: 0,
    direct_cost_base: 1712000, projects: [{ project_number: "SCS-25108", name: "Hardware Components", services: ["Trading"], status: "completed", revenue: 2140000, gross_profit: 428000 }], statement: []
  }
]);
