"use client";

import { login, savePlanIntent, signup } from "@/app/actions/auth";
import { usePlanIntent } from "@/store/plan-intent-store";
import { createClient } from "@/utils/supabase/client";
import { createCheckout } from "@/utils/workspace/api";
import type { BillingPlanCode } from "@/utils/workspace/types";
import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const planCatalog: Record<
  BillingPlanCode,
  {
    title: string;
    price: string;
    cadence: string;
    summary: string;
  }
> = {
  free: {
    title: "Plano Free",
    price: "R$ 0",
    cadence: "/mês",
    summary: "Estrutura base para sair do improviso e começar a usar o workspace.",
  },
  pro: {
    title: "Plano Pro",
    price: "R$ 19",
    cadence: "/mês",
    summary: "Checkout direto com recursos premium e expansão completa do sistema.",
  },
  founding: {
    title: "Plano Founding",
    price: "R$ 199",
    cadence: "/único",
    summary: "Acesso vitalício para quem entra cedo e quer manter o produto por perto.",
  },
};

export default function AuthPage() {
  const { selectedPlan, clearIntent } = usePlanIntent();
  const [queryPlan, setQueryPlan] = useState<BillingPlanCode | null>(null);
  const [target, setTarget] = useState<"workspace" | "download">("workspace");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const activePlan = selectedPlan ?? queryPlan;
  const activePlanMeta = activePlan ? planCatalog[activePlan] : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQueryPlan(parsePlan(params.get("plan")));
    setTarget(params.get("target") === "download" ? "download" : "workspace");
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(event.currentTarget);

    try {
      const authResult = isLogin ? await login(formData) : await signup(formData);

      if (authResult.error) {
        setErrorMsg(authResult.error);
        setIsLoading(false);
        return;
      }

      if (authResult.isSignup) {
        setSuccessMsg(
          activePlan && activePlan !== "free"
            ? "Conta criada. Confirme seu e-mail e depois faça login para concluir o checkout do plano."
            : "Conta criada. Confirme seu e-mail e depois faça login para acessar o workspace.",
        );
        setIsLogin(true);
        setIsLoading(false);
        return;
      }

      if (activePlan) {
        const intentResult = await savePlanIntent(activePlan);
        if (intentResult?.error) {
          console.error("Failed to save plan intent:", intentResult.error);
        }
        clearIntent();

        if (activePlan === "free") {
          window.location.assign(target === "download" ? "/download/windows" : "/workspace/dashboard");
          return;
        }

        try {
          const supabase = createClient();
          const checkout = await createCheckout(supabase, activePlan);

          if (checkout.checkoutUrl) {
            window.location.assign(checkout.checkoutUrl);
            return;
          }

          if (checkout.managementUrl) {
            window.location.assign(checkout.managementUrl);
            return;
          }
        } catch (error) {
          if (isExistingSubscriptionError(error)) {
            window.location.assign("/workspace/settings/billing");
            return;
          }

          setErrorMsg(resolveBillingError(error));
          return;
        }

        window.location.assign("/workspace/settings/billing");
        return;
      }

      window.location.assign(target === "download" ? "/download/windows" : "/workspace/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="workspace-auth workspace-auth--enhanced">
      <div className="workspace-auth__panel">
        <section className="workspace-auth__intro workspace-auth__intro--hero">
          <span className="workspace-badge">CodeTrail Access</span>
          <h1>Ative sua conta e continue seu fluxo sem perder contexto.</h1>
          <p>
            A autenticação conecta workspace, billing e histórico no mesmo backend. Você entra uma
            vez e continua o produto inteiro com a mesma conta.
          </p>

          <div className="workspace-auth__highlights workspace-auth__highlights--stacked">
            <div>
              <strong>Mesmo backend</strong>
              <span>Supabase, billing e dados compartilhados entre web e Windows.</span>
            </div>
            <div>
              <strong>Mesmo sistema</strong>
              <span>Trilhas, sessões, tarefas, revisões, projetos e analytics no mesmo fluxo.</span>
            </div>
            <div>
              <strong>Checkout integrado</strong>
              <span>Planos pagos seguem para Stripe logo após o login, sem etapas quebradas.</span>
            </div>
          </div>

          {activePlanMeta ? (
            <div className="workspace-auth__plan-card">
              <div>
                <span className="workspace-auth__legend">
                  <ShieldCheck size={14} />
                  Plano selecionado
                </span>
                <strong>{activePlanMeta.title}</strong>
                <p>{activePlanMeta.summary}</p>
              </div>
              <div className="workspace-plan-price">
                {activePlanMeta.price}
                <span>{activePlanMeta.cadence}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-auth__form-shell workspace-auth__form-shell--elevated">
          <header className="workspace-auth__form-header">
            <div>
              <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>
              <p>
                {isLogin
                  ? target === "download"
                    ? "Faça login para acessar o download e sincronizar o produto."
                    : "Faça login para abrir seu workspace web."
                  : "Crie sua conta para centralizar estudo, progresso e assinatura."}
              </p>
            </div>
            {activePlanMeta ? (
              <span className="workspace-pill workspace-pill--primary">{activePlanMeta.title}</span>
            ) : null}
          </header>

          {errorMsg ? <div className="workspace-auth__error">{errorMsg}</div> : null}
          {successMsg ? <div className="workspace-auth__success">{successMsg}</div> : null}

          <form onSubmit={handleSubmit} className="workspace-auth__form">
            <label className="workspace-field">
              <span>E-mail</span>
              <div className="workspace-auth__input">
                <UserRound size={16} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                />
              </div>
            </label>

            <label className="workspace-field">
              <span>Senha</span>
              <div className="workspace-auth__input">
                <KeyRound size={16} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button className="workspace-button workspace-button--primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isLogin ? "Entrar no sistema" : "Criar acesso"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="workspace-auth__steps">
            <div className="workspace-auth__step">
              <span>1</span>
              <p>Autentique sua conta</p>
            </div>
            <div className="workspace-auth__step">
              <span>2</span>
              <p>{activePlan && activePlan !== "free" ? "Conclua o checkout do plano" : "Entre direto no workspace"}</p>
            </div>
            <div className="workspace-auth__step">
              <span>3</span>
              <p>Continue no mesmo backend da web e do Windows</p>
            </div>
          </div>

          <footer className="workspace-auth__footer">
            <span>{isLogin ? "Ainda não tem conta?" : "Já possui acesso?"}</span>
            <button
              className="workspace-button workspace-button--ghost"
              onClick={() => setIsLogin((value) => !value)}
            >
              {isLogin ? "Criar conta" : "Voltar para login"}
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}

function parsePlan(plan: string | null): BillingPlanCode | null {
  if (plan === "free" || plan === "pro" || plan === "founding") {
    return plan;
  }

  return null;
}

function isExistingSubscriptionError(error: unknown) {
  const message = readErrorMessage(error).toLowerCase();
  return (
    message.includes("already active") ||
    message.includes("subscription is already active") ||
    message.includes("paid subscription")
  );
}

function resolveBillingError(error: unknown) {
  const message = readErrorMessage(error).toLowerCase();

  if (message.includes("founding plan is not available")) {
    return "O plano Founding não está disponível para esta conta neste momento.";
  }

  if (message.includes("customer record")) {
    return "Seu cadastro ainda está sendo provisionado. Tente novamente em alguns segundos.";
  }

  if (message.includes("checkout")) {
    return "Não foi possível iniciar o checkout agora. Tente novamente ou acesse a área de cobrança.";
  }

  return "Não foi possível iniciar a assinatura agora. Tente novamente.";
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }

  return "";
}
