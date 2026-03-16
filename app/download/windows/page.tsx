import { logout } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/server";
import { Download, LogOut, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CyberTrailScene } from "../../components/cyber-trail-scene";
import { LandingMotion } from "../../components/landing-motion";
import { IntentProcessor } from "./intent-processor";

const brandMark = "/design/CodeTrailMainIcon.png";

export default async function DownloadWindows() {
 const supabase = await createClient();
 const { data: { user }, error } = await supabase.auth.getUser();

 if (error || !user) {
  redirect("/");
 }

 // Fetch their latest intent (if it exists) to show on UI
 const { data: intents } = await supabase
  .from("plan_intents")
  .select("selected_plan")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(1);

 const currentPlan = intents?.[0]?.selected_plan || "nenhum plano específico";

 return (
  <div className="app-container">
   <LandingMotion />
   <CyberTrailScene />

   {/* We drop a client component here to pull from Zustand and hit the server action if they arrived without saving yet */}
   <IntentProcessor />

   <nav className="cyber-nav">
    <div className="layout-grid cyber-nav-inner">
     <Link href="/" className="flex items-center gap-4">
      <Image src={brandMark} alt="CodeTrail Logo" width={32} height={32} className="opacity-90 grayscale contrast-200" />
      <div className="font-display font-bold text-xl text-cyber tracking-widest uppercase hidden md:block">
       CodeTrail <span className="opacity-50 font-sans text-xs ml-2 tracking-normal">{"// SYSTEM.ONLINE"}</span>
      </div>
     </Link>

     <form action={logout}>
      <button type="submit" className="text-text-secondary hover:text-red-500 font-sans text-xs flex gap-2 items-center tracking-widest uppercase transition-colors">
       <LogOut size={14} /> DESCONECTAR
      </button>
     </form>
    </div>
   </nav>

   <main className="content-layer">
    <section className="min-h-screen flex flex-col justify-center items-center py-20 layout-grid relative text-center">
     <div className="hud-panel hud-reveal max-w-3xl w-full mx-auto relative z-10 bg-[#030507]/90 border-[2px] border-cyber/50 shadow-[0_0_50px_rgba(0,240,255,0.1)] px-6 py-16 md:px-12">
      <div className="cyber-badge mb-8 border-cyber text-cyber mx-auto">AUTENTICAÇÃO CONCLUÍDA</div>

      <h1 className="text-white text-3xl md:text-5xl font-display mb-6 tracking-widest uppercase">
       BEM-VINDO AO <span className="text-cyber">CODETRAIL</span>
      </h1>

      <p className="font-sans text-text-secondary text-sm uppercase tracking-widest mb-4">
       Identificação confirmada: <span className="text-white">{user.email}</span>
      </p>

      {currentPlan !== "nenhum plano específico" && (
       <p className="font-sans text-text-secondary text-xs uppercase tracking-widest mb-12 opacity-80">
        Interesse registrado: <span className="text-cyber">Plano {currentPlan}</span>
       </p>
      )}

      <div className="bg-black/50 border border-white/10 p-8 mb-12 text-left">
       <h3 className="text-white font-display tracking-widest uppercase mb-4 flex items-center gap-2">
        <Terminal size={18} className="text-cyber" /> OBRIGADO POR CONFIAR NO CODETRAIL!
       </h3>

       <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
        Seu registro foi concluído com sucesso. Nossa missão é acabar com o caos no aprendizado e entregar um fluxo claro, direto e focado na sua evolução. Agora você faz parte dessa jornada.
       </p>

       <h4 className="text-white text-xs font-display tracking-widest uppercase mb-4 opacity-80">
        INSTRUÇÕES DE INSTALAÇÃO
       </h4>

       <ol className="space-y-4 font-sans text-xs text-text-secondary uppercase tracking-wider">
        <li className="flex gap-3"><span className="text-cyber opacity-50">1.</span> Faça o download do arquivo executável clicando no botão abaixo.</li>
        <li className="flex gap-3"><span className="text-cyber opacity-50">2.</span> Execute o instalador `CodeTrail Setup.exe` no seu ambiente Windows.</li>
        <li className="flex gap-3"><span className="text-cyber opacity-50">3.</span> Faça login usando a mesma credencial fornecida agora.</li>
        <li className="flex gap-3"><span className="text-cyber opacity-50">4.</span> (Aviso: A versão Mobile e Web Dashboard estarão ativas em breve).</li>
       </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
       <a href="/api/download/windows" className="btn-cyber btn-cyber-primary py-4 px-10 text-sm">
        <Download size={18} /> BAIXAR PARA WINDOWS
       </a>
       <Link href="/" className="btn-cyber py-4 px-10 text-sm text-text-secondary">
        RETORNAR À BASE
       </Link>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-2 text-xs font-sans text-text-secondary uppercase tracking-widest">
       <span>Status:</span>
       <span className="flex items-center gap-1 text-cyber"><div className="w-2 h-2 rounded-full bg-cyber shadow-[0_0_8px_rgba(0,240,255,1)] animate-pulse"></div> Online</span>
      </div>
     </div>
    </section>
   </main>
  </div>
 );
}
