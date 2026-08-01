export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(value, { minimumLength = 8 } = {}) {
  if (!value) return "Enter your password.";
  if (value.length < minimumLength) return `Use at least ${minimumLength} characters.`;
  return "";
}

export function friendlyAuthError(error) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (message.includes("email not confirmed")) return "Confirm your email before signing in.";
  if (message.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  if (message.includes("expired")) return "This recovery link has expired. Request a new one.";
  return "We could not complete that request. Please try again.";
}
