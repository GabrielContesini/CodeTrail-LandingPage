import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Download,
  FolderKanban,
  Globe,
  Layers3,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import Image from "next/image";
import { AuthTrigger } from "./components/auth-trigger";
import { CyberTrailScene } from "./components/cyber-trail-scene";
import { LandingMotion } from "./components/landing-motion";

const brandMark = "/design/CodeTrailMainIcon.png";

const proofMetrics = [
  { label: "Workspace único", value: "Trilhas, tarefas, revisões e projetos no mesmo fluxo." },
  { label: "Web + Windows", value: "Mesmo backend, mesmo billing e mesma conta." },
  { label: "Checkout Stripe", value: "Upgrade direto com assinatura integrada ao produto." },
];

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
    summary: "Para tirar o estudo do improviso e começar com estrutura.",
    features: [
      "Workspace web com acesso inicial",
      "Trilhas, sessões e tarefas essenciais",
      "Organização base para rotina semanal",
    ],
  },
  {
    code: "pro" as const,
    name: "Pro",
    price: "R$ 19",
    cadence: "/mês",
    summary: "Para quem quer foco total, histórico premium e expansão do sistema.",
    featured: true,
    features: [
      "Analytics, flashcards e revisões avançadas",
      "Projetos ilimitados e visão operacional completa",
      "Checkout Stripe integrado no mesmo fluxo da conta",
    ],
  },
  {
    code: "founding" as const,
    name: "Founding",
    price: "R$ 199",
    cadence: "/único",
    summary: "Acesso vitalício para quem entra cedo e quer apoiar a construção do produto.",
    features: [
      "Tudo do Pro sem renovação mensal",
      "Status de fundador e acesso antecipado",
      "Contato direto para feedback e betas",
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
      "Sim. O fluxo de assinatura foi conectado para você entrar no Free agora e subir para Pro ou Founding quando quiser.",
  },
  {
    question: "A versão web e a versão Windows usam a mesma conta?",
    answer:
      "Sim. O backend, a autenticação e o billing são compartilhados entre as versões.",
  },
  {
    question: "A assinatura abre checkout seguro?",
    answer:
      "Sim. Os planos pagos seguem para checkout do Stripe já associado ao seu usuário autenticado.",
  },
];

export default function Home() {
  return (
    <div className="app-container landing-root">
      <LandingMotion />
      <CyberTrailScene />
      <div className="landing-backdrop" aria-hidden="true">
        <div className="landing-backdrop__orb landing-backdrop__orb--primary" />
        <div className="landing-backdrop__orb landing-backdrop__orb--secondary" />
        <div className="landing-backdrop__grid" />
      </div>

      <nav className="landing-nav">
        <div className="landing-shell landing-nav__inner">
          <a href="#top" className="landing-brand">
            <Image src={brandMark} alt="CodeTrail Logo" width={34} height={34} className="landing-brand__icon" />
            <div className="landing-brand__copy">
              <strong>CodeTrail</strong>
              <span>Study operating system</span>
            </div>
          </a>

          <div className="landing-nav__links">
            <a href="#produto">Produto</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="landing-nav__actions">
            <AuthTrigger target="download" className="landing-button landing-button--ghost">
              <Download size={16} />
              Windows
            </AuthTrigger>
            <AuthTrigger target="workspace" className="landing-button landing-button--primary">
              Entrar na web
            </AuthTrigger>
          </div>
        </div>
      </nav>

      <main className="content-layer">
        <section id="top" className="landing-hero landing-shell">
          <div className="landing-hero__copy">
            <span className="landing-kicker hero-reveal">
              <Sparkles size={14} />
              Organize. acompanhe. evolua com um sistema.
            </span>
            <h1 className="landing-hero__title hero-reveal">
              Seu workspace de estudos para tecnologia, sem caos e sem abas demais.
            </h1>
            <p className="landing-hero__lead hero-reveal">
              O CodeTrail centraliza trilhas, sessões, revisões, tarefas e projetos em uma
              experiência pensada para transformar esforço disperso em progresso mensurável.
            </p>

            <div className="landing-hero__actions hero-reveal">
              <AuthTrigger target="workspace" className="landing-button landing-button--primary landing-button--large">
                Começar agora
                <ArrowRight size={18} />
              </AuthTrigger>
              <AuthTrigger target="download" className="landing-button landing-button--ghost landing-button--large">
                <Download size={18} />
                Baixar para Windows
              </AuthTrigger>
            </div>

            <div className="landing-hero__meta reveal-up">
              <div className="landing-mini-stat">
                <Globe size={16} />
                <span>Versão web ativa</span>
              </div>
              <div className="landing-mini-stat">
                <ShieldCheck size={16} />
                <span>Autenticação e billing integrados</span>
              </div>
              <div className="landing-mini-stat">
                <Target size={16} />
                <span>Feito para rotina tech real</span>
              </div>
            </div>
          </div>

          <div className="landing-preview reveal-up">
            <div className="landing-preview__frame">
              <div className="landing-preview__header">
                <span className="landing-preview__eyebrow">Comando do dia</span>
                <span className="landing-preview__status">online</span>
              </div>

              <div className="landing-preview__hero">
                <div>
                  <strong>Priorize o que move sua trilha.</strong>
                  <p>Da sessão de foco ao projeto, tudo com contexto no mesmo painel.</p>
                </div>
                <div className="landing-preview__pill">Plano pro desbloqueia analytics e retenção</div>
              </div>

              <div className="landing-preview__metrics">
                <article>
                  <span>Horas na semana</span>
                  <strong>12.5h</strong>
                  <p>ritmo consistente</p>
                </article>
                <article>
                  <span>Revisões críticas</span>
                  <strong>04</strong>
                  <p>fila de retenção</p>
                </article>
                <article>
                  <span>Projetos ativos</span>
                  <strong>03</strong>
                  <p>execução prática</p>
                </article>
              </div>

              <div className="landing-preview__board">
                <article className="landing-preview-card">
                  <div className="landing-preview-card__head">
                    <Clock3 size={16} />
                    <span>Próxima sessão</span>
                  </div>
                  <strong>React + Supabase</strong>
                  <p>Hoje, 20:00 • prática guiada</p>
                </article>
                <article className="landing-preview-card">
                  <div className="landing-preview-card__head">
                    <Layers3 size={16} />
                    <span>Trilha ativa</span>
                  </div>
                  <strong>Full Stack JS</strong>
                  <p>68% de progresso médio entre módulos.</p>
                </article>
                <article className="landing-preview-card landing-preview-card--accent">
                  <div className="landing-preview-card__head">
                    <Star size={16} />
                    <span>Upgrade</span>
                  </div>
                  <strong>Assinatura pronta</strong>
                  <p>Escolha o plano e siga para checkout sem perder o contexto.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-proof landing-shell reveal-up">
          {proofMetrics.map((item) => (
            <article key={item.label} className="landing-proof__item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section id="produto" className="landing-section landing-shell">
          <div className="landing-section__header reveal-up">
            <span className="landing-kicker">
              <Target size={14} />
              O problema não é falta de disciplina
            </span>
            <h2>É estudar em um ecossistema quebrado.</h2>
            <p>
              Se o seu processo depende de várias ferramentas desconectadas, a fricção vira
              rotina. O CodeTrail foi desenhado para reduzir essa fricção na origem.
            </p>
          </div>

          <div className="landing-problems">
            {painPoints.map((item) => (
              <article key={item.title} className="landing-problem-card reveal-up">
                <span className="landing-problem-card__index">0{painPoints.indexOf(item) + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-shell">
          <div className="landing-section__header reveal-up">
            <span className="landing-kicker">
              <Sparkles size={14} />
              O que entra no seu fluxo
            </span>
            <h2>Um produto com cara de sistema, não de planilha fantasiada.</h2>
            <p>
              A experiência da web foi organizada para abrir rápido, orientar prioridade e manter
              clareza entre contexto, execução e retenção.
            </p>
          </div>

          <div className="landing-feature-grid">
            {featureHighlights.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="landing-feature-card reveal-up">
                <div className="landing-feature-card__icon">
                  <Icon size={18} />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="planos" className="landing-section landing-shell">
          <div className="landing-section__header reveal-up">
            <span className="landing-kicker">
              <ShieldCheck size={14} />
              Assinatura conectada ao produto
            </span>
            <h2>Entre grátis agora. Faça upgrade quando precisar de mais profundidade.</h2>
            <p>
              Os planos pagos seguem para checkout do Stripe com a conta autenticada. O Free já
              libera a base para organizar sua rotina hoje.
            </p>
          </div>

          <div className="landing-pricing">
            {plans.map((plan) => (
              <article
                key={plan.code}
                className={plan.featured ? "landing-price-card landing-price-card--featured reveal-up" : "landing-price-card reveal-up"}
              >
                <div className="landing-price-card__top">
                  <div>
                    <span className="landing-price-card__eyebrow">{plan.code === "founding" ? "Vitalício" : "Plano"}</span>
                    <h3>{plan.name}</h3>
                  </div>
                  {plan.featured ? <span className="landing-price-card__badge">Mais escolhido</span> : null}
                </div>

                <div className="landing-price-card__price">
                  <strong>{plan.price}</strong>
                  <span>{plan.cadence}</span>
                </div>

                <p className="landing-price-card__summary">{plan.summary}</p>

                <ul className="landing-price-card__features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <AuthTrigger
                  plan={plan.code}
                  className={plan.featured ? "landing-button landing-button--primary landing-button--block" : "landing-button landing-button--ghost landing-button--block"}
                >
                  {plan.code === "free" ? "Começar grátis" : plan.code === "pro" ? "Assinar Pro" : "Tornar-se founding"}
                </AuthTrigger>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="landing-section landing-shell">
          <div className="landing-section__header reveal-up">
            <span className="landing-kicker">
              <Globe size={14} />
              Perguntas diretas
            </span>
            <h2>O essencial para decidir rápido.</h2>
            <p>
              Sem rodeio: a proposta é entregar um sistema operacional de estudo com foco real em
              clareza, continuidade e evolução prática.
            </p>
          </div>

          <div className="landing-faq">
            {faqItems.map((item) => (
              <article key={item.question} className="landing-faq__item reveal-up">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta landing-shell reveal-up">
          <div className="landing-cta__copy">
            <span className="landing-kicker">
              <Sparkles size={14} />
              Próximo passo claro
            </span>
            <h2>Se o objetivo é evoluir em tecnologia, seu sistema também precisa evoluir.</h2>
            <p>
              Comece no plano Free, valide sua rotina na web e ative o premium quando quiser
              aprofundar retenção, analytics e expansão do workflow.
            </p>
          </div>

          <div className="landing-cta__actions">
            <AuthTrigger target="workspace" className="landing-button landing-button--primary landing-button--large">
              Abrir workspace web
              <ArrowRight size={18} />
            </AuthTrigger>
            <AuthTrigger target="download" className="landing-button landing-button--ghost landing-button--large">
              <Download size={18} />
              Baixar app Windows
            </AuthTrigger>
          </div>
        </section>

        <footer className="landing-footer landing-shell">
          <a href="#top" className="landing-brand landing-brand--footer">
            <Image src={brandMark} alt="CodeTrail Logo" width={28} height={28} className="landing-brand__icon" />
            <div className="landing-brand__copy">
              <strong>CodeTrail</strong>
              <span>Web + Windows</span>
            </div>
          </a>

          <div className="landing-footer__links">
            <a href="#produto">Produto</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
            <AuthTrigger target="download" className="landing-footer__button">
              Windows
            </AuthTrigger>
          </div>
        </footer>
      </main>
    </div>
  );
}
