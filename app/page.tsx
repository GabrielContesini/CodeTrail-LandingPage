import { ArrowRight, Download, Network, Rocket, Shield, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CyberTrailScene } from "./components/cyber-trail-scene";
import { LandingMotion } from "./components/landing-motion";

const brandMark = "/design/CodeTrailMainIcon.png";

export default function Home() {
  return (
    <div className="app-container">
      <LandingMotion />
      <CyberTrailScene />

      <nav className="cyber-nav">
        <div className="layout-grid cyber-nav-inner">
          <div className="flex items-center gap-4">
            <Image src={brandMark} alt="CodeTrail Logo" width={32} height={32} className="opacity-90 grayscale contrast-200" />
            <div className="font-display font-bold text-xl text-cyber tracking-widest uppercase hidden md:block">
              CodeTrail <span className="opacity-50 font-sans text-xs ml-2 tracking-normal">// SYSTEM.ONLINE</span>
            </div>
          </div>
          <Link href="/download/windows" className="btn-cyber text-xs px-6 py-3">
            <Download size={14} /> DOWNLOAD
          </Link>
        </div>
      </nav>

      <main className="content-layer">

        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-center items-start pt-20 pb-20 layout-grid">
          <div className="cyber-badge mb-6">ESTABELECENDO CONEXÃO... SUCESSO</div>
          <h1 className="decode-text text-white mb-6 uppercase text-shadow-glow" data-text="O WORKSPACE CIBERNÉTICO PROFUNDO">
            O WORKSPACE <br />
            <span className="text-cyber">CIBERNÉTICO</span> <br />
            PROFUNDO
          </h1>
          <p className="font-sans text-text-secondary text-lg md:text-xl max-w-2xl mb-12 leading-relaxed uppercase tracking-widest">
            Um novo paradigma de execução de estudos.
            Sincronize seu progresso através das dimensões com confiabilidade offline-first.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link href="/download/windows" className="btn-cyber btn-cyber-primary">
              <Terminal size={18} /> ACESSAR CLIENTE WINDOWS
            </Link>
            <a href="#intel" className="btn-cyber">
              COLETAR INTEL <ArrowRight size={18} />
            </a>
          </div>
        </section>

        {/* INTEL / MODULES */}
        <section id="intel" className="py-40 layout-grid">
          <div className="mb-20">
            <h2 className="decode-text text-white mb-6 text-4xl md:text-5xl" data-text="MÓDULOS CENTRAIS">MÓDULOS CENTRAIS</h2>
            <div className="w-24 h-1 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "OFFLINE-FIRST", desc: "Opera limpo com ou sem conexão. A sincronização processa conflitos localmente antes da transmissão principal." },
              { icon: Network, title: "ECOSSISTEMA UNIFICADO", desc: "Instâncias cross-platform em tablets Android e desktops Windows interligadas através de uma camada de dados robusta estrutural." },
              { icon: Rocket, title: "AQUISIÇÃO DE DADOS", desc: "Construa trilhas de conhecimento, automatize revisões de rotina e analise a progressão dentro de uma interface de comando." }
            ].map((mod, idx) => (
              <div key={idx} className="hud-panel hud-reveal">
                <mod.icon className="text-primary mb-6" size={32} />
                <h3 className="text-xl text-white mb-4 font-display tracking-widest">{mod.title}</h3>
                <p className="text-text-secondary font-sans text-sm leading-relaxed uppercase tracking-wider">{mod.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ROADMAP */}
        <section className="py-40 layout-grid">
          <div className="mb-20 text-right flex flex-col items-end">
            <h2 className="decode-text text-white mb-6 text-4xl md:text-5xl" data-text="TRILHA DE EVOLUÇÃO">TRILHA DE EVOLUÇÃO</h2>
            <div className="w-24 h-1 bg-accent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { phase: "V1.0", title: "A BASE", items: ["Tablet Android ativado", "Sincronização Offline-first via Drift", "Shell Desktop Windows"] },
              { phase: "V2.0", title: "AUTONOMIA", items: ["Agendamentos de IA inteligente", "Resolução de tarefas em background", "Telemetria avançada"] },
              { phase: "V3.0", title: "EXPANSÃO", items: ["Streaming global de eventos", "Portal de integração na web", "Deploy com Multi-tenant"] }
            ].map((rm, idx) => (
              <div key={idx} className="hud-panel hud-reveal border-t-[3px] border-t-accent">
                <div className="text-accent font-display text-xs mb-3 tracking-widest">{rm.phase}</div>
                <h3 className="text-white text-3xl mb-8 font-display tracking-widest">{rm.title}</h3>
                <ul className="space-y-4 font-sans text-xs text-text-secondary uppercase tracking-widest">
                  {rm.items.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-primary">{">_"}</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-40 flex justify-center layout-grid relative mb-10">
          <div className="hud-panel hud-reveal w-full max-w-5xl text-center py-24 bg-black/60 flex flex-col items-center">
            <div className="cyber-badge mb-8">AVISO: ATUALIZAÇÃO DE SISTEMA</div>
            <h2 className="decode-text text-white mb-12 text-4xl md:text-6xl max-w-3xl mx-auto" data-text="PRONTO PARA INICIALIZAR?">PRONTO PARA INICIALIZAR?</h2>
            <Link href="/download/windows" className="btn-cyber btn-cyber-primary border-[2px] py-5 px-10 text-lg">
              <Download size={20} /> INICIAR SEQUÊNCIA DE DOWNLOAD
            </Link>
          </div>
        </section>

        <footer className="layout-grid pb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans uppercase tracking-[0.2em] text-text-secondary border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <Image src={brandMark} alt="CodeTrail Logo" width={24} height={24} className="grayscale opacity-50" />
            <span>SISTEMA CODETRAIL &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <a href="#intel" className="hover:text-primary transition-colors">MÓDULOS</a>
            <Link href="/download/windows" className="hover:text-primary transition-colors">WINDOWS</Link>
          </div>
        </footer>

      </main>
    </div>
  );
}
