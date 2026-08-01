export const ACCOUNTING_PROTOTYPE_DATA = Object.freeze({
  summary: {
    period: "August 2026",
    revenue: 8440000,
    grossProfit: 2063500,
    netProfit: 1378500,
    receivables: 4630000,
    payables: 2992000,
    assets: 12542000,
    liabilities: 5192500,
    equity: 7349500
  },
  accounts: [
    { id: "a1", code: "1000", name: "Assets", type: "asset", parent: null, normal: "Debit", control: "Header", active: true },
    { id: "a2", code: "1100", name: "Cash and cash equivalents", type: "asset", parent: "1000 Assets", normal: "Debit", control: "Header", active: true },
    { id: "a3", code: "1110", name: "PKR Bank", type: "asset", parent: "1100 Cash and cash equivalents", normal: "Debit", control: "Bank", active: true },
    { id: "a4", code: "1120", name: "CNY Bank", type: "asset", parent: "1100 Cash and cash equivalents", normal: "Debit", control: "Bank", active: true },
    { id: "a5", code: "1200", name: "Accounts Receivable", type: "asset", parent: "1000 Assets", normal: "Debit", control: "Accounts receivable", active: true },
    { id: "a6", code: "2000", name: "Liabilities", type: "liability", parent: null, normal: "Credit", control: "Header", active: true },
    { id: "a7", code: "2100", name: "Accounts Payable", type: "liability", parent: "2000 Liabilities", normal: "Credit", control: "Accounts payable", active: true },
    { id: "a8", code: "2200", name: "Customer Funds Held", type: "liability", parent: "2000 Liabilities", normal: "Credit", control: "Customer funds held", active: true },
    { id: "a9", code: "3000", name: "Partner Capital", type: "equity", parent: null, normal: "Credit", control: "Posting", active: true },
    { id: "a10", code: "4000", name: "Revenue", type: "revenue", parent: null, normal: "Credit", control: "Header", active: true },
    { id: "a11", code: "4110", name: "Sourcing Revenue", type: "revenue", parent: "4000 Revenue", normal: "Credit", control: "Posting", active: true },
    { id: "a12", code: "4120", name: "Trading Revenue", type: "revenue", parent: "4000 Revenue", normal: "Credit", control: "Posting", active: true },
    { id: "a13", code: "4130", name: "Shipping Revenue", type: "revenue", parent: "4000 Revenue", normal: "Credit", control: "Posting", active: true },
    { id: "a14", code: "5000", name: "Direct Project Costs", type: "cost_of_sales", parent: null, normal: "Debit", control: "Header", active: true },
    { id: "a15", code: "5110", name: "Product Cost", type: "cost_of_sales", parent: "5000 Direct Project Costs", normal: "Debit", control: "Posting", active: true },
    { id: "a16", code: "5130", name: "Shipping Vendor Cost", type: "cost_of_sales", parent: "5000 Direct Project Costs", normal: "Debit", control: "Posting", active: true },
    { id: "a17", code: "6000", name: "Operating Expenses", type: "operating_expense", parent: null, normal: "Debit", control: "Header", active: true },
    { id: "a18", code: "6110", name: "Lahore Office Expenses", type: "operating_expense", parent: "6000 Operating Expenses", normal: "Debit", control: "Posting", active: true }
  ],
  journals: [
    { id: "j1", number: "JE-2026-00841", date: "2026-08-01", type: "Customer invoice", description: "INV-26081 · Kitchen Storage Range", branch: "Lahore Office", debit: 1240000, credit: 1240000, status: "posted", source: "INV-26081", lines: [
      { account: "1200 Accounts Receivable", description: "Pak Home Stores", currency: "PKR", originalDebit: 1240000, originalCredit: 0, rate: 1, debit: 1240000, credit: 0, project: "SCS-26031" },
      { account: "4110 Sourcing Revenue", description: "Sourcing fee", currency: "PKR", originalDebit: 0, originalCredit: 820000, rate: 1, debit: 0, credit: 820000, project: "SCS-26031" },
      { account: "4130 Shipping Revenue", description: "Shipping service", currency: "PKR", originalDebit: 0, originalCredit: 420000, rate: 1, debit: 0, credit: 420000, project: "SCS-26031" }
    ]},
    { id: "j2", number: "JE-2026-00840", date: "2026-07-31", type: "Supplier payment", description: "PAY-26039 · Yiwu Homeware Co.", branch: "China Office", debit: 794000, credit: 794000, status: "posted", source: "PAY-26039", lines: [] },
    { id: "j3", number: "JE-2026-00839", date: "2026-07-29", type: "Supplier bill", description: "BILL-26054 · Kitchen Storage Range", branch: "China Office", debit: 1325000, credit: 1325000, status: "posted", source: "BILL-26054", lines: [] },
    { id: "j4", number: "JE-2026-00838", date: "2026-07-24", type: "Customer receipt", description: "RCP-26046 · Pak Home Stores", branch: "Lahore Office", debit: 800000, credit: 800000, status: "posted", source: "RCP-26046", lines: [] },
    { id: "j5", number: "JE-2026-00837", date: "2026-07-18", type: "Expense", description: "EXP-26072 · Dragon Inspection", branch: "China Office", debit: 85200, credit: 85200, status: "posted", source: "EXP-26072", lines: [] },
    { id: "j6", number: "JE-2026-00836", date: "2026-07-15", type: "Manual adjustment", description: "Monthly software accrual", branch: "Shared", debit: 48500, credit: 48500, status: "posted", source: "Manual", lines: [] }
  ],
  ledger: [
    { date: "2026-07-01", journal: "OB-2026-00001", account: "1110 PKR Bank", description: "Opening balance", branch: "Lahore Office", project: "—", debit: 3250000, credit: 0, balance: 3250000 },
    { date: "2026-07-24", journal: "JE-2026-00838", account: "1110 PKR Bank", description: "Customer receipt RCP-26046", branch: "Lahore Office", project: "SCS-26031", debit: 800000, credit: 0, balance: 4050000 },
    { date: "2026-07-31", journal: "JE-2026-00840", account: "1120 CNY Bank", description: "Supplier payment PAY-26039", branch: "China Office", project: "SCS-26031", debit: 0, credit: 794000, balance: 3256000 },
    { date: "2026-08-01", journal: "JE-2026-00841", account: "1200 Accounts Receivable", description: "Customer invoice INV-26081", branch: "Lahore Office", project: "SCS-26031", debit: 1240000, credit: 0, balance: 4496000 }
  ],
  trialBalance: [
    { code: "1110", account: "PKR Bank", type: "Asset", debit: 4458000, credit: 0 },
    { code: "1120", account: "CNY Bank", type: "Asset", debit: 3454000, credit: 0 },
    { code: "1200", account: "Accounts Receivable", type: "Asset", debit: 4630000, credit: 0 },
    { code: "2100", account: "Accounts Payable", type: "Liability", debit: 0, credit: 2992000 },
    { code: "2200", account: "Customer Funds Held", type: "Liability", debit: 0, credit: 2200500 },
    { code: "3000", account: "Partner Capital", type: "Equity", debit: 0, credit: 5971000 },
    { code: "4110", account: "Sourcing Revenue", type: "Revenue", debit: 0, credit: 3280000 },
    { code: "4120", account: "Trading Revenue", type: "Revenue", debit: 0, credit: 2800000 },
    { code: "4130", account: "Shipping Revenue", type: "Revenue", debit: 0, credit: 2360000 },
    { code: "5110", account: "Product Cost", type: "Cost of sales", debit: 3928000, credit: 0 },
    { code: "5130", account: "Shipping Vendor Cost", type: "Cost of sales", debit: 2448500, credit: 0 },
    { code: "6110", account: "Lahore Office Expenses", type: "Operating expense", debit: 685000, credit: 0 }
  ],
  incomeStatement: [
    { group: "Revenue", label: "Sourcing revenue", amount: 3280000 }, { group: "Revenue", label: "Trading revenue", amount: 2800000 }, { group: "Revenue", label: "Shipping revenue", amount: 2360000 },
    { group: "Cost of sales", label: "Product cost", amount: -3928000 }, { group: "Cost of sales", label: "Shipping vendor cost", amount: -2448500 },
    { group: "Operating expenses", label: "Lahore office expenses", amount: -685000 }
  ],
  balanceSheet: [
    { group: "Assets", label: "Cash and bank", amount: 7912000 }, { group: "Assets", label: "Accounts receivable", amount: 4630000 },
    { group: "Liabilities", label: "Accounts payable", amount: 2992000 }, { group: "Liabilities", label: "Customer funds held", amount: 2200500 },
    { group: "Equity", label: "Partner capital and retained earnings", amount: 7349500 }
  ],
  receivables: [
    { party: "Pak Home Stores", document: "INV-26081", project: "SCS-26031", due: "2026-08-20", currency: "PKR", original: 1240000, base: 1240000, outstanding: 440000, age: "Current" },
    { party: "Gulf Trade Partners", document: "INV-26067", project: "SCS-26025", due: "2026-07-26", currency: "CNY", original: 35600, base: 1380000, outstanding: 1380000, age: "1–30 days" },
    { party: "Karachi Retail Group", document: "INV-26059", project: "SCS-26028", due: "2026-07-10", currency: "PKR", original: 1450000, base: 1450000, outstanding: 920000, age: "1–30 days" }
  ],
  payables: [
    { party: "Yiwu Homeware Co.", document: "BILL-26054", project: "SCS-26031", due: "2026-08-12", currency: "CNY", original: 34200, base: 1325000, outstanding: 531000, age: "Current" },
    { party: "Guangzhou Display Ltd.", document: "BILL-26042", project: "SCS-26028", due: "2026-07-25", currency: "CNY", original: 37800, base: 1464000, outstanding: 1464000, age: "1–30 days" },
    { party: "Dragon Inspection", document: "BILL-26038", project: "SCS-26025", due: "2026-07-08", currency: "CNY", original: 25800, base: 997000, outstanding: 997000, age: "1–30 days" }
  ]
});
