import {
  Activity,
  ArrowRight,
  Check,
  Download,
  FolderKanban,
  Globe,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import { AuthTrigger } from "./components/auth-trigger";
import { DepthCard } from "./components/depth-card";
import { LandingHero } from "./components/landing-hero";
import { LandingMotion } from "./components/landing-motion";
import { LandingNav } from "./components/landing-nav";
import { LandingParallaxBackdrop } from "./components/landing-parallax-backdrop";
import { SectionReveal } from "./components/section-reveal";
import { MotionStagger, MotionStaggerItem } from "./components/stagger-reveal";

const brandMark = "/design/CodeTrailMainIcon.png";

const proofMetrics = [
  {
    value: "20",
    label: "trilhas em TI",
    detail: "Catálogo amplo para stacks reais de desenvolvimento e tecnologia.",
  },
  {
    value: "1",
    label: "conta unificada",
    detail: "Login, billing, progresso e continuidade no mesmo ecossistema.",
  },
  {
    value: "Web + Windows",
    label: "mesma operação",
    detail: "Sem quebrar a rotina entre ambientes ou abrir vários fluxos paralelos.",
  },
];

const developerSignals = ["Front-end", "Back-end", "Data", "QA"];

const painPoints = [
  {
    title: "Ferramentas espalhadas",
    copy: "Cursos, roadmap, tarefas e resumos ficam fragmentados em várias abas e apps.",
  },
  {
    title: "Rotina sem próximo passo",
    copy: "Você senta para estudar e ainda precisa decidir o que fazer antes de começar.",
  },
  {
    title: "Aprendizado sem retenção",
    copy: "Sem revisões e histórico confiável, o conteúdo evapora rápido demais.",
  },
];

const featureHighlights = [
  {
    icon: Layers3,
    title: "Trilhas acionáveis",
    copy: "Estruture áreas, skills e módulos com contexto claro para cada ciclo de estudo.",
  },
  {
    icon: Activity,
    title: "Sessões com histórico",
    copy: "Registre foco, produtividade e evolução real sem depender de planilha paralela.",
  },
  {
    icon: FolderKanban,
    title: "Projetos e tarefas",
    copy: "Conecte teoria com execução prática e acompanhe entregas de verdade.",
  },
  {
    icon: Sparkles,
    title: "Retenção e analytics",
    copy: "Use revisões, flashcards e leitura de progresso para manter consistência.",
  },
];

const plans = [
  {
    code: "free" as const,
    name: "Free",
    price: "R$ 0",
    cadence: "/mês",
    summary: "Para sair do improviso e organizar a rotina com uma base sólida no ecossistema.",
    eyebrow: "Entrada",
    features: [
      "Workspace web com acesso inicial",
      "Trilhas, sessões e tarefas essenciais",
      "Base para tirar o estudo do caos",
    ],
  },
  {
    code: "pro" as const,
    name: "Pro",
    price: "R$ 25",
    cadence: "/mês",
    summary: "Plano principal para quem quer produtividade premium, retenção e visão operacional completa.",
    eyebrow: "Mais escolhido",
    featured: true,
    features: [
      "Análises, flashcards e revisões avançadas",
      "Projetos ilimitados e visão operacional completa",
      "Checkout interno ligado à mesma conta do sistema",
    ],
  },
  {
    code: "founding" as const,
    name: "Founding",
    price: "R$ 270",
    cadence: "/ano",
    summary: "Plano anual premium para quem quer acompanhar a evolução do produto com acesso completo e proximidade maior.",
    eyebrow: "Anual premium",
    premium: true,
    features: [
      "Tudo do Pro em um ciclo anual",
      "Melhor custo para uso contínuo no ano",
      "Contato mais próximo para feedback e betas",
    ],
  },
];

const faqItems = [
  {
    question: "O CodeTrail é só para organizar tarefas?",
    answer:
      "Não. Ele unifica trilhas, sessões, revisões, notas, projetos e cobrança em um único workspace de estudos.",
  },
  {
    question: "Posso começar grátis e fazer upgrade depois?",
    answer:
      "Sim. Você pode entrar no Free agora e subir para Pro mensal ou Founding anual quando quiser.",
  },
  {
    question: "A versão web e a versão Windows usam a mesma conta?",
    answer:
      "Sim. O backend, a autenticação e o billing são compartilhados entre as versões.",
  },
  {
    question: "A assinatura continua dentro do produto?",
    answer:
      "Sim. O fluxo premium está integrado ao sistema e mantém a conta conectada do início ao checkout.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background pb-24 font-ui text-text-primary selection:bg-primary/20 selection:text-primary">
      <LandingMotion />
      <LandingParallaxBackdrop />

      <LandingNav />

      <main className="landing-main relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-24 px-4 pt-14 sm:px-6 sm:pt-16 lg:gap-28 lg:px-8 lg:pt-20">
        <LandingHero proofMetrics={proofMetrics} developerSignals={developerSignals} />

        <SectionReveal id="produto" className="flex flex-col gap-10 sm:gap-12">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <Target size={14} />
              Diagnóstico
            </span>
            <h2 className="max-w-3xl text-3xl font-display tracking-tight text-white sm:text-4xl md:text-5xl">
              Estudar em um ecossistema quebrado destrói a continuidade da sua performance.
            </h2>
            <div className="cyber-line-x h-px w-full max-w-sm bg-gradient-to-r from-primary via-primary/30 to-transparent" />
          </div>

          <MotionStagger className="grid gap-5 md:grid-cols-3">
            {painPoints.map((item, index) => (
              <MotionStaggerItem key={item.title} className="min-w-0">
                <DepthCard>
                  <article className="landing-surface landing-depth-surface relative flex h-full min-h-[280px] flex-col gap-5 px-6 py-6 sm:px-7 sm:py-7">
                    <div className="absolute left-0 top-0 h-full w-1.5 rounded-r-full bg-gradient-to-b from-primary/90 via-primary/35 to-transparent" />
                    <span className="text-3xl font-display font-light text-primary/28">0{index + 1}</span>
                    <div className="flex flex-col gap-3">
                      <h3 className="m-0 text-xl font-display text-white">{item.title}</h3>
                      <p className="m-0 text-sm font-light leading-relaxed text-text-secondary">{item.copy}</p>
                    </div>
                  </article>
                </DepthCard>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </SectionReveal>

        <SectionReveal className="flex flex-col gap-10 sm:gap-12">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              <Sparkles size={14} />
              Arquitetura da solução
            </span>
            <h2 className="max-w-3xl text-3xl font-display tracking-tight text-white sm:text-4xl md:text-5xl">
              Um produto com disciplina visual e lógica de sistema, não cara de planilha improvisada.
            </h2>
          </div>

          <MotionStagger className="grid gap-5 md:grid-cols-2">
            {featureHighlights.map(({ icon: Icon, title, copy }) => (
              <MotionStaggerItem key={title} className="min-w-0">
                <DepthCard>
                  <article className="landing-surface landing-depth-surface landing-feature-card flex h-full items-start gap-4 sm:gap-5 px-6 py-6 sm:px-7 sm:py-7">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-white/[0.03] text-primary">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <h3 className="m-0 text-xl font-display text-white">{title}</h3>
                      <p className="m-0 text-sm font-light leading-relaxed text-text-secondary">{copy}</p>
                    </div>
                  </article>
                </DepthCard>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </SectionReveal>

        <SectionReveal id="planos" className="relative flex flex-col gap-10 sm:gap-12">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[120px]" />

          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <ShieldCheck size={14} />
              Planos
            </span>
            <h2 className="max-w-3xl text-3xl font-display tracking-tight text-white sm:text-4xl md:text-5xl">
              Planos claros, hierarquia forte e checkout conectado ao produto.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              O Free organiza a base, o Pro é o centro da experiência premium e o Founding anual oferece a versão mais
              completa para quem quer permanecer próximo da evolução do produto.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {plans.map((plan) => {
              const cardClass = plan.featured
                ? "landing-surface landing-depth-surface border-primary/35 shadow-[0_24px_60px_rgba(50,208,255,0.12)] lg:-translate-y-4"
                : plan.premium
                  ? "landing-surface landing-depth-surface border-accent/28 bg-[linear-gradient(180deg,rgba(159,232,112,0.05),rgba(255,255,255,0.01)),rgba(14,24,33,0.94)]"
                  : "landing-surface landing-depth-surface";

              const ctaClass = plan.featured
                ? "landing-button landing-button--primary w-full mt-auto text-sm"
                : plan.premium
                  ? "landing-button w-full mt-auto border border-accent/30 bg-accent/10 text-accent text-sm hover:bg-accent/16 hover:border-accent/44"
                  : "landing-button landing-button--secondary w-full mt-auto text-sm";

              return (
                <DepthCard key={plan.code} className="min-w-0">
                  <article className={`${cardClass} relative flex h-full flex-col gap-7 px-6 py-6 sm:px-7 sm:py-7`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                            plan.featured
                              ? "border-primary/25 bg-primary/10 text-primary"
                              : plan.premium
                                ? "border-accent/25 bg-accent/10 text-accent"
                                : "border-border/70 bg-white/[0.03] text-text-secondary"
                          }`}
                        >
                          {plan.eyebrow}
                        </span>
                        <h3 className="m-0 text-2xl font-display text-white">{plan.name}</h3>
                      </div>

                      {plan.featured ? (
                        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                          Mais escolhido
                        </span>
                      ) : null}

                      {plan.premium ? (
                        <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                          Premium anual
                        </span>
                      ) : null}
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-white/[0.03] px-5 py-5 sm:px-6">
                      <div className="flex items-end gap-2">
                        <strong className="font-display text-4xl text-white">{plan.price}</strong>
                        <span className="pb-1 text-sm text-text-secondary">{plan.cadence}</span>
                      </div>
                      <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-text-secondary">{plan.summary}</p>
                    </div>

                    <ul className="flex flex-1 flex-col gap-3.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              plan.premium
                                ? "border-accent/20 bg-accent/10 text-accent"
                                : "border-success/20 bg-success/10 text-success"
                            }`}
                          >
                            <Check size={14} />
                          </span>
                          <span className="text-sm leading-snug text-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <AuthTrigger plan={plan.code} className={ctaClass}>
                      {plan.code === "free" ? "Começar grátis" : plan.code === "pro" ? "Assinar Pro" : "Assinar Founding"}
                    </AuthTrigger>
                  </article>
                </DepthCard>
              );
            })}
          </div>
        </SectionReveal>

        <SectionReveal id="faq" className="flex flex-col gap-10 sm:gap-12">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <Globe size={14} />
              FAQ
            </span>
            <h2 className="text-3xl font-display tracking-tight text-white">O essencial, rápido e direto.</h2>
            <div className="cyber-line-x h-px w-full max-w-sm bg-gradient-to-r from-primary via-primary/30 to-transparent" />
          </div>

          <MotionStagger className="grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <MotionStaggerItem key={item.question} className="min-w-0">
                <article className="landing-surface flex h-full flex-col gap-3.5 px-6 py-6 sm:px-7">
                  <h3 className="m-0 text-lg font-display tracking-tight text-white">{item.question}</h3>
                  <p className="m-0 text-sm leading-relaxed text-text-secondary">{item.answer}</p>
                </article>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </SectionReveal>

        <SectionReveal as="div" className="block" delay={0.06}>
          <DepthCard>
            <div className="landing-surface landing-final-cta flex flex-col items-start justify-between gap-6 px-6 py-8 sm:px-7 md:flex-row md:items-center md:px-10 md:py-10">
              <div className="flex max-w-2xl flex-col gap-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Pronto para começar
                </span>
                <h2 className="m-0 text-2xl font-display tracking-tight text-white md:text-3xl">
                  Especifique a meta, centralize a rotina e execute no ambiente CodeTrail.
                </h2>
                <p className="m-0 text-sm leading-relaxed text-text-secondary md:text-base">
                  Comece no Free para estruturar a base, avance para o Pro mensal ou para o Founding anual quando quiser
                  operar com a versão premium completa.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                <AuthTrigger target="workspace" className="landing-button landing-button--primary w-full px-7 py-4 text-sm sm:w-auto">
                  Abrir Web
                  <ArrowRight size={16} />
                </AuthTrigger>
                <AuthTrigger target="download" className="landing-button landing-button--secondary w-full px-7 py-4 text-sm sm:w-auto">
                  <Download size={16} />
                  Windows
                </AuthTrigger>
              </div>
            </div>
          </DepthCard>
        </SectionReveal>

        <footer className="flex flex-col items-center justify-between gap-5 border-t border-border/50 pb-12 pt-8 md:flex-row">
          <a href="#top" className="flex items-center gap-3 text-white decoration-transparent">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
              <Image src={brandMark} alt="CodeTrail Logo" width={28} height={28} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <strong className="text-sm font-display tracking-tight leading-none text-text-secondary">CodeTrail</strong>
              <span className="mt-1 text-[8px] uppercase tracking-[0.22em] text-text-secondary/60">Web + Windows</span>
            </div>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <a href="#produto" className="inline-flex min-h-[44px] items-center px-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-white">
              Produto
            </a>
            <a href="#planos" className="inline-flex min-h-[44px] items-center px-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-white">
              Planos
            </a>
            <a href="#faq" className="inline-flex min-h-[44px] items-center px-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-white">
              FAQ
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
