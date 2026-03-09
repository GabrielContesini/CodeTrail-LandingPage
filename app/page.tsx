import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Download,
  FolderGit2,
  LayoutDashboard,
  MonitorCog,
  MoveRight,
  Orbit,
  Radar,
  ShieldCheck,
  Sparkles,
  TabletSmartphone,
  TimerReset,
  TrendingUp,
} from "lucide-react";

import { HeroSmokeScene } from "./components/hero-smoke-scene";
import { LandingMotion } from "./components/landing-motion";

const mobileRepositoryUrl = "https://github.com/GabrielContesini/CodeTrail";
const windowsDownloadUrl = "/download/windows";
const brandMark = "/design/CodeTrailMainIconTransparent.png";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type PlatformCard = {
  icon: LucideIcon;
  title: string;
  summary: string;
  note: string;
  href: string;
  cta: string;
  external?: boolean;
};

type RoadmapItem = {
  version: string;
  title: string;
  phase: string;
  description: string;
  bullets: string[];
};

const heroStats = [
  {
    label: "Semana atual",
    value: "12h",
    detail: "Sessoes, projetos e revisoes no mesmo ritmo operacional.",
  },
  {
    label: "Ritmo",
    value: "16 dias",
    detail: "Consistencia visivel sem depender de memoria ou improviso.",
  },
  {
    label: "Trilha",
    value: "68%",
    detail: "Roadmap, skills e proximos passos vivos dentro do workspace.",
  },
];

const productFeatures: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Workspace de estudo centralizado",
    description:
      "Trilhas, sessoes, tarefas, revisoes, projetos e analytics organizados como um sistema unico.",
  },
  {
    icon: TimerReset,
    title: "Execucao com foco real",
    description:
      "Cronometro, templates, produtividade e retomada rapida para transformar intencao em estudo executado.",
  },
  {
    icon: BookOpenText,
    title: "Notas com contexto",
    description:
      "Cadernos, paginas e resumos ligados ao que voce estuda, sem virar arquivo morto de texto solto.",
  },
  {
    icon: FolderGit2,
    title: "Projetos praticos na rotina",
    description:
      "Escopo, etapas, progresso e GitHub conectados ao caminho da carreira e nao isolados em outra ferramenta.",
  },
  {
    icon: ShieldCheck,
    title: "Offline-first e confiavel",
    description:
      "A rotina continua funcionando mesmo quando a conexao falha, sem te arrancar do estado de foco.",
  },
  {
    icon: TrendingUp,
    title: "Evolucao visivel",
    description:
      "Voce enxerga consistencia, carga semanal e progresso por skill sem depender de feeling.",
  },
];

const platformCards: PlatformCard[] = [
  {
    icon: MonitorCog,
    title: "Windows para escritorio de estudo",
    summary:
      "Instale o workspace de desktop, organize cadernos, acompanhe trilhas e receba atualizacoes por release.",
    note: "Ja pronto para distribuicao e uso diario.",
    href: windowsDownloadUrl,
    cta: "Baixar versao Windows",
  },
  {
    icon: TabletSmartphone,
    title: "Mobile para tablet Android",
    summary:
      "Uma versao pensada para consulta constante, revisao e acompanhamento do plano em movimento.",
    note: "Feita para tablet, com leitura ampla e fluxo de estudo continuo.",
    href: mobileRepositoryUrl,
    cta: "Conhecer versao mobile",
    external: true,
  },
];

const roadmap: RoadmapItem[] = [
  {
    version: "v1.1",
    title: "Base operacional entregue",
    phase: "Concluida",
    description:
      "O sistema saiu da fase de prototipo e passou a operar com consistencia entre produto, distribuicao e observabilidade.",
    bullets: [
      "Desktop Windows instalavel",
      "Command Center operacional",
      "Fluxo offline-first estavel",
    ],
  },
  {
    version: "v1.2",
    title: "Produtividade e profundidade",
    phase: "Em evolucao",
    description:
      "Mais densidade no fluxo de estudo: notas melhores, metas vivas, templates e automacoes de rotina.",
    bullets: [
      "Notas em formato de caderno",
      "Metas semanais ajustaveis",
      "Templates persistidos de sessao",
    ],
  },
  {
    version: "v1.3",
    title: "Experiencia mais refinada",
    phase: "Planejada",
    description:
      "Camada de polimento visual, consistencia operacional e leitura ainda mais clara do progresso.",
    bullets: [
      "Analytics mais fortes",
      "Erros e estados mais elegantes",
      "Mais fluidez na navegacao",
    ],
  },
  {
    version: "v2.0",
    title: "Produto maduro para crescimento",
    phase: "Visao",
    description:
      "Distribuicao mais forte, evolucao guiada por usuarios reais e base pronta para proximas integracoes.",
    bullets: [
      "Roadmap expandido",
      "Mais automacao operacional",
      "Evolucao guiada por uso real",
    ],
  },
];

const faq = [
  {
    question: "O CodeTrail ja pode ser usado agora?",
    answer:
      "Sim. A versao Windows ja esta pronta para instalacao e a versao mobile segue evoluindo com o mesmo DNA do produto.",
  },
  {
    question: "Ele foi feito para quem?",
    answer:
      "Para quem estuda tecnologia com seriedade e quer uma rotina clara, mensuravel e dificil de abandonar.",
  },
  {
    question: "Como acompanho a evolucao do produto?",
    answer:
      "Pela propria landing, pelas releases e pelo roadmap vivo que organiza as proximas fases do sistema.",
  },
];

function SectionKicker({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <span className="section-kicker">
      <Sparkles className="size-3.5" />
      {children}
    </span>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: Readonly<Feature>) {
  return (
    <article className="feature-card" data-float>
      <div className="feature-icon">
        <Icon className="size-5" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function RoadmapCard({
  version,
  title,
  phase,
  description,
  bullets,
}: Readonly<RoadmapItem>) {
  return (
    <article className="roadmap-card" data-float>
      <div className="roadmap-topline">
        <span>{version}</span>
        <strong>{phase}</strong>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>
            <CheckCircle2 className="size-4" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Home() {
  return (
    <main className="landing-root">
      <LandingMotion />
      <div className="page-curtain" data-page-curtain />

      <div className="landing-background" />

      <div className="landing-shell">
        <header className="landing-nav-shell glass-panel" data-intro="nav">
          <div className="landing-brand">
            <div className="landing-brand-mark">
              <Image
                src={brandMark}
                alt="CodeTrail"
                width={42}
                height={42}
                priority
              />
            </div>
            <div>
              <p className="landing-brand-title">CodeTrail</p>
              <p className="landing-brand-subtitle">
                Study OS para carreiras em tecnologia
              </p>
            </div>
          </div>

          <nav className="landing-nav">
            <a href="#produto" data-section-link>
              Produto
            </a>
            <a href="#plataformas" data-section-link>
              Plataformas
            </a>
            <a href="#roadmap" data-section-link>
              Roadmap
            </a>
            <a href="#download" data-section-link>
              Download
            </a>
          </nav>
        </header>

        <section className="hero-shell" data-section>
          <div className="hero-copy" data-intro="hero-copy">
            <SectionKicker>
              Windows disponivel agora · mobile para tablet
            </SectionKicker>

            <h1>
              O lugar onde sua rotina de estudos em TI finalmente faz sentido.
            </h1>

            <p>
              Planeje trilhas, rode sessoes, acompanhe revisoes, execute projetos
              praticos e veja seu progresso sem se perder em dezenas de apps.
              CodeTrail foi desenhado para quem quer evolucao real, nao so
              intencao.
            </p>

            <div className="hero-actions">
              <a className="cta-primary" href={windowsDownloadUrl}>
                <Download className="size-4.5" />
                Baixar versao Windows
              </a>
              <a className="cta-secondary" href="#roadmap" data-section-link>
                Ver roadmap do produto
                <ArrowRight className="size-4.5" />
              </a>
            </div>

            <div className="hero-tags">
              <span>Desktop workspace</span>
              <span>Android tablet</span>
              <span>Cadernos com contexto</span>
              <span>Roadmap vivo</span>
            </div>
          </div>

          <div className="hero-visual-shell glass-panel" data-intro="hero-scene">
            <HeroSmokeScene />

            <div className="hero-visual-stack">
              <article className="hero-showcase-card" data-float>
                <div className="hero-card-header">
                  <div>
                    <p className="hero-caption">Painel tatico</p>
                    <h2>Seu estudo deixa de ser solto e vira sistema.</h2>
                  </div>
                  <div className="hero-chip">
                    <Radar className="size-4" />
                    sinal ativo
                  </div>
                </div>

                <p className="hero-showcase-copy">
                  Um workspace unico para planejar trilhas, executar sessoes,
                  capturar notas, revisar o que importa e ler o progresso sem
                  perder tempo remontando a rotina.
                </p>

                <div className="hero-stat-grid">
                  {heroStats.map((item) => (
                    <article key={item.label} className="hero-stat-card" data-stat-item>
                      <p>{item.label}</p>
                      <strong>{item.value}</strong>
                      <span>{item.detail}</span>
                    </article>
                  ))}
                </div>
              </article>

              <div className="hero-showcase-footer">
                <article className="hero-mini-panel" data-float>
                  <p className="hero-caption">Signal loop</p>
                  <div className="hero-mini-mark">
                    <Image
                      src={brandMark}
                      alt="CodeTrail signal"
                      width={108}
                      height={108}
                      priority
                    />
                  </div>
                  <span>
                    Uma central para organizar estudo, pratica e evidencia sem
                    virar uma colagem de apps.
                  </span>
                </article>

                <article className="hero-mini-panel" data-float>
                  <p className="hero-caption">Fluxo vivo</p>
                  <ul>
                    <li>
                      <Orbit className="size-4.5" />
                      trilhas, metas e modulos no mesmo mapa
                    </li>
                    <li>
                      <TimerReset className="size-4.5" />
                      sessoes, templates e revisoes sem atrito
                    </li>
                    <li>
                      <TrendingUp className="size-4.5" />
                      progresso e consistencia visiveis toda semana
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="story-strip" data-section>
          <article className="story-card" data-float>
            <p>01</p>
            <h3>Escolha a carreira</h3>
            <span>
              Pare de estudar sem mapa e entre em uma trilha com modulo, skill e
              progresso visivel.
            </span>
          </article>
          <article className="story-card" data-float>
            <p>02</p>
            <h3>Execute em ritmo</h3>
            <span>
              Sessoes, templates, revisoes e projetos praticos puxando a rotina
              para frente.
            </span>
          </article>
          <article className="story-card" data-float>
            <p>03</p>
            <h3>Leia a evolucao</h3>
            <span>
              Analytics, consistencia e backlog transformando estudo em feedback
              claro.
            </span>
          </article>
        </section>

        <section className="content-section" data-section id="produto">
          <div className="section-heading">
            <div>
              <SectionKicker>Produto</SectionKicker>
              <h2>Um workspace para quem quer estudar tecnologia como sistema.</h2>
            </div>
            <p>
              O produto foi desenhado para reduzir atrito entre intencao,
              execucao e revisao. Nao e um monte de utilitarios soltos; e uma
              rotina coerente.
            </p>
          </div>

          <div className="feature-grid">
            {productFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="content-section" data-section id="plataformas">
          <div className="section-heading">
            <div>
              <SectionKicker>Plataformas</SectionKicker>
              <h2>Do escritorio ao tablet, a mesma logica de produto.</h2>
            </div>
            <p>
              A versao Windows entrega profundidade de workspace. A versao mobile
              acompanha a rotina em tablet Android sem perder leitura, contexto
              nem continuidade.
            </p>
          </div>

          <div className="platform-grid">
            {platformCards.map((platform) => {
              const Icon = platform.icon;
              return (
                <article key={platform.title} className="platform-card" data-float>
                  <div className="platform-header">
                    <div className="feature-icon">
                      <Icon className="size-5" />
                    </div>
                    <span>{platform.external ? "Mobile" : "Windows"}</span>
                  </div>
                  <h3>{platform.title}</h3>
                  <p>{platform.summary}</p>
                  <small>{platform.note}</small>
                  <a
                    href={platform.href}
                    className="platform-cta"
                    target={platform.external ? "_blank" : undefined}
                    rel={platform.external ? "noreferrer" : undefined}
                  >
                    {platform.cta}
                    <MoveRight className="size-4.5" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="content-section" data-section id="roadmap">
          <div className="section-heading">
            <div>
              <SectionKicker>Roadmap</SectionKicker>
              <h2>O produto mostra para onde esta indo e por que cada fase existe.</h2>
            </div>
            <p>
              Cada entrega reforca confiabilidade, profundidade de uso e maturidade
              do ecossistema sem perder o foco no estudo real.
            </p>
          </div>

          <div className="roadmap-grid">
            {roadmap.map((item) => (
              <RoadmapCard key={item.version} {...item} />
            ))}
          </div>
        </section>

        <section className="download-shell glass-panel" data-section id="download">
          <div className="download-copy">
            <SectionKicker>Download</SectionKicker>
            <h2>Entre agora no ecossistema e acompanhe o crescimento do produto desde cedo.</h2>
            <p>
              Se voce quer um sistema para estudar TI com clareza, ritmo e leitura
              real de progresso, esse e o melhor ponto para entrar e testar.
            </p>
            <div className="hero-actions">
              <a className="cta-primary" href={windowsDownloadUrl}>
                <Download className="size-4.5" />
                Abrir download Windows
              </a>
              <a
                className="cta-secondary"
                href={mobileRepositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                Conhecer versao mobile
                <ArrowRight className="size-4.5" />
              </a>
            </div>
          </div>

          <div className="faq-grid">
            {faq.map((item) => (
              <article key={item.question} className="faq-card" data-float>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="landing-footer">
          <p>
            CodeTrail organiza trilhas, sessoes, revisoes, projetos e cadernos
            para transformar estudo em progresso visivel.
          </p>
          <div>
            <a href="#produto" data-section-link>
              Produto
            </a>
            <a href="#roadmap" data-section-link>
              Roadmap
            </a>
            <a href={windowsDownloadUrl}>Windows</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
