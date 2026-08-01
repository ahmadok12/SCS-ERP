const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_PATTERN = /^[A-Z]{2}$/;
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,19}$/;

export function normalizeCustomerForm(formData) {
  return {
    customer_code: String(formData.get("customer_code") || "").trim().toUpperCase(),
    company_name: String(formData.get("company_name") || "").trim(),
    contact_person: String(formData.get("contact_person") || "").trim() || null,
    email: String(formData.get("email") || "").trim().toLowerCase() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    whatsapp: String(formData.get("whatsapp") || "").trim() || null,
    country_code: String(formData.get("country_code") || "").trim().toUpperCase() || null,
    billing_address: String(formData.get("billing_address") || "").trim() || null,
    payment_terms_days: Number(formData.get("payment_terms_days") || 0),
    credit_limit_base: Number(formData.get("credit_limit_base") || 0),
    is_active: formData.get("is_active") === "on"
  };
}

export function validateCustomer(customer) {
  const errors = {};
  if (!CODE_PATTERN.test(customer.customer_code)) errors.customer_code = "Use 2–20 uppercase letters, numbers or hyphens.";
  if (customer.company_name.length < 2 || customer.company_name.length > 160) errors.company_name = "Enter a company name between 2 and 160 characters.";
  if (customer.email && !EMAIL_PATTERN.test(customer.email)) errors.email = "Enter a valid email address.";
  if (customer.country_code && !COUNTRY_PATTERN.test(customer.country_code)) errors.country_code = "Use a two-letter country code, such as PK or CN.";
  if (!Number.isInteger(customer.payment_terms_days) || customer.payment_terms_days < 0 || customer.payment_terms_days > 365) errors.payment_terms_days = "Enter 0–365 days.";
  if (!Number.isFinite(customer.credit_limit_base) || customer.credit_limit_base < 0) errors.credit_limit_base = "Credit limit cannot be negative.";
  return errors;
}
