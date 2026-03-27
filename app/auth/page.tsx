"use client";

import { usePlanIntent } from "@/store/plan-intent-store";
import { createClient } from "@/utils/supabase/client";
import { createCheckout } from "@/utils/workspace/api";
import type { BillingPlanCode } from "@/utils/workspace/types";
import { FeedbackMessage } from "@/app/components/ui/system-primitives";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const brandMark = "/design/CodeTrailMainIcon.png";

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
    summary: "Base do workspace para organizar sua rotina e começar com clareza.",
  },
  pro: {
    title: "Plano Pro",
    price: "R$ 25",
    cadence: "/mês",
    summary: "Recursos premium e checkout conectado ao mesmo backend da aplicação.",
  },
  founding: {
    title: "Plano Founding",
    price: "R$ 270",
    cadence: "/ano",
    summary: "Plano anual para usuários iniciais que querem acompanhar a evolução do produto com acesso premium completo.",
  },
};

export default function AuthPage() {
  const { selectedPlan, clearIntent } = usePlanIntent();
  const router = useRouter();
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
    setErrorMsg(params.get("billing_error") ?? "");
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createClient();

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(getAuthErrorMessage(error));
          setIsLoading(false);
          return;
        }

        if (activePlan) {
          await persistPlanIntent(supabase, activePlan, data.user?.id ?? null);
        }

        if (activePlan === "pro" || activePlan === "founding") {
          const checkout = await createCheckout(
            supabase,
            activePlan,
            data.session?.access_token ?? null,
            buildBillingReturnUrl(),
          );
          const redirectUrl = checkout.checkoutUrl ?? checkout.managementUrl;

          if (!redirectUrl) {
            setErrorMsg("Nao foi possivel abrir o checkout agora.");
            setIsLoading(false);
            return;
          }

          clearIntent();
          window.location.assign(redirectUrl);
          return;
        }

        clearIntent();

        if (activePlan === "free") {
          router.push(target === "download" ? "/download/windows" : "/workspace/dashboard");
          router.refresh();
          return;
        }

        router.push(target === "download" ? "/download/windows" : "/workspace/dashboard");
        router.refresh();
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(getAuthErrorMessage(error));
        setIsLoading(false);
        return;
      }

      if (data?.user && !data?.session) {
        setSuccessMsg(
          activePlan && activePlan !== "free"
            ? "Conta criada. Confirme seu e-mail e depois faça login para concluir o checkout do plano."
            : "Conta criada. Confirme seu e-mail e depois faça login para acessar o workspace.",
        );
        setIsLogin(true);
        setIsLoading(false);
        return;
      }

      clearIntent();
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-ui">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(50,208,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(159,232,112,0.08),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px] opacity-60 [mask-image:radial-gradient(circle_at_center,black_44%,transparent_88%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="glass-panel grid w-full overflow-hidden rounded-[30px] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative flex flex-col justify-center gap-8 border-b border-border/60 px-6 py-8 sm:px-8 sm:py-10 lg:border-b-0 lg:border-r lg:px-11 lg:py-11 xl:px-12 xl:py-12">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-border/70 bg-white/[0.04] px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 shadow-[0_0_18px_rgba(50,208,255,0.16)]">
                  <Image
                    src={brandMark}
                    alt="CodeTrail"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <strong className="font-display text-base tracking-tight text-white">CodeTrail</strong>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-primary/80">Acesso da landing</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                <ShieldCheck size={13} />
                Fluxo conectado
              </span>
            </div>

            <div className="flex max-w-2xl flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                Porta de entrada
              </span>
              <h1 className="m-0 max-w-2xl text-4xl font-display font-medium tracking-tight text-white sm:text-5xl lg:text-[3.45rem] lg:leading-[1.02]">
                Entre no ecossistema CodeTrail e continue a jornada no fluxo certo.
              </h1>
              <p className="m-0 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
                A landing inicia a entrada, mas a conta, o checkout e o workspace continuam integrados. Tudo com a mesma identidade visual e a mesma base.
              </p>
              {activePlanMeta ? (
                <div className="landing-surface flex max-w-xl flex-col gap-3 border-primary/18 p-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                      {activePlanMeta.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                      Fluxo premium preservado
                    </span>
                  </div>
                  <p className="m-0 text-sm leading-relaxed text-text-secondary">
                    {activePlanMeta.summary}
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="flex flex-col justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-6 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-11 xl:px-12 xl:py-12">
            <div className="mx-auto flex w-full max-w-xl flex-col gap-7 sm:gap-8">
              <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                <div className="flex flex-col gap-2">
                  <h2 className="m-0 text-3xl font-display font-medium text-white">
                    {isLogin ? "Acesse sua conta" : "Crie sua conta"}
                  </h2>
                  <p className="m-0 text-sm leading-relaxed text-text-secondary sm:text-base">
                    {isLogin
                      ? "Continue do ponto certo e siga para a versão adequada do produto."
                      : "Crie seu acesso no ecossistema CodeTrail com uma jornada visual mais clara."}
                  </p>
                </div>
                {activePlanMeta ? (
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {activePlanMeta.title}
                  </span>
                ) : null}
              </header>

              {errorMsg ? (
                <FeedbackMessage
                  tone="error"
                  title="Falha na autenticação"
                  message={errorMsg}
                />
              ) : null}
              {successMsg ? (
                <FeedbackMessage
                  tone="success"
                  title="Conta criada"
                  message={successMsg}
                />
              ) : null}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">E-mail</span>
                  <div className="relative flex items-center">
                    <UserRound size={16} className="pointer-events-none absolute left-4 text-text-secondary" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="voce@codetrail.site"
                      className="input-shell pl-11"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Senha</span>
                  <div className="relative flex items-center">
                    <KeyRound size={16} className="pointer-events-none absolute left-4 text-text-secondary" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Digite sua senha"
                      className="input-shell pl-11 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="touch-target absolute right-2 inline-flex items-center justify-center rounded-full border border-transparent px-3 text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-border/70 hover:bg-white/[0.04] hover:text-white"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="landing-button landing-button--primary mt-2 w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
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

              <div className="landing-surface flex flex-wrap items-center justify-between gap-4 rounded-[26px] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">1</div>
                  <div className="flex flex-col">
                    <strong className="text-sm font-display text-white">Entrada autenticada</strong>
                    <span className="text-xs text-text-secondary">Conta, plano e destino preservados.</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">Fluxo sincronizado</span>
              </div>

              <footer className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-text-secondary">
                  {isLogin ? "Ainda não tem conta?" : "Já possui acesso?"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin((v) => !v)}
                  className="landing-button landing-button--secondary px-5 py-3 text-xs"
                >
                  {isLogin ? "Criar conta" : "Voltar para login"}
                </button>
              </footer>
            </div>
          </section>
        </div>
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

function buildBillingReturnUrl() {
  return `${window.location.origin}/workspace/settings/billing`;
}

async function persistPlanIntent(
  supabase: ReturnType<typeof createClient>,
  selectedPlan: BillingPlanCode,
  userId?: string | null,
) {
  const resolvedUserId = userId ?? (await supabase.auth.getUser()).data.user?.id ?? null;

  if (!resolvedUserId) {
    return;
  }

  const { error } = await supabase.from("plan_intents").insert({
    user_id: resolvedUserId,
    selected_plan: selectedPlan,
    source: "landing_page",
    platform_interest: "windows",
    status: "interested",
  });

  if (error && !error.message.includes("Could not find the table") && error.code !== "42P01") {
    throw new Error(error.message);
  }
}

function getAuthErrorMessage(error: Error | { message?: string } | unknown) {
  const message = error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : "";

  if (message.includes("Invalid login credentials")) return "Credenciais incorretas (E-mail ou Senha).";
  if (message.includes("User already registered")) return "Este e-mail ja esta sendo utilizado.";
  if (message.includes("Password should be at least")) return "A senha deve ter no minimo 6 caracteres.";
  if (message.includes("rate limit")) return "Muitas tentativas em pouco tempo. Aguarde um momento.";
  if (message.includes("Email not confirmed")) return "Verifique sua caixa de e-mail para validar a conta antes de entrar.";
  return "Falha de comunicacao com os servidores. Verifique sua conexao e tente novamente.";
}
