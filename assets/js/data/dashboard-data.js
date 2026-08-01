export const DASHBOARD_DATA = {
  month: {
    label: "August 2026",
    metrics: {
      revenue: { value: 8420000, change: 12.4, caption: "vs. last month" },
      grossProfit: { value: 2145000, change: 8.7, caption: "25.5% margin" },
      netProfit: { value: 1280000, change: 6.2, caption: "15.2% margin" },
      receivables: { value: 3650000, change: -4.8, caption: "PKR 940k overdue" },
      payables: { value: 2170000, change: 3.1, caption: "PKR 520k due soon" },
      cash: { value: 6490000, change: 5.6, caption: "Across 5 accounts" }
    }
  },
  quarter: {
    label: "Q3 2026",
    metrics: {
      revenue: { value: 23180000, change: 15.8, caption: "vs. previous quarter" },
      grossProfit: { value: 5920000, change: 11.4, caption: "25.5% margin" },
      netProfit: { value: 3410000, change: 9.6, caption: "14.7% margin" },
      receivables: { value: 3650000, change: -4.8, caption: "PKR 940k overdue" },
      payables: { value: 2170000, change: 3.1, caption: "PKR 520k due soon" },
      cash: { value: 6490000, change: 5.6, caption: "Across 5 accounts" }
    }
  },
  year: {
    label: "2026 year to date",
    metrics: {
      revenue: { value: 58750000, change: 22.1, caption: "vs. same period 2025" },
      grossProfit: { value: 14920000, change: 18.4, caption: "25.4% margin" },
      netProfit: { value: 8240000, change: 14.9, caption: "14.0% margin" },
      receivables: { value: 3650000, change: -4.8, caption: "PKR 940k overdue" },
      payables: { value: 2170000, change: 3.1, caption: "PKR 520k due soon" },
      cash: { value: 6490000, change: 5.6, caption: "Across 5 accounts" }
    }
  },
  trend: [
    { month: "Mar", revenue: 5.1, profit: 1.1 },
    { month: "Apr", revenue: 5.8, profit: 1.3 },
    { month: "May", revenue: 6.3, profit: 1.5 },
    { month: "Jun", revenue: 7.0, profit: 1.6 },
    { month: "Jul", revenue: 7.5, profit: 1.9 },
    { month: "Aug", revenue: 8.42, profit: 2.15 }
  ],
  projectStatus: [
    { label: "On track", value: 12, color: "#2f7d61" },
    { label: "At risk", value: 3, color: "#c98a35" },
    { label: "Delayed", value: 2, color: "#b42318" }
  ],
  transactions: [
    { date: "01 Aug, 11:42", type: "Customer receipt", reference: "RCP-0268", party: "Orbit Traders", account: "PKR Bank", amount: 950000, direction: "in" },
    { date: "01 Aug, 10:15", type: "Supplier payment", reference: "SP-0184", party: "Guangzhou Lianhe", account: "CNY Alipay", amount: 684200, direction: "out" },
    { date: "31 Jul, 16:20", type: "Customer invoice", reference: "INV-0342", party: "Apex Retail", account: "Receivables", amount: 1275000, direction: "in" },
    { date: "31 Jul, 13:05", type: "Project expense", reference: "EXP-0146", party: "Inspection fee", account: "PKR Cash", amount: 78000, direction: "out" },
    { date: "30 Jul, 17:38", type: "Supplier bill", reference: "BILL-0229", party: "Shenzhen Cargo", account: "Payables", amount: 435000, direction: "out" }
  ],
  leaders: {
    customer: { name: "Orbit Traders", value: 684000, detail: "PKR 2.45m revenue", margin: "27.9% margin" },
    project: { name: "SCS-2026-041", value: 412000, detail: "Fitness Accessories", margin: "31.4% margin" }
  }
};
