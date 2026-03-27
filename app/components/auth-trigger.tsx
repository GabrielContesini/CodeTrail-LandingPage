"use client";

import { AlertTriangle, ArrowRight, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  buildCodeTrailWebEntryHref,
  buildCodeTrailWebWorkspaceHref,
} from "@/utils/codetrail-web-url";
import type { BillingPlanCode } from "@/utils/workspace/types";

function planLabel(plan?: BillingPlanCode | null) {
  switch (plan) {
    case "pro":
      return "Pro";
    case "founding":
      return "Founding";
    case "free":
      return "Free";
    default:
      return "premium";
  }
}

export function AuthTrigger({
  children,
  className,
  plan,
  target = "workspace",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  plan?: BillingPlanCode;
  target?: "workspace" | "download";
  onClick?: (event: React.MouseEvent) => void;
}) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [activePaidPlan, setActivePaidPlan] = useState<BillingPlanCode | null>(null);

  const checkoutHref = buildCodeTrailWebEntryHref({
    originHint: typeof window !== "undefined" ? window.location.origin : undefined,
    plan,
    target,
  });
  const settingsHref = buildCodeTrailWebWorkspaceHref({
    originHint: typeof window !== "undefined" ? window.location.origin : undefined,
    slug: ["settings", "billing"],
  });
  const dashboardHref = buildCodeTrailWebWorkspaceHref({
    originHint: typeof window !== "undefined" ? window.location.origin : undefined,
    slug: ["dashboard"],
  });

  useEffect(() => {
    if (!warningOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [warningOpen]);

  function getSupabaseClient() {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return null;
    }

    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }

    return supabaseRef.current;
  }

  const handleTrigger = async (event: React.MouseEvent) => {
    event.preventDefault();
    onClick?.(event);

    const isPaidWorkspacePlan = plan && plan !== "free" && target === "workspace";
    if (!isPaidWorkspacePlan) {
      window.location.assign(checkoutHref);
      return;
    }

    setCheckingPlan(true);
    setWarningOpen(false);
    setActivePaidPlan(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        window.location.assign(checkoutHref);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        window.location.assign(checkoutHref);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.assign(checkoutHref);
        return;
      }

      const { data, error } = await supabase.rpc("get_my_billing_snapshot");
      if (error) {
        window.location.assign(checkoutHref);
        return;
      }

      const paidPlan = resolveActivePaidPlan(data);
      if (!paidPlan) {
        window.location.assign(checkoutHref);
        return;
      }

      setActivePaidPlan(paidPlan);
      setWarningOpen(true);
    } catch {
      window.location.assign(checkoutHref);
    } finally {
      setCheckingPlan(false);
    }
  };

  const isSamePlan = Boolean(activePaidPlan && plan && activePaidPlan === plan);
  const modalTitle = isSamePlan
    ? "Esse plano já está ativo na sua conta."
    : "A troca de plano precisa acontecer dentro do sistema.";
  const modalDescription = isSamePlan
    ? "Sua conta já está vinculada a este plano premium. Se quiser revisar cobrança, portal ou renovação, siga pela área interna de billing."
    : "Sua conta já possui um plano premium ativo. Para evitar cobrança duplicada ou fluxo inconsistente, a alteração precisa acontecer em Configurações > Plano e cobrança.";

  return (
    <>
      <button
        type="button"
        onClick={(event) => void handleTrigger(event)}
        className={className}
        disabled={checkingPlan}
        aria-busy={checkingPlan}
      >
        {children}
      </button>

      {warningOpen ? (
        <div
          className="fixed inset-0 z-[90] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-change-warning-title"
        >
          <div
            className="fixed inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,214,10,0.14),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(50,208,255,0.12),transparent_28%),rgba(5,9,14,0.88)] backdrop-blur-md"
            onClick={() => setWarningOpen(false)}
          />

          <div className="relative z-10 flex min-h-screen items-stretch justify-center p-3 sm:p-6 lg:p-8">
            <div className="relative my-auto flex w-full max-w-[1240px] overflow-hidden rounded-[34px] border border-yellow-400/18 bg-[linear-gradient(180deg,rgba(14,18,25,0.98),rgba(8,12,18,0.99))] shadow-[0_36px_110px_rgba(0,0,0,0.46)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent" />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-[44%] bg-[radial-gradient(circle_at_top_left,rgba(255,214,10,0.12),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] lg:block"
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => setWarningOpen(false)}
                className="touch-target absolute right-4 top-4 z-20 inline-flex items-center justify-center rounded-full border border-transparent bg-transparent p-2 text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-border/80 hover:bg-white/[0.05] hover:text-white"
                aria-label="Fechar aviso de troca de plano"
              >
                <X size={18} />
              </button>

              <div className="grid min-h-[min(88vh,760px)] w-full gap-0 lg:grid-cols-[1.12fr_0.88fr]">
                <section className="relative flex flex-col gap-8 border-b border-yellow-400/10 px-6 py-8 sm:px-8 sm:py-9 lg:border-b-0 lg:border-r lg:px-10 lg:py-10 xl:px-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/24 bg-yellow-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-200">
                      <AlertTriangle size={13} />
                      Gestão de plano protegida
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      <ShieldCheck size={13} />
                      Billing ativo na conta
                    </span>
                  </div>

                  <div className="flex max-w-2xl flex-col gap-4">
                    <h3
                      id="plan-change-warning-title"
                      className="m-0 text-3xl font-display font-medium tracking-tight text-white sm:text-4xl xl:text-[3.25rem]"
                    >
                      {modalTitle}
                    </h3>
                    <p className="m-0 max-w-[42rem] text-sm leading-relaxed text-text-secondary sm:text-base">
                      {modalDescription}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[28px] border border-yellow-400/16 bg-yellow-400/[0.06] px-5 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-200">Plano atual</span>
                      <strong className="mt-3 block font-display text-2xl text-white">
                        {planLabel(activePaidPlan)}
                      </strong>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                        Esta conta já está conectada a uma assinatura premium ativa.
                      </p>
                    </div>

                    <div className="rounded-[28px] border border-border/70 bg-white/[0.03] px-5 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Ação desejada</span>
                      <strong className="mt-3 block font-display text-2xl text-white">
                        {isSamePlan ? "Revisar assinatura" : `Migrar para ${planLabel(plan)}`}
                      </strong>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                        O próximo passo acontece dentro do produto para respeitar o estado real do billing.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[30px] border border-border/70 bg-white/[0.03] px-5 py-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                          <Sparkles size={18} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <strong className="font-display text-lg text-white">Por que a landing bloqueia isso?</strong>
                          <p className="m-0 text-sm leading-relaxed text-text-secondary">
                            A landing é a porta de entrada para aquisição. Mudança de plano exige leitura de assinatura,
                            customer e ciclo atual, então o fluxo seguro continua dentro do sistema.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[30px] border border-border/70 bg-white/[0.03] px-5 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">O que você pode fazer agora</span>
                      <ul className="mt-4 flex list-none flex-col gap-3 p-0 text-sm leading-relaxed text-text-secondary">
                        <li className="rounded-2xl border border-white/[0.06] bg-background/30 px-4 py-3">
                          Abrir o billing interno para trocar, cancelar ou revisar a assinatura.
                        </li>
                        <li className="rounded-2xl border border-white/[0.06] bg-background/30 px-4 py-3">
                          Seguir para o workspace e continuar do ponto em que sua conta já está.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="flex flex-col justify-between gap-6 px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10 xl:px-12">
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                      Próximo passo recomendado
                    </span>

                    <div className="rounded-[32px] border border-primary/18 bg-[linear-gradient(180deg,rgba(50,208,255,0.14),rgba(50,208,255,0.08))] px-5 py-5 shadow-[0_20px_46px_rgba(10,20,40,0.2)]">
                      <strong className="font-display text-2xl text-white">
                        Abra Plano e cobrança dentro da sua conta.
                      </strong>
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                        Esse é o caminho certo para trocar de plano, abrir o portal da assinatura ou revisar o status atual
                        sem gerar ruído no fluxo de aquisição.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={() => window.location.assign(settingsHref)}
                      className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-[22px] border border-primary/28 bg-primary/12 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-primary transition-[border-color,background-color,color,transform] duration-200 hover:border-primary/42 hover:bg-primary/18 hover:text-white"
                    >
                      Abrir plano e cobrança
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => window.location.assign(dashboardHref)}
                      className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[22px] border border-border/70 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition-[border-color,background-color,color] duration-200 hover:border-border hover:bg-white/[0.06]"
                    >
                      Ir para o workspace
                    </button>

                    <button
                      type="button"
                      onClick={() => setWarningOpen(false)}
                      className="inline-flex min-h-[50px] items-center justify-center rounded-[18px] border border-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-border/70 hover:bg-white/[0.04] hover:text-white"
                    >
                      Fechar aviso
                    </button>
                  </div>

                  <div className="rounded-[24px] border border-primary/14 bg-primary/[0.05] px-4 py-4 text-sm leading-relaxed text-text-secondary">
                    Novo visitante sem sessão ativa segue direto para a assinatura.
                    Este aviso agora só aparece quando existe <span className="font-semibold text-white">usuário autenticado com plano pago ativo</span>.
                  </div>
                </section>
              </div>

              {checkingPlan ? (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/45 backdrop-blur-sm">
                  <div className="rounded-[22px] border border-border/70 bg-[rgba(10,14,20,0.96)] px-5 py-4 text-sm font-medium text-white shadow-[0_24px_48px_rgba(0,0,0,0.32)]">
                    Verificando estado da assinatura...
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function resolveActivePaidPlan(snapshot: unknown): BillingPlanCode | null {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const subscription = "subscription" in snapshot && snapshot.subscription && typeof snapshot.subscription === "object"
    ? snapshot.subscription as { status?: unknown }
    : null;
  const currentPlan = "current_plan" in snapshot && snapshot.current_plan && typeof snapshot.current_plan === "object"
    ? snapshot.current_plan as { code?: unknown }
    : null;

  const status = typeof subscription?.status === "string" ? subscription.status : "";
  const code = typeof currentPlan?.code === "string" ? currentPlan.code : "";
  const isPaidStatus = status === "active" || status === "trialing" || status === "past_due";

  if (!isPaidStatus) {
    return null;
  }

  if (code === "pro" || code === "founding") {
    return code;
  }

  return null;
}
