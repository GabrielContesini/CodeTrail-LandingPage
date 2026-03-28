"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  LifeBuoy,
  LoaderCircle,
  MessageSquareText,
  SendHorizonal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  sanitizeSupportInput,
  SUPPORT_LIMITS,
  validateSupportInput,
  type SupportFieldErrorMap,
  type SupportOrigin,
} from "@/utils/support/shared";

type FeedbackTone = "success" | "error";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useStableReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return hydrated ? Boolean(prefersReducedMotion) : false;
}

function createTransition(reduced: boolean, duration = 0.26) {
  return reduced
    ? { duration: 0.01 }
    : {
        duration,
        ease: [0.22, 1, 0.36, 1] as const,
      };
}

function modalVariants(reduced: boolean) {
  return {
    hidden: {
      opacity: 0,
      scale: reduced ? 1 : 0.972,
      y: reduced ? 0 : 18,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: createTransition(reduced, 0.34),
    },
    exit: {
      opacity: 0,
      scale: reduced ? 1 : 0.986,
      y: reduced ? 0 : 14,
      transition: createTransition(reduced, 0.18),
    },
  };
}

export function SupportWidget({ origin }: { origin: SupportOrigin }) {
  const reducedMotion = useStableReducedMotion();
  const initialFocusRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<SupportFieldErrorMap>({});
  const [feedback, setFeedback] = useState<{
    tone: FeedbackTone;
    title: string;
    message: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const descriptionRemaining = useMemo(
    () => SUPPORT_LIMITS.description - form.description.length,
    [form.description.length],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = window.setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 40);

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(focusTarget);
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, submitting]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const payload = sanitizeSupportInput({
      ...form,
      origin,
      authenticated: false,
      pageUrl: window.location.href,
    });
    const validation = validateSupportInput(payload);

    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors);
      setFeedback({
        tone: "error",
        title: "Revise os dados",
        message: "Preencha os campos obrigatórios para enviar sua mensagem.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | {
            error?: string;
            fieldErrors?: SupportFieldErrorMap;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setFieldErrors(result?.fieldErrors ?? {});
        setFeedback({
          tone: "error",
          title: "Não foi possível enviar",
          message:
            result?.error ??
            "O suporte não pôde receber sua mensagem agora. Tente novamente em instantes.",
        });
        return;
      }

      setFieldErrors({});
      setFeedback({
        tone: "success",
        title: "Mensagem enviada",
        message:
          result?.message ??
          "Sua mensagem foi enviada com sucesso. Nosso suporte retornará em breve.",
      });
      setForm((current) => ({
        ...current,
        subject: "",
        description: "",
      }));
    } catch {
      setFeedback({
        tone: "error",
        title: "Falha de conexão",
        message: "Não foi possível conectar ao suporte agora. Tente novamente em instantes.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    if (!submitting) {
      setOpen(false);
    }
  }

  const firstInputKey = form.name ? (form.email ? (form.subject ? "description" : "subject") : "email") : "name";

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={reducedMotion ? undefined : { y: -2, scale: 1.01 }}
        whileTap={reducedMotion ? undefined : { scale: 0.985, y: 0.5 }}
        transition={createTransition(reducedMotion)}
        className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-[max(1rem,calc(env(safe-area-inset-right)+0.5rem))] z-[60] inline-flex min-h-[56px] items-center gap-3 rounded-full border border-primary/24 bg-[rgba(9,17,24,0.92)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary/40 hover:bg-[rgba(12,22,31,0.96)] hover:shadow-[0_22px_46px_rgba(0,0,0,0.34)]"
        aria-label="Abrir suporte"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/16 bg-primary/12 text-primary">
          <LifeBuoy size={18} />
        </span>
        <span className="hidden sm:inline">Suporte</span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={createTransition(reducedMotion, 0.18)}
          >
            <motion.button
              type="button"
              aria-label="Fechar modal de suporte"
              className="absolute inset-0 bg-background/86 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={createTransition(reducedMotion, 0.18)}
              onClick={closeModal}
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-modal-title"
              className="glass-panel relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden border border-primary/20"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants(reducedMotion)}
            >
              <header className="flex items-start justify-between gap-4 border-b border-border/50 bg-surface/72 px-6 py-5 sm:px-7">
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/24 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    <Sparkles size={13} />
                    Suporte CodeTrail
                  </span>
                  <div>
                    <h2 id="support-modal-title" className="m-0 text-2xl font-display text-white">
                      Fale com o suporte
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      Descreva seu problema e nossa equipe receberá sua mensagem por e-mail.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="touch-target inline-flex min-h-[40px] items-center justify-center rounded-full border border-transparent px-3 text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-border/70 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={closeModal}
                  disabled={submitting}
                  aria-label="Fechar suporte"
                >
                  <X size={16} />
                </button>
              </header>

              <div className="overflow-y-auto px-6 py-6 sm:px-7 sm:py-7">
                <div className="flex flex-col gap-5">
                  {feedback ? (
                    <div className={feedbackPanelClass(feedback.tone)}>
                      <div className="flex items-start gap-3.5">
                        <div className={feedbackIconClass(feedback.tone)}>
                          {feedback.tone === "success" ? (
                            <Sparkles size={18} />
                          ) : (
                            <MessageSquareText size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-sm font-semibold text-white">{feedback.title}</strong>
                          <p className="m-0 mt-1 text-sm leading-relaxed text-text-secondary">{feedback.message}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Nome</span>
                      <input
                        ref={
                          firstInputKey === "name"
                            ? (node) => {
                                initialFocusRef.current = node;
                              }
                            : undefined
                        }
                        name="name"
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        maxLength={SUPPORT_LIMITS.name}
                        placeholder="Seu nome"
                        className="input-shell"
                        aria-invalid={Boolean(fieldErrors.name)}
                      />
                      {fieldErrors.name ? <span className="text-xs text-rose-300">{fieldErrors.name}</span> : null}
                    </label>

                    <label className="flex flex-col gap-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">E-mail</span>
                      <input
                        ref={
                          firstInputKey === "email"
                            ? (node) => {
                                initialFocusRef.current = node;
                              }
                            : undefined
                        }
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        maxLength={SUPPORT_LIMITS.email}
                        placeholder="voce@codetrail.online"
                        className="input-shell"
                        aria-invalid={Boolean(fieldErrors.email)}
                      />
                      {fieldErrors.email ? <span className="text-xs text-rose-300">{fieldErrors.email}</span> : null}
                    </label>

                    <label className="flex flex-col gap-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Assunto</span>
                      <input
                        ref={
                          firstInputKey === "subject"
                            ? (node) => {
                                initialFocusRef.current = node;
                              }
                            : undefined
                        }
                        name="subject"
                        value={form.subject}
                        onChange={(event) => updateField("subject", event.target.value)}
                        maxLength={SUPPORT_LIMITS.subject}
                        placeholder="Ex.: problema no checkout, erro no login, bug visual"
                        className="input-shell"
                        aria-invalid={Boolean(fieldErrors.subject)}
                      />
                      {fieldErrors.subject ? <span className="text-xs text-rose-300">{fieldErrors.subject}</span> : null}
                    </label>

                    <label className="flex flex-col gap-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                        Descrição do problema
                      </span>
                      <textarea
                        ref={
                          firstInputKey === "description"
                            ? (node) => {
                                initialFocusRef.current = node;
                              }
                            : undefined
                        }
                        name="description"
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        maxLength={SUPPORT_LIMITS.description}
                        placeholder="Conte o que aconteceu, onde estava na interface e o que esperava que acontecesse."
                        className="input-shell min-h-[160px] resize-y"
                        aria-invalid={Boolean(fieldErrors.description)}
                      />
                      <span className="text-xs leading-relaxed text-text-tertiary">
                        {descriptionRemaining} caracteres restantes.
                      </span>
                      {fieldErrors.description ? (
                        <span className="text-xs text-rose-300">{fieldErrors.description}</span>
                      ) : null}
                    </label>

                    <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        className="landing-button landing-button--secondary touch-target text-sm font-semibold normal-case tracking-normal disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={closeModal}
                        disabled={submitting}
                      >
                        Fechar
                      </button>
                      <button
                        type="submit"
                        className="landing-button landing-button--primary touch-target text-sm font-semibold normal-case tracking-normal disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <LoaderCircle size={16} className="animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar mensagem
                            <SendHorizonal size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="rounded-[22px] border border-border/70 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-text-secondary">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-primary/16 bg-primary/10 text-primary">
                        <MessageSquareText size={16} />
                      </span>
                      <div>
                        <strong className="block text-white">Sua mensagem vai direto para o suporte oficial</strong>
                        <p className="m-0 mt-1">
                          Incluímos origem da solicitação, página atual, data/hora e contexto técnico básico para agilizar o atendimento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function feedbackPanelClass(tone: FeedbackTone) {
  return cx(
    "rounded-[24px] border px-5 py-4",
    tone === "success"
      ? "border-success/25 bg-success/10"
      : "border-[rgba(255,107,122,0.28)] bg-[rgba(255,107,122,0.12)]",
  );
}

function feedbackIconClass(tone: FeedbackTone) {
  return cx(
    "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border",
    tone === "success"
      ? "border-success/30 bg-success/14 text-success"
      : "border-[rgba(255,107,122,0.32)] bg-[rgba(255,107,122,0.16)] text-rose-300",
  );
}
