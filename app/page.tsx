import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Download,
  FolderKanban,
  Laptop,
  Layers3,
  LayoutDashboard,
  MonitorUp,
  MoveRight,
  ShieldCheck,
  Sparkles,
  TabletSmartphone,
  Target,
  TimerReset,
  Workflow,
} from "lucide-react";

import { HeroSmokeScene } from "./components/hero-smoke-scene";
import { LandingMotion } from "./components/landing-motion";

const mobileRepositoryUrl =
  "https://github.com/GabrielContesini/CodeTrail";
const windowsDownloadUrl = "/download/windows";

type Metric = {
  value: string;
  label: string;
  detail: string;
};

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type RoadmapItem = {
  version: string;
  title: string;
  status: string;
  description: string;
  bullets: string[];
};

const metrics: Metric[] = [
  {
    value: "2 plataformas",
    label: "Windows pronto",
    detail: "Desktop e tablet Android orbitando a mesma visao de produto.",
  },
  {
    value: "7 trilhas",
    label: "Carreiras de TI",
    detail: "Data, backend, frontend, full stack, DevOps e analytics em uma base unica.",
  },
  {
    value: "Offline-first",
    label: "Uso continuo",
    detail: "A rotina continua fluindo mesmo quando seu contexto muda entre mesa, casa e estudo em movimento.",
  },
  {
    value: "v1.1 entregue",
    label: "Roadmap vivo",
    detail: "Evolucao de produto declarada em ciclos, nao em promessas vagas.",
  },
];

const features: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Painel de estudo com clareza",
    description:
      "Resumo do dia, progresso da trilha, proximas sessoes e tarefas em uma visao limpa e acionavel.",
  },
  {
    icon: TimerReset,
    title: "Sessoes cronometradas de verdade",
    description:
      "Teoria, pratica, revisao, projeto e exercicios com historico, produtividade e rastreio consistente.",
  },
  {
    icon: BrainCircuit,
    title: "Revisoes contra o esquecimento",
    description:
      "Ciclos D+1, D+7, D+15 e D+30 para transformar conteudo em memoria util e retomada facil.",
  },
  {
    icon: FolderKanban,
    title: "Projetos praticos integrados",
    description:
      "Escopo, etapas, progresso e links de GitHub conectados a rotina real de estudo.",
  },
  {
    icon: Workflow,
    title: "Trilhas por carreira",
    description:
      "Roadmaps iniciais para Data Engineer, Backend, Front-end React, Full Stack, DevOps e BI.",
  },
  {
    icon: ShieldCheck,
    title: "Offline-first sem drama",
    description:
      "Continue estudando com fluidez, sem perder a linha de raciocinio quando a conexao oscilar.",
  },
];

const roadmap: RoadmapItem[] = [
  {
    version: "v1.1",
    title: "Confiabilidade operacional",
    status: "Entregue",
    description:
      "A base saiu do estagio de prototipo e virou sistema usavel em rotina real.",
    bullets: [
      "Diagnostico de sincronizacao",
      "Retry manual e automatico",
      "CRUD principal testado",
    ],
  },
  {
    version: "v1.2",
    title: "Notas e produtividade",
    status: "Proxima",
    description:
      "A proxima camada reforca captura de conhecimento, quick actions e metas mais inteligentes.",
    bullets: [
      "Notas mais fortes",
      "Importacao manual de arquivos",
      "Templates e quick actions",
    ],
  },
  {
    version: "v1.3",
    title: "Qualidade de producao",
    status: "Em preparacao",
    description:
      "Refino de erros, conflitos de sincronizacao, estados de loading e performance.",
    bullets: [
      "Logs estruturados",
      "Estados vazios melhores",
      "Performance em listas e analytics",
    ],
  },
  {
    version: "v2.0",
    title: "Distribuicao madura",
    status: "Visao",
    description:
      "Mais polimento de entrega, changelog melhor e base pronta para integracoes futuras.",
    bullets: [
      "Distribuicao Android assinada",
      "Pipeline e changelog mais solidos",
      "Base para colaboracao futura",
    ],
  },
];

const platformPillars = [
  {
    id: "windows",
    icon: MonitorUp,
    title: "Windows para uso diario",
    description:
      "Baixe o instalador, organize projetos, acompanhe trilhas e receba atualizacoes pelo fluxo de release.",
    ctaLabel: "Baixar versao Windows",
    href: windowsDownloadUrl,
    note: "Instalador pronto, com foco em produtividade de desktop.",
  },
  {
    id: "mobile",
    icon: TabletSmartphone,
    title: "Mobile para estudar em movimento",
    description:
      "A versao Android foi pensada para tablet, landscape e consulta constante no fluxo de estudo.",
    ctaLabel: "Conhecer versao mobile",
    href: mobileRepositoryUrl,
    note: "Fluxo mobile-first para planejar, revisar e acompanhar progresso.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Escolha sua trilha",
    description:
      "Comece por um caminho concreto e troque ambicao vaga por direcao mensuravel.",
  },
  {
    step: "02",
    title: "Execute com foco",
    description:
      "Rode sessoes, conclua modulos e distribua sua energia entre teoria, pratica e projeto.",
  },
  {
    step: "03",
    title: "Evolua com evidencia",
    description:
      "Veja revisoes, analytics, projetos e consistencia para entender se voce esta avancando de verdade.",
  },
];

const faq = [
  {
    question: "O CodeTrail ja esta pronto para uso?",
    answer:
      "Sim. A versao Windows esta pronta para instalacao e a versao mobile continua evoluindo com foco em tablet Android.",
  },
  {
    question: "Funciona offline?",
    answer:
      "Sim. O produto foi desenhado para manter sua rotina estavel, inclusive quando a conexao nao estiver perfeita.",
  },
  {
    question: "Para quem ele foi pensado?",
    answer:
      "Para quem estuda tecnologia com seriedade e quer parar de viver entre notas soltas, timers aleatorios e checklists desconectadas.",
  },
];

function SectionLabel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#7cffb2]">
      <Sparkles className="size-3.5" />
      {children}
    </span>
  );
}

function FeatureCard({ icon: Icon, title, description }: Readonly<Feature>) {
  return (
    <article className="glass-panel rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-5 inline-flex rounded-2xl border border-white/10 bg-white/[0.08] p-3 text-[#5ea1ff]">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#9fb0c3]">{description}</p>
    </article>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <LandingMotion />
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <header
          className="glass-panel glow-ring sticky top-4 z-30 rounded-[28px] px-5 py-4 sm:px-6"
          data-reveal
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-[52px] items-center justify-center rounded-2xl border border-white/10 bg-[#0f1d33]">
                <Image
                  src="/design/logo.png"
                  alt="CodeTrail"
                  width={34}
                  height={34}
                  priority
                />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  CodeTrail
                </p>
                <p className="text-sm text-[#9fb0c3]">
                  Study OS para carreiras em tecnologia
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-[#b8c5d4]">
              <a
                className="rounded-full px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
                href="#produto"
              >
                Produto
              </a>
              <a
                className="rounded-full px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
                href="#plataformas"
              >
                Plataformas
              </a>
              <a
                className="rounded-full px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
                href="#roadmap"
              >
                Roadmap
              </a>
              <a
                className="rounded-full px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
                href="#download"
              >
                Download
              </a>
            </nav>
          </div>
        </header>

        <section
          className="relative grid gap-8 pb-20 pt-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-end lg:pt-16"
          data-reveal
        >
          <div className="relative" data-parallax>
            <div className="absolute -left-4 top-[4.5rem] h-24 w-24 rounded-full bg-[#5ea1ff]/18 blur-3xl" />
            <div className="absolute left-[8.5rem] top-[12.5rem] h-20 w-20 rounded-full bg-[#7cffb2]/14 blur-3xl" />
            <SectionLabel>Windows disponivel agora · Mobile em expansao</SectionLabel>
            <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl xl:text-[5.8rem]">
              O lugar onde sua rotina de estudos em TI finalmente faz sentido.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#b6c5d4] sm:text-xl">
              Planeje trilhas, rode sessoes, acompanhe revisoes, execute projetos
              praticos e veja seu progresso sem se perder em dezenas de apps.
              CodeTrail foi desenhado para quem quer evolucao real, nao so
              intencao.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#5ea1ff]/35 bg-[linear-gradient(135deg,rgba(94,161,255,0.28),rgba(17,31,51,0.96))] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(8,16,28,0.35)] transition hover:-translate-y-0.5 hover:border-[#7bb5ff]/55 hover:bg-[linear-gradient(135deg,rgba(94,161,255,0.38),rgba(20,36,58,1))]"
                href={windowsDownloadUrl}
              >
                <Download className="size-4.5" />
                Baixar versao Windows
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2a3b54] bg-[#0c1727] px-6 py-3.5 text-sm font-semibold text-[#d9e7f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:border-[#3f5678] hover:bg-[#122035] hover:text-white"
                href="#roadmap"
              >
                Ver roadmap do produto
                <ArrowRight className="size-4.5" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#8ea3bc]">
              <span className="rounded-full border border-white/10 px-3 py-2">
                Offline-first
              </span>
              <span className="rounded-full border border-white/10 px-3 py-2">
                Windows Installer
              </span>
              <span className="rounded-full border border-white/10 px-3 py-2">
                Android tablet
              </span>
            </div>
          </div>

          <div className="relative" data-parallax>
            <HeroSmokeScene />
            <div className="hero-orbit absolute -left-3 top-[4.5rem] hidden rounded-3xl border border-[#7cffb2]/20 bg-[#0e1b2d]/88 px-4 py-3 text-sm text-[#d3f9e5] shadow-[0_24px_60px_rgba(0,0,0,0.34)] lg:block">
              Revisoes D+1, D+7, D+15 e D+30
            </div>
            <div className="hero-orbit-delayed absolute right-0 top-0 hidden rounded-3xl border border-[#5ea1ff]/20 bg-[#0d1a2a]/90 px-4 py-3 text-sm text-[#d8e7ff] shadow-[0_24px_60px_rgba(0,0,0,0.34)] lg:block">
              Planejamento, pratica e revisao no mesmo fluxo
            </div>
            <div className="glass-panel glow-ring scan-line relative overflow-hidden rounded-[36px] p-5 sm:p-6">
              <div className="hero-video-badge absolute right-5 top-5 z-10 hidden w-[168px] overflow-hidden rounded-[28px] border border-white/12 bg-[#051319]/78 p-2 shadow-[0_28px_70px_rgba(0,0,0,0.38)] lg:block">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-[210px] w-full rounded-[20px] object-cover"
                  src="/design/logo-animated.mp4"
                />
                <div className="mt-3 flex items-center gap-3 rounded-[18px] bg-white/[0.04] px-3 py-2">
                  <Image
                    src="/design/logo.png"
                    alt="CodeTrail orb"
                    width={34}
                    height={34}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7cffb2]">
                      Signal loop
                    </p>
                    <p className="text-sm text-white">Study OS em movimento</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-white/8 bg-[#08111d]/86 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-[#7cffb2]">
                        Painel tatico
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                        Seu estudo deixa de ser solto e vira sistema.
                      </h2>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-[#ffd166]">
                      <Target className="size-6" />
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 text-sm text-[#dce6f2] sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/8 bg-white/6 p-4">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#91a7c0]">
                        Hoje
                      </p>
                      <p className="mt-3 text-3xl font-semibold">2h 40m</p>
                      <p className="mt-2 text-[#9fb0c3]">
                        Sessao pratica de backend e revisao de SQL agendadas.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/8 bg-white/6 p-4">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#91a7c0]">
                        Streak
                      </p>
                      <p className="mt-3 text-3xl font-semibold">16 dias</p>
                      <p className="mt-2 text-[#9fb0c3]">
                        Consistencia sustentada sem depender de motivacao aleatoria.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/8 bg-[#0b1625]/88 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#91a7c0]">
                      Trilha ativa
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold text-white">
                      Backend Python
                    </p>
                    <div className="mt-5 h-2 rounded-full bg-white/[0.08]">
                      <div className="h-2 w-[68%] rounded-full bg-gradient-to-r from-[#5ea1ff] to-[#7cffb2]" />
                    </div>
                    <p className="mt-3 text-sm text-[#9fb0c3]">
                      68% do plano concluido, com modulo pratico em andamento.
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-white/8 bg-[#0b1625]/88 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#91a7c0]">
                      Projeto em foco
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold text-white">
                      API de portfolio
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-[#c0cfdd]">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-[#7cffb2]" />
                        Modelagem e auth concluidos
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock3 className="size-4 text-[#ffd166]" />
                        Deploy e observabilidade em execucao
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-reveal>
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="glass-panel rounded-[28px] p-5"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-[#91a7c0]">
                {metric.label}
              </p>
              <p className="mt-4 font-display text-3xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#9fb0c3]">
                {metric.detail}
              </p>
            </article>
          ))}
        </section>

        <section id="produto" className="pt-24" data-reveal>
          <div className="max-w-3xl">
            <SectionLabel>Produto</SectionLabel>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Um sistema para estudar tecnologia com ritmo, clareza e execucao.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#a9bacd]">
              CodeTrail une o que normalmente fica espalhado entre agenda,
              notas, cronometro, checklist e repositorios. O resultado e uma
              rotina mais limpa, mensuravel e dificil de abandonar.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="pt-24" data-reveal>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="glass-panel rounded-[32px] p-6 lg:p-8">
              <SectionLabel>Fluxo de uso</SectionLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                Da meta ate a evidencia de evolucao.
              </h2>
              <div className="mt-8 space-y-5">
                {workflowSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-[28px] border border-white/8 bg-white/5 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5f7fa] text-sm font-bold text-[#07111f]">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[#9fb0c3]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[32px] p-6 lg:p-8">
              <SectionLabel>Por que chama atencao</SectionLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                Porque ele organiza a ambicao em movimento diario.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Target,
                    title: "Meta principal visivel",
                    text: "Nada de estudar no escuro: objetivo, prazo e foco principal aparecem logo no fluxo.",
                  },
                  {
                    icon: Laptop,
                    title: "Windows pronto para usar",
                    text: "Instale, abra e acompanhe a evolucao da sua rotina sem depender de configuracao complexa.",
                  },
                  {
                    icon: TabletSmartphone,
                    title: "Mobile pensado para tablet",
                    text: "Landscape, leitura confortavel e navegacao feita para estudo continuo em Android.",
                  },
                  {
                    icon: Layers3,
                    title: "Roadmap que continua vivo",
                    text: "O produto nao para na landing: as proximas fases ja estao declaradas e visiveis.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-[28px] border border-white/8 bg-[#09131f]/88 p-5"
                  >
                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-[#7cffb2]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-white">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#9fb0c3]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="plataformas" className="pt-24" data-reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>Plataformas</SectionLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                Um produto, dois contextos: mesa de trabalho e estudo em movimento.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#9fb0c3]">
              A versao Windows esta pronta para distribuicao. A versao mobile
              continua sendo a face mais focada em tablet Android, com o mesmo
              DNA de produtividade e clareza.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {platformPillars.map((platform) => {
              const Icon = platform.icon;
              return (
                <article
                  id={platform.id}
                  key={platform.id}
                  className="glass-panel rounded-[32px] p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/6 p-3 text-[#5ea1ff]">
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-[#91a7c0]">
                      {platform.id === "windows" ? "Disponivel" : "Em destaque"}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-semibold text-white">
                    {platform.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-[#a9bacd]">
                    {platform.description}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#7cffb2]">
                    {platform.note}
                  </p>
                  <a
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    href={
                      platform.id === "windows"
                        ? windowsDownloadUrl
                        : platform.href
                    }
                    target={platform.id === "windows" ? undefined : "_blank"}
                    rel={platform.id === "windows" ? undefined : "noreferrer"}
                  >
                    {platform.ctaLabel}
                    <MoveRight className="size-4.5" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section id="roadmap" className="pt-24" data-reveal>
          <div className="max-w-3xl">
            <SectionLabel>Roadmap</SectionLabel>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              O produto nao promete em abstrato. Ele mostra para onde esta indo.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#a9bacd]">
              Cada release foi pensada para aumentar confiabilidade, profundidade
              do estudo e maturidade de distribuicao sem sacrificar clareza.
            </p>
          </div>
          <div className="mt-12 grid gap-6 xl:grid-cols-4">
            {roadmap.map((item) => (
              <article
                key={item.version}
                className="glass-panel relative rounded-[32px] p-6"
              >
                <div className="timeline-beam absolute left-6 top-0 h-full w-px opacity-70 xl:hidden" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[#7cffb2]">
                    {item.version}
                    <span className="text-[#d9e8f7]">{item.status}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#9fb0c3]">
                    {item.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#d7e4f0]">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#7cffb2]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="download" className="pt-24" data-reveal>
          <div className="glass-panel glow-ring rounded-[36px] px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionLabel>Download</SectionLabel>
                <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  Instale no Windows agora e acompanhe a evolucao do produto desde o inicio.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#a9bacd]">
                  Se voce quer uma central de estudos para TI que trate carreira,
                  execucao e progresso como um sistema unico, o melhor momento
                  para entrar e agora.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7cffb2]/35 bg-[linear-gradient(135deg,rgba(124,255,178,0.92),rgba(70,186,135,0.92))] px-6 py-3.5 text-sm font-semibold text-[#04111d] shadow-[0_18px_45px_rgba(8,16,28,0.35)] transition hover:-translate-y-0.5 hover:border-[#b7ffd6] hover:bg-[linear-gradient(135deg,rgba(145,255,192,0.96),rgba(86,210,153,0.96))]"
                    href={windowsDownloadUrl}
                  >
                    <Download className="size-4.5" />
                    Abrir download Windows
                  </a>
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                    href={mobileRepositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Acompanhar versao mobile
                    <ArrowRight className="size-4.5" />
                  </a>
                </div>
              </div>
              <div className="grid gap-4">
                {faq.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-[28px] border border-white/10 bg-[#09131f]/88 p-5"
                  >
                    <h3 className="font-display text-xl font-semibold text-white">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#9fb0c3]">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 px-1 pb-4 pt-14 text-sm text-[#91a7c0] sm:flex-row sm:items-center sm:justify-between">
          <p>
            CodeTrail combina trilhas, sessoes, revisoes, projetos e analytics
            para transformar estudo em progresso visivel.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              className="transition hover:text-white"
              href={windowsDownloadUrl}
            >
              Windows
            </a>
            <a
              className="transition hover:text-white"
              href={mobileRepositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              Mobile
            </a>
            <a className="transition hover:text-white" href="#roadmap">
              Roadmap
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
