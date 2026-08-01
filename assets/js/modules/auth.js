import { hasSupabaseConfiguration } from "../data/supabase-client.js";
import {
  getSession,
  requestPasswordReset,
  signIn,
  signOut,
  updatePassword
} from "../services/auth-service.js";
import { friendlyAuthError, validateEmail, validatePassword } from "../validation/auth-validation.js";

const pageType = document.body.dataset.authPage;

function setAlert(element, message, tone = "error") {
  if (!element) return;
  element.textContent = message;
  element.className = `auth-alert auth-alert--${tone}`;
  element.hidden = !message;
}

function setFieldError(form, fieldId, message) {
  const error = form.querySelector(`[data-error-for="${fieldId}"]`);
  const input = form.querySelector(`#${fieldId}`);
  if (error) error.textContent = message;
  if (input) input.setAttribute("aria-invalid", String(Boolean(message)));
}

function setBusy(button, busy, busyLabel = "Please wait…") {
  if (!button) return;
  button.disabled = busy;
  button.setAttribute("aria-busy", String(busy));
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent.trim();
  button.textContent = busy ? busyLabel : button.dataset.defaultLabel;
}

function safeReturnUrl() {
  const candidate = new URLSearchParams(window.location.search).get("return_to");
  if (candidate) {
    try {
      const parsed = new URL(candidate, window.location.origin);
      if (parsed.origin === window.location.origin) return parsed.href;
    } catch {
      // Fall through to the known dashboard route.
    }
  }
  return new URL("../dashboard/", window.location.href).href;
}

function showView(name) {
  document.querySelectorAll("[data-auth-view]").forEach((view) => {
    view.hidden = view.dataset.authView !== name;
  });
}

async function initializeSignInPage() {
  const configured = hasSupabaseConfiguration();
  const configAlert = document.querySelector("[data-config-alert]");
  const signInForm = document.querySelector("[data-sign-in-form]");
  const signInAlert = document.querySelector("[data-form-alert]");
  const recoveryForm = document.querySelector("[data-recovery-form]");
  const recoveryAlert = document.querySelector("[data-recovery-alert]");

  configAlert.hidden = configured;
  signInForm.querySelector("[data-submit-button]").disabled = !configured;
  recoveryForm.querySelector("[data-recovery-submit]").disabled = !configured;

  const requestedState = new URLSearchParams(window.location.search).get("state");
  if (configured) {
    const session = await getSession();
    if (requestedState === "pending" && session) showView("pending");
    else if (session) window.location.replace(safeReturnUrl());
  }

  document.querySelector("[data-show-recovery]").addEventListener("click", () => showView("recovery"));
  document.querySelector("[data-show-sign-in]").addEventListener("click", () => showView("sign-in"));
  document.querySelector("[data-password-toggle]").addEventListener("click", (event) => {
    const password = document.querySelector("#password");
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    event.currentTarget.textContent = show ? "Hide" : "Show";
    event.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });

  signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = signInForm.elements.email.value;
    const password = signInForm.elements.password.value;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, { minimumLength: 1 });
    setFieldError(signInForm, "email", emailError);
    setFieldError(signInForm, "password", passwordError);
    if (emailError || passwordError) return;

    const button = signInForm.querySelector("[data-submit-button]");
    setAlert(signInAlert, "");
    setBusy(button, true, "Signing in…");
    try {
      await signIn(email, password);
      window.location.replace(safeReturnUrl());
    } catch (error) {
      setAlert(signInAlert, friendlyAuthError(error));
      setBusy(button, false);
    }
  });

  recoveryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = recoveryForm.elements.email.value;
    const emailError = validateEmail(email);
    setFieldError(recoveryForm, "recovery-email", emailError);
    if (emailError) return;

    const button = recoveryForm.querySelector("[data-recovery-submit]");
    setAlert(recoveryAlert, "");
    setBusy(button, true, "Sending…");
    try {
      const redirectTo = new URL("./reset-password.html", window.location.href).href;
      await requestPasswordReset(email, redirectTo);
      setAlert(recoveryAlert, "If this email is registered, a recovery link is on its way.", "success");
      recoveryForm.reset();
    } catch (error) {
      setAlert(recoveryAlert, friendlyAuthError(error));
    } finally {
      setBusy(button, false);
    }
  });

  document.querySelector("[data-pending-sign-out]").addEventListener("click", async (event) => {
    setBusy(event.currentTarget, true, "Signing out…");
    await signOut();
    window.location.replace(new URL("./", window.location.href).href);
  });
}

async function initializeResetPage() {
  const form = document.querySelector("[data-reset-form]");
  const alert = document.querySelector("[data-reset-alert]");
  const button = form.querySelector("[data-reset-submit]");

  if (!hasSupabaseConfiguration()) {
    setAlert(alert, "Authentication setup is not connected yet.", "warning");
    button.disabled = true;
    return;
  }

  const session = await getSession();
  if (!session) {
    setAlert(alert, "This recovery link is invalid or has expired. Request a new link.");
    button.disabled = true;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = form.elements.password.value;
    const confirmation = form.elements.confirmation.value;
    const passwordError = validatePassword(password);
    const confirmationError = password !== confirmation ? "Passwords do not match." : "";
    setFieldError(form, "new-password", passwordError);
    setFieldError(form, "confirm-password", confirmationError);
    if (passwordError || confirmationError) return;

    setBusy(button, true, "Updating…");
    try {
      await updatePassword(password);
      setAlert(alert, "Password updated. You can now return to sign in.", "success");
      form.reset();
      form.querySelectorAll("input").forEach((input) => { input.disabled = true; });
    } catch (error) {
      setAlert(alert, friendlyAuthError(error));
      setBusy(button, false);
    }
  });
}

try {
  if (pageType === "sign-in") await initializeSignInPage();
  if (pageType === "reset-password") await initializeResetPage();
} catch (error) {
  const alert = document.querySelector("[data-form-alert], [data-reset-alert]");
  setAlert(alert, friendlyAuthError(error));
}
