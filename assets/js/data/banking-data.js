export const BANKING_PROTOTYPE_DATA = Object.freeze({
  asOf: "2026-08-31",
  accounts: [
    { id: "ba1", code: "PKR-BANK", name: "PKR Bank", kind: "bank", currency: "PKR", branch: "Lahore Office", institution: "Meezan Bank", maskedNumber: "•••• 4821", originalBalance: 3220000, baseBalance: 3220000, reconciledThrough: "2026-08-29", unreconciled: 2, active: true },
    { id: "ba2", code: "PKR-CASH", name: "PKR Cash", kind: "cash", currency: "PKR", branch: "Lahore Office", institution: "Cash on hand", maskedNumber: "", originalBalance: 420000, baseBalance: 420000, reconciledThrough: "2026-08-31", unreconciled: 0, active: true },
    { id: "ba3", code: "CNY-BANK", name: "CNY Bank", kind: "bank", currency: "CNY", branch: "China Office", institution: "Bank of China", maskedNumber: "•••• 2188", originalBalance: 72000, baseBalance: 2822400, reconciledThrough: "2026-08-30", unreconciled: 1, active: true },
    { id: "ba4", code: "CNY-WECHAT", name: "CNY WeChat", kind: "wechat", currency: "CNY", branch: "China Office", institution: "WeChat Pay", maskedNumber: "Business wallet", originalBalance: 28000, baseBalance: 1097600, reconciledThrough: "2026-08-28", unreconciled: 3, active: true },
    { id: "ba5", code: "CNY-ALIPAY", name: "CNY Alipay", kind: "alipay", currency: "CNY", branch: "China Office", institution: "Alipay", maskedNumber: "Business wallet", originalBalance: 9000, baseBalance: 352800, reconciledThrough: "2026-08-31", unreconciled: 0, active: true }
  ],
  transactions: [
    { id: "bt1", date: "2026-08-31", accountId: "ba1", account: "PKR Bank", direction: "inflow", type: "Customer receipt", reference: "RCPT-2026-00041", party: "Pak Agro Systems", currency: "PKR", originalAmount: 1250000, rate: 1, baseAmount: 1250000, reconciled: true },
    { id: "bt2", date: "2026-08-30", accountId: "ba3", account: "CNY Bank", direction: "outflow", type: "Supplier payment", reference: "PAY-2026-00032", party: "Qingdao Baichen", currency: "CNY", originalAmount: 42000, rate: 39.2, baseAmount: 1646400, reconciled: true },
    { id: "bt3", date: "2026-08-29", accountId: "ba4", account: "CNY WeChat", direction: "outflow", type: "Project expense", reference: "EXP-2026-00027", party: "Local transport", currency: "CNY", originalAmount: 1800, rate: 39.18, baseAmount: 70524, reconciled: false },
    { id: "bt4", date: "2026-08-28", accountId: "ba1", account: "PKR Bank", direction: "outflow", type: "Supplier payment", reference: "PAY-2026-00031", party: "Guangzhou Motion", currency: "PKR", originalAmount: 875000, rate: 1, baseAmount: 875000, reconciled: false },
    { id: "bt5", date: "2026-08-27", accountId: "ba4", account: "CNY WeChat", direction: "inflow", type: "Bank transfer", reference: "TRF-2026-00008", party: "From CNY Bank", currency: "CNY", originalAmount: 15000, rate: 39.15, baseAmount: 587250, reconciled: true },
    { id: "bt6", date: "2026-08-27", accountId: "ba3", account: "CNY Bank", direction: "outflow", type: "Bank transfer", reference: "TRF-2026-00008", party: "To CNY WeChat", currency: "CNY", originalAmount: 15000, rate: 39.15, baseAmount: 587250, reconciled: true },
    { id: "bt7", date: "2026-08-25", accountId: "ba1", account: "PKR Bank", direction: "inflow", type: "Customer receipt", reference: "RCPT-2026-00039", party: "Faisal Poultry", currency: "PKR", originalAmount: 950000, rate: 1, baseAmount: 950000, reconciled: true },
    { id: "bt8", date: "2026-08-23", accountId: "ba2", account: "PKR Cash", direction: "outflow", type: "Overhead expense", reference: "EXP-2026-00024", party: "Lahore office utilities", currency: "PKR", originalAmount: 68500, rate: 1, baseAmount: 68500, reconciled: true }
  ],
  statements: [
    { id: "bs1", accountId: "ba1", account: "PKR Bank", number: "AUG-2026", from: "2026-08-01", to: "2026-08-31", opening: 2765000, closing: 3220000, currency: "PKR", status: "in_progress", matched: 14, total: 16, difference: 875000 },
    { id: "bs2", accountId: "ba3", account: "CNY Bank", number: "AUG-2026", from: "2026-08-01", to: "2026-08-31", opening: 54000, closing: 72000, currency: "CNY", status: "in_progress", matched: 11, total: 12, difference: 1800 },
    { id: "bs3", accountId: "ba5", account: "CNY Alipay", number: "AUG-2026", from: "2026-08-01", to: "2026-08-31", opening: 6200, closing: 9000, currency: "CNY", status: "reconciled", matched: 7, total: 7, difference: 0 }
  ]
});
