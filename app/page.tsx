import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Download,
  RefreshCcw,
  Route,
  Timer
} from "lucide-react";
import Image from "next/image";
import { AuthTrigger } from "./components/auth-trigger";
import { CyberTrailScene } from "./components/cyber-trail-scene";
import { LandingMotion } from "./components/landing-motion";

const brandMark = "/design/CodeTrailMainIcon.png";

export default function Home() {
  return (
    <div className="app-container">
      <LandingMotion />
      <CyberTrailScene />

      <nav className="cyber-nav">
        {/* Navigation - KEEP SAME OVERALL LOOK */}
        <div className="layout-grid cyber-nav-inner">
          <div className="flex items-center gap-4">
            <Image src={brandMark} alt="CodeTrail Logo" width={32} height={32} className="opacity-90 grayscale contrast-200" />
            <div className="font-display font-bold text-xl text-cyber tracking-widest uppercase hidden md:block">
              CodeTrail <span className="opacity-50 font-sans text-xs ml-2 tracking-normal">{"// SYSTEM.ONLINE"}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <AuthTrigger className="btn-cyber text-xs px-6 py-3">
              <Download size={14} /> WINDOWS APP
            </AuthTrigger>
          </div>
        </div>
      </nav>

      <main className="content-layer">
        {/* 1. HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center items-start pt-32 pb-20 layout-grid relative">
          <div className="cyber-badge mb-6 border-cyber text-cyber">✨ ORGANIZE. ACOMPANHE. TRANSFORME ROTINA EM EVOLUÇÃO.</div>
          <h1 className="text-white mb-6 uppercase text-shadow-glow text-5xl md:text-7xl">
            <span className="decode-text block" data-text="SEU SISTEMA OPERACIONAL">SEU SISTEMA OPERACIONAL</span>
            <span className="decode-text block" data-text="DE ESTUDOS PARA">DE ESTUDOS PARA</span>
            <span className="decode-text text-cyber block" data-text="TECNOLOGIA">TECNOLOGIA</span>
          </h1>
          <p className="font-sans text-text-secondary text-lg md:text-xl max-w-2xl mb-12 leading-relaxed uppercase tracking-widest">
            Pare de estudar no improviso. O CodeTrail unifica trilhas de estudo, tarefas e revisões em um único ecossistema focado na sua evolução contínua.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <AuthTrigger className="btn-cyber btn-cyber-primary text-sm px-8 py-4">
              COMEÇAR AGORA <ArrowRight size={18} className="ml-2" />
            </AuthTrigger>
            <AuthTrigger className="btn-cyber text-sm px-8 py-4">
              <Download size={18} /> BAIXAR PARA WINDOWS
            </AuthTrigger>
          </div>
          <div className="text-xs font-sans text-text-secondary uppercase tracking-widest opacity-60">
            Disponível para Web e Windows. Mobile em breve.
          </div>
        </section>

        {/* 2. SEÇÃO DE DOR / PROBLEMA */}
        <section className="py-24 layout-grid bg-black/40">
          <div className="mb-20">
            <div className="cyber-badge mb-4 border-red-500/30 text-red-500">STATUS CRÍTICO</div>
            <h2 className="decode-text text-white text-4xl md:text-5xl" data-text="O CAOS INVISÍVEL DO APRENDIZADO">O CAOS INVISÍVEL DO APRENDIZADO</h2>
            <p className="font-sans text-text-secondary mt-4 uppercase tracking-widest text-sm">Não é falta de foco. É excesso de ferramentas desconectadas.</p>
            <div className="w-24 h-1 bg-red-500/50 mt-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hud-panel border-t-[3px] border-t-red-500/50">
              <h3 className="text-xl text-white mb-4 font-display tracking-widest"><span className="text-red-500">{"01."}</span> FERRAMENTAS SOLTAS</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Cursos e tarefas espalhados em dezenas de abas e apps.</p>
            </div>
            <div className="hud-panel border-t-[3px] border-t-red-500/50">
              <h3 className="text-xl text-white mb-4 font-display tracking-widest"><span className="text-red-500">{"02."}</span> CONSTÂNCIA PERDIDA</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Você nunca sabe exatamente o que deve estudar hoje.</p>
            </div>
            <div className="hud-panel border-t-[3px] border-t-red-500/50">
              <h3 className="text-xl text-white mb-4 font-display tracking-widest"><span className="text-red-500">{"03."}</span> FALTA DE RETENÇÃO</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Conteúdo esquecido por falta de um sistema de revisão lógico.</p>
            </div>
          </div>
          <div className="mt-12 text-center text-text-secondary font-sans uppercase tracking-widest text-sm border border-white/5 bg-white/5 py-4">
            "A sensação frustrante de estudar por meses e não conseguir medir a própria evolução."
          </div>
        </section>

        {/* 3. SEÇÃO DE SOLUÇÃO & 4. FUNCIONALIDADES */}
        <section className="py-32 layout-grid">
          <div className="mb-20">
            <div className="cyber-badge mb-4 border-cyber text-cyber">RESOLUÇÃO DE PARADIGMA</div>
            <h2 className="decode-text text-white mb-4 text-4xl md:text-5xl" data-text="FOCO ABSOLUTO. CONTEXTO IMEDIATO.">FOCO ABSOLUTO. CONTEXTO IMEDIATO.</h2>
            <p className="font-sans text-text-secondary max-w-3xl uppercase tracking-widest text-sm leading-relaxed">
              Nós criamos o ambiente perfeito para acabar com a dispersão. O CodeTrail não é apenas para anotar coisas, é um método codificado em software para centralizar toda a sua jornada de aprendizado tecnológico.
            </p>
            <div className="w-24 h-1 bg-cyber mt-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="hud-panel hud-reveal lg:col-span-2 relative overflow-hidden group">
              <Route className="text-cyber mb-6 opacity-80 group-hover:opacity-100 transition-opacity" size={32} />
              <h3 className="text-xl text-white mb-4 font-display tracking-widest">TRILHAS DE ESTUDO</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider max-w-md">Mapeie todo o seu caminho. Organize conteúdos, linguagens ou objetivos com hierarquia visual forte.</p>
            </div>
            <div className="hud-panel hud-reveal group">
              <Timer className="text-cyber mb-6 opacity-80 group-hover:opacity-100" size={32} />
              <h3 className="text-xl text-white mb-4 font-display tracking-widest">SESSÕES</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Tempo focado com registro automático de esforço produtivo.</p>
            </div>
            <div className="hud-panel hud-reveal group">
              <CheckSquare className="text-cyber mb-6 opacity-80 group-hover:opacity-100" size={32} />
              <h3 className="text-xl text-white mb-4 font-display tracking-widest">PROJETOS & TAREFAS</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Prática atrelada à teoria. Saiba exatamente o que codar.</p>
            </div>
            <div className="hud-panel hud-reveal group">
              <RefreshCcw className="text-cyber mb-6 opacity-80 group-hover:opacity-100" size={32} />
              <h3 className="text-xl text-white mb-4 font-display tracking-widest">REVISÕES INTELIGENTES</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Nunca mais esqueça um conceito importante com alertas.</p>
            </div>
            <div className="hud-panel hud-reveal lg:col-span-2 group">
              <Activity className="text-cyber mb-6 opacity-80 group-hover:opacity-100" size={32} />
              <h3 className="text-xl text-white mb-4 font-display tracking-widest">PROGRESSO & METAS</h3>
              <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">Histórico real. Meça sua evolução com dados do sistema, não com achismos ou planilhas estáticas.</p>
            </div>
          </div>
        </section>

        {/* 5. COMO FUNCIONA */}
        <section className="py-32 layout-grid bg-black/30 border-y border-white/5">
          <div className="mb-20 text-center flex flex-col items-center">
            <h2 className="decode-text text-white mb-6 text-4xl" data-text="SEU NOVO RITUAL DE EVOLUÇÃO">SEU NOVO RITUAL DE EVOLUÇÃO</h2>
            <div className="w-24 h-1 bg-white/20"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-between relative">
            <div className="hidden md:block absolute top-[28px] left-0 w-full h-[1px] bg-white/10 z-0"></div>
            {[
              { num: "01", title: "ESCOLHA SUA TRILHA", desc: "Defina seu macro-objetivo principal" },
              { num: "02", title: "ORGANIZE A ROTINA", desc: "Quebre frentes em sessões menores" },
              { num: "03", title: "ESTUDE CLARO", desc: "Sem ter que pensar 'o que faço?'" },
              { num: "04", title: "ACOMPANHE O SCORE", desc: "Celebre o crescimento contínuo" },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-black border border-cyber/50 flex items-center justify-center text-cyber font-display text-lg mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  {step.num}
                </div>
                <h3 className="text-white font-display tracking-widest mb-2">{step.title}</h3>
                <p className="text-text-secondary font-sans text-xs uppercase tracking-widest max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. DIFERENCIAIS */}
        <section className="py-32 layout-grid">
          <div className="mb-16">
            <h2 className="decode-text text-white text-3xl md:text-5xl mb-6" data-text="POR QUE NÃO USAR NOTION OU PLANILHAS?">POR QUE NÃO USAR NOTION OU PLANILHAS?</h2>
            <p className="font-sans text-text-secondary max-w-2xl uppercase tracking-widest text-sm leading-relaxed">
              Ferramentas genéricas são telas em branco. Você gasta mais tempo organizando *como* vai estudar do que de fato estudando.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="hud-panel bg-white/5 border-none">
              <CheckCircle2 className="text-cyber mb-4" size={24} />
              <h3 className="text-white font-display tracking-widest mb-2">MÉTODO NATIVO</h3>
              <p className="text-text-secondary font-sans text-xs uppercase tracking-widest">Feito para estruturar estudos nativamente, não para atas de reunião.</p>
            </div>
            <div className="hud-panel bg-white/5 border-none">
              <CheckCircle2 className="text-cyber mb-4" size={24} />
              <h3 className="text-white font-display tracking-widest mb-2">MÉTRICAS AUTOMÁTICAS</h3>
              <p className="text-text-secondary font-sans text-xs uppercase tracking-widest">Visualização de progresso automática sem precisar configurar fórmulas complexas.</p>
            </div>
            <div className="hud-panel bg-white/5 border-none">
              <CheckCircle2 className="text-cyber mb-4" size={24} />
              <h3 className="text-white font-display tracking-widest mb-2">VELOCIDADE DE CÓDIGO</h3>
              <p className="text-text-secondary font-sans text-xs uppercase tracking-widest">Experiência com atalhos fluidos e design focado totalmente no seu flow.</p>
            </div>
          </div>
        </section>

        {/* 8 e 9. PÚBLICO & BENEFÍCIOS (PLACAR) */}
        <section className="py-24 layout-grid bg-cyber/5 border-y border-cyber/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-white text-3xl mb-8 leading-relaxed">
                <span className="decode-text block" data-text="FEITO POR QUEM CODA,">FEITO POR QUEM CODA,</span>
                <span className="decode-text block" data-text="PARA QUEM NÃO PARA">PARA QUEM NÃO PARA</span>
                <span className="decode-text block" data-text="DE APRENDER.">DE APRENDER.</span>
              </h2>
              <div className="flex flex-wrap gap-3 font-sans text-xs text-cyber uppercase tracking-widest">
                <span className="border border-cyber/30 bg-cyber/10 px-4 py-2 rounded-sm border-l-2 border-l-cyber">Desenvolvedores</span>
                <span className="border border-cyber/30 bg-cyber/10 px-4 py-2 rounded-sm border-l-2 border-l-cyber">Estudantes Tech</span>
                <span className="border border-cyber/30 bg-cyber/10 px-4 py-2 rounded-sm border-l-2 border-l-cyber">Transição</span>
                <span className="border border-cyber/30 bg-cyber/10 px-4 py-2 rounded-sm border-l-2 border-l-cyber">Autodidatas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border-l-[3px] border-green-500 pl-4 py-2">
                <div className="text-white font-display text-xl tracking-widest mb-2">+ CLAREZA</div>
                <div className="text-text-secondary font-sans text-xs uppercase tracking-widest">Saiba seu próximo passo no segundo que abrir.</div>
              </div>
              <div className="border-l-[3px] border-green-500 pl-4 py-2">
                <div className="text-white font-display text-xl tracking-widest mb-2">+ CONTROLE</div>
                <div className="text-text-secondary font-sans text-xs uppercase tracking-widest">Métricas validando seu esforço real.</div>
              </div>
              <div className="border-l-[3px] border-red-500 pl-4 py-2">
                <div className="text-white font-display text-xl tracking-widest mb-2">- IMPROVISO</div>
                <div className="text-text-secondary font-sans text-xs uppercase tracking-widest">Chega de perder tempo decidindo abas.</div>
              </div>
              <div className="border-l-[3px] border-green-500 pl-4 py-2">
                <div className="text-white font-display text-xl tracking-widest mb-2">+ CONSTÂNCIA</div>
                <div className="text-text-secondary font-sans text-xs uppercase tracking-widest">Transforme motivação em um sistema sólido.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. PLANOS */}
        <section className="py-40 layout-grid relative">
          <div className="mb-20 text-center">
            <h2 className="decode-text text-white mb-4 text-4xl md:text-5xl" data-text="INVISTA NO SEU INTELECTO">INVISTA NO SEU INTELECTO</h2>
            <p className="font-sans text-text-secondary max-w-2xl mx-auto uppercase tracking-widest text-sm">COMECE DE GRAÇA HOJE. ESCALE QUANDO PRECISAR DE FOCO TOTAL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free */}
            <div className="hud-panel flex flex-col h-full opacity-80 border-white/20">
              <h3 className="text-xl text-white mb-2 font-display tracking-widest">FREE</h3>
              <p className="text-text-secondary font-sans text-xs uppercase tracking-widest mb-8 h-8">Ideal para começar e organizar a mente.</p>
              <div className="text-4xl text-white font-display mb-8">R$ 0<span className="text-lg text-text-secondary">/mês</span></div>
              <ul className="space-y-4 mb-10 flex-grow font-sans text-sm text-text-secondary uppercase tracking-wider">
                <li className="flex items-center gap-3"><Check size={16} className="text-white" /> Acesso inicial</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-white" /> Organização básica</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-white" /> Sessões limitadas</li>
              </ul>
              <AuthTrigger plan="free" className="btn-cyber w-full text-center py-3">COMEÇAR GRÁTIS</AuthTrigger>
            </div>

            {/* Pro */}
            <div className="hud-panel flex flex-col min-h-[450px] border-[2px] border-cyber relative transform lg:-translate-y-4 bg-black/60 shadow-[0_0_30px_rgba(99,102,241,0.15)] z-10">
              <div className="absolute top-0 right-0 bg-cyber text-black font-display font-bold text-xs px-3 py-1 uppercase tracking-widest">RECOMENDADO</div>
              <h3 className="text-xl text-cyber mb-2 font-display tracking-widest glow-text">PRO</h3>
              <p className="text-text-secondary font-sans text-xs uppercase tracking-widest mb-8 h-8">Foco total, recursos completos e premium.</p>
              <div className="text-4xl text-white font-display mb-8">R$ 19<span className="text-lg text-text-secondary">/mês</span></div>
              <ul className="space-y-4 mb-10 flex-grow font-sans text-sm text-white uppercase tracking-wider">
                <li className="flex items-center gap-3"><Check size={16} className="text-cyber" /> Trilhas avançadas</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-cyber" /> Dashboard de progressão</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-cyber" /> Revisões programadas</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-cyber" /> Projetos ilimitados</li>
              </ul>
              <AuthTrigger plan="pro" className="btn-cyber btn-cyber-primary w-full text-center py-4">ASSINAR PRO</AuthTrigger>
            </div>

            {/* Founding */}
            <div className="hud-panel flex flex-col h-full border-yellow-500/50 bg-yellow-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0"></div>
              <h3 className="text-xl text-yellow-500 mb-2 font-display tracking-widest">FOUNDING <span className="inline-block align-top text-[0.65rem] bg-yellow-500/20 px-2 py-0.5 ml-1 rounded">VITALÍCIO</span></h3>
              <p className="text-text-secondary font-sans text-xs uppercase tracking-widest mb-8 h-8">Para quem acredita na missão desde o dia 1.</p>
              <div className="text-4xl text-white font-display mb-8">R$ 199<span className="text-lg text-text-secondary">/único</span></div>
              <ul className="space-y-4 mb-10 flex-grow font-sans text-sm text-text-secondary uppercase tracking-wider">
                <li className="flex items-center gap-3"><Check size={16} className="text-yellow-500" /> Tudo do plano Pro (Eterno)</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-yellow-500" /> Status de fundador</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-yellow-500" /> Suporte direto e prioritário</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-yellow-500" /> Acesso a Betas</li>
              </ul>
              <AuthTrigger plan="founding" className="btn-cyber w-full text-center py-3 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">TORNAR-SE FOUNDING</AuthTrigger>
            </div>
          </div>
        </section>

        {/* 11. PROVA SOCIAL */}
        <section className="py-24 layout-grid text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cyber opacity-[0.02] mix-blend-screen pointer-events-none"></div>
          <div className="hud-panel max-w-4xl mx-auto border-dashed border-white/20">
            <h2 className="decode-text text-white mb-6 text-2xl font-display tracking-widest uppercase" data-text="A EVOLUÇÃO DA COMUNIDADE">A EVOLUÇÃO DA COMUNIDADE</h2>
            <p className="font-sans text-text-secondary uppercase tracking-widest text-sm leading-relaxed max-w-2xl mx-auto italic">
              "Junte-se à nova geração de profissionais tech que deixaram de apenas 'fazer cursos' e passaram a construir sistemas reais de aprendizado e progressão sólida."
            </p>
          </div>
        </section>

        {/* 12. FAQ */}
        <section className="py-32 layout-grid border-t border-white/5">
          <div className="mb-16 text-center">
            <h2 className="decode-text text-white text-3xl md:text-5xl mb-4" data-text="INTELIGÊNCIA COMPARTILHADA">INTELIGÊNCIA COMPARTILHADA</h2>
            <div className="w-24 h-1 bg-white/20 mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {[
              { q: "O que é o CodeTrail?", a: "Uma plataforma que atua como seu sistema operacional focado exclusivamente na organização estruturada de estudos e projetos." },
              { q: "Para quem ele foi feito?", a: "Profissionais tech, autodidatas e estudantes buscando mais estrutura e clareza no desenvolvimento técnico." },
              { q: "Posso usar no Windows?", a: "Sim, temos uma versão instalável elegante diretamente no site para foco profundo em desktop." },
              { q: "Existe versão mobile?", a: "A experiência fluida mobile está em breve! Focamos em entregar a melhor versão desktop/web inicial." },
              { q: "O plano Free é suficiente?", a: "Sim, você pode estabelecer suas bases, organizar trilhas e controlar sessões sem pagar nada." }
            ].map((faq, i) => (
              <div key={i} className="bg-black/40 border border-white/10 p-6 hover:border-cyber/30 transition-colors group">
                <div className="flex justify-between items-center text-white font-display tracking-widest uppercase text-sm">
                  {faq.q}
                  <ChevronDown size={16} className="text-cyber opacity-50 group-hover:opacity-100" />
                </div>
                <div className="mt-4 text-text-secondary font-sans text-xs uppercase tracking-wider leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 13. BOTTOM CTA / FOOTER */}
        <section className="py-40 flex justify-center layout-grid relative mb-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0,transparent_50%)] pointer-events-none"></div>
          <div className="hud-panel hud-reveal w-full max-w-5xl text-center py-24 bg-black/80 flex flex-col items-center border border-cyber/30 shadow-[0_0_50px_rgba(99,102,241,0.05)]">
            <div className="cyber-badge mb-8 text-cyber border-cyber">SEQUÊNCIA PRONTA PARA INICIALIZAR</div>
            <h2 className="decode-text text-white mb-6 text-4xl md:text-5xl max-w-3xl mx-auto uppercase leading-tight" data-text="O SEU PRÓXIMO NÍVEL NÃO VAI SE ALCANÇAR SOZINHO">O SEU PRÓXIMO NÍVEL NÃO VAI SE ALCANÇAR SOZINHO</h2>
            <p className="font-sans text-text-secondary uppercase tracking-widest text-sm mb-12 max-w-2xl">
              Assuma o controle da sua jornada de estudos. Estruture hoje a carreira tech de amanhã.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <AuthTrigger plan="free" className="btn-cyber btn-cyber-primary border-[2px] py-4 px-10 text-sm">
                COMEÇAR AGORA GRATUITAMENTE
              </AuthTrigger>
              <AuthTrigger className="btn-cyber py-4 px-10 text-sm">
                <Download size={18} /> BAIXAR PARA WINDOWS
              </AuthTrigger>
            </div>
          </div>
        </section>

        <footer className="layout-grid pb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans uppercase tracking-[0.2em] text-text-secondary border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <Image src={brandMark} alt="CodeTrail Logo" width={24} height={24} className="grayscale opacity-50" />
            <span>CODETRAIL &copy; {new Date().getFullYear()} // SISTEMA OPERACIONAL DE ESTUDOS</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-cyber transition-colors">PLANOS</a>
            <a href="#" className="hover:text-cyber transition-colors">FAQ</a>
            <AuthTrigger className="hover:text-cyber transition-colors">WINDOWS</AuthTrigger>
          </div>
        </footer>

      </main>
    </div>
  );
}
