import type { BillingPlanCode } from "@/utils/workspace/types";

export type AuthFlowTarget = "workspace" | "download";

export function parseAuthFlowTarget(value: string | null | undefined): AuthFlowTarget {
  void value;
  return "workspace";
}

export function parseAuthPlan(value: string | null | undefined): BillingPlanCode | null {
  return value === "free" || value === "pro" || value === "founding" ? value : null;
}

export function buildGoogleCallbackUrl(options: {
  origin: string;
  plan: BillingPlanCode | null;
  target: AuthFlowTarget;
  source?: "page" | "modal";
}) {
  const url = new URL("/auth/callback", options.origin);

  if (options.plan) {
    url.searchParams.set("plan", options.plan);
  }

  if (options.source) {
    url.searchParams.set("source", options.source);
  }

  return url.toString();
}

export function buildAuthErrorRedirect(options: {
  plan: BillingPlanCode | null;
  target: AuthFlowTarget;
  message: string;
}) {
  const params = new URLSearchParams();

  if (options.plan) {
    params.set("plan", options.plan);
  }

  params.set("auth_error", options.message);

  return `/auth?${params.toString()}`;
}

export function getOAuthErrorMessage(
  errorCode: string | null | undefined,
  errorDescription: string | null | undefined,
) {
  const normalizedCode = (errorCode ?? "").toLowerCase();
  const normalizedDescription = decodeURIComponent(errorDescription ?? "").toLowerCase();

  if (normalizedCode.includes("access_denied") || normalizedDescription.includes("access denied")) {
    return "A autenticação com Google foi cancelada antes da conclusão.";
  }

  if (
    normalizedDescription.includes("unsupported provider") ||
    normalizedDescription.includes("provider is not enabled")
  ) {
    return "O login com Google ainda não está habilitado neste ambiente do CodeTrail.";
  }

  return "Não foi possível concluir a autenticação com Google. Tente novamente.";
}

export function getAuthErrorMessage(error: Error | { message?: string } | unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "";

  if (message.includes("Invalid login credentials")) return "Credenciais incorretas (E-mail ou Senha).";
  if (message.includes("User already registered")) return "Este e-mail ja esta sendo utilizado.";
  if (message.includes("Password should be at least")) return "A senha deve ter no minimo 6 caracteres.";
  if (message.includes("rate limit")) return "Muitas tentativas em pouco tempo. Aguarde um momento.";
  if (message.includes("Email not confirmed")) return "Verifique sua caixa de e-mail para validar a conta antes de entrar.";
  if (message.includes("popup_closed_by_user")) return "A autenticação com Google foi cancelada antes da conclusão.";
  if (message.includes("Unsupported provider") || message.includes("provider is not enabled")) {
    return "O login com Google ainda não está habilitado neste ambiente do CodeTrail.";
  }
  return "Falha de comunicacao com os servidores. Verifique sua conexao e tente novamente.";
}
