"use client";

import { login, savePlanIntent, signup } from "@/app/actions/auth";
import { usePlanIntent } from "@/store/plan-intent-store";
import { ArrowRight, Eye, EyeOff, Home, Loader2, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CyberTrailScene } from "../components/cyber-trail-scene";
import { LandingMotion } from "../components/landing-motion";

const brandMark = "/design/CodeTrailMainIcon.png";

export default function AuthPage() {
 // We instantiate router but don't strictly use it in the success branch now,
 // though it might be used later. If it's unused, we can remove it. Let's just remove it if unused.
 // Actually, looking at the code, we replaced router.push with window.location.href.
 // So we can safely NOT import useRouter and NOT instantiate it.
 const { selectedPlan, clearIntent } = usePlanIntent();

 const [isLogin, setIsLogin] = useState(true);
 const [isLoading, setIsLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [successMsg, setSuccessMsg] = useState("");
 const [showPassword, setShowPassword] = useState(false);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg("");

  const formData = new FormData(e.currentTarget);

  try {
   const authResult = isLogin ? await login(formData) : await signup(formData);

   if (authResult.error) {
    setErrorMsg(authResult.error);
    setIsLoading(false);
    return;
   }

   if (authResult.isSignup) {
    setSuccessMsg("Registro concluído com sucesso! Verifique sua caixa de e-mail (e a pasta de SPAM) para confirmar a conta. Em seguida, faça o login abaixo.");
    setIsLogin(true); // Switch to login form
    setIsLoading(false);
    return;
   }

   // If auth successful (login), save intent if exists
   if (selectedPlan) {
    const intentResult = await savePlanIntent(selectedPlan);
    if (intentResult?.error) {
     console.warn("Intent info:", intentResult.error);
    }
    clearIntent();
   }

   window.location.href = "/download/windows"; // Hard redirect to ensure fresh cookies are sent
  } catch (error) {
   console.error(error);
   setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
  } finally {
   setIsLoading(false);
  }
 }

 return (
  <div className="app-container">
   <LandingMotion />
   <CyberTrailScene />

   <nav className="cyber-nav">
    <div className="layout-grid cyber-nav-inner">
     <Link href="/" className="flex items-center gap-4">
      <Image src={brandMark} alt="CodeTrail Logo" width={32} height={32} className="opacity-90 grayscale contrast-200" />
      <div className="font-display font-bold text-xl text-cyber tracking-widest uppercase hidden md:block">
       CodeTrail <span className="opacity-50 font-sans text-xs ml-2 tracking-normal">{"// SYSTEM.ONLINE"}</span>
      </div>
     </Link>
     <Link href="/" className="text-text-secondary hover:text-cyber font-sans text-xs flex gap-2 items-center tracking-widest uppercase transition-colors">
      <Home size={14} /> RETORNAR À NAVE MÃE
     </Link>
    </div>
   </nav>

   <main className="content-layer">
    <section className="min-h-screen flex flex-col justify-center items-center py-20 layout-grid relative">

     <div className="hud-panel hud-reveal relative z-10 w-full max-w-md bg-[#030507]/90 border-[2px] border-cyber/30 shadow-[0_0_50px_rgba(0,240,255,0.05)] p-8 md:p-10">

      <div className="flex items-center gap-3 mb-8">
       <Terminal className="text-cyber" size={28} />
       <h2 className="text-white text-3xl font-display tracking-widest uppercase">
        {isLogin ? "INICIALIZAR SESSÃO" : "CRIAR REGISTRO"}
       </h2>
      </div>

      {selectedPlan && (
       <div className="cyber-badge mb-8 border-cyber/50 text-cyber w-full justify-center text-center py-3">
        PLANO SELECIONADO: {selectedPlan.toUpperCase()}
       </div>
      )}

      {errorMsg && (
       <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 text-xs font-sans uppercase tracking-wider mb-8 text-center">
        {errorMsg}
       </div>
      )}

      {successMsg && (
       <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-6 text-sm font-sans uppercase tracking-wider mb-8 text-center leading-relaxed">
        {successMsg}
       </div>
      )}

      {!successMsg && (
       <form onSubmit={handleSubmit} className="space-y-6">
        <div>
         <label className="block text-xs font-sans text-text-secondary uppercase tracking-widest mb-3">
          E-MAIL
         </label>
         <input
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          className="w-full bg-black/50 border border-white/10 px-5 py-4 text-white focus:border-cyber focus:outline-none focus:ring-1 focus:ring-cyber/50 font-sans text-sm transition-all"
         />
        </div>

        <div>
         <label className="block text-xs font-sans text-text-secondary uppercase tracking-widest mb-3">
          SENHA
         </label>
         <div className="relative">
          <input
           name="password"
           type={showPassword ? "text" : "password"}
           required
           placeholder="••••••••"
           minLength={6}
           className="w-full bg-black/50 border border-white/10 px-5 py-4 pr-12 text-white focus:border-cyber focus:outline-none focus:ring-1 focus:ring-cyber/50 font-sans text-sm transition-all"
          />
          <button
           type="button"
           onClick={() => setShowPassword(!showPassword)}
           className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-cyber transition-colors cursor-pointer"
          >
           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
         </div>
        </div>

        <button
         type="submit"
         disabled={isLoading}
         className="btn-cyber btn-cyber-primary w-full py-5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center text-sm cursor-pointer"
        >
         {isLoading ? (
          <Loader2 size={20} className="animate-spin text-white" />
         ) : (
          <>
           {isLogin ? "AUTENTICAR" : "REGISTRAR NO SISTEMA"}
           <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </>
         )}
        </button>
       </form>
      )}

      <div className="mt-10 text-center border-t border-white/10 pt-8">
       <p className="text-text-secondary font-sans text-xs uppercase tracking-widest mb-4">
        {isLogin ? "NOVO RECRUTA?" : "JÁ POSSUI ACESSO?"}
       </p>
       <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-cyber hover:text-white font-sans text-[11px] uppercase tracking-widest transition-colors py-2 px-4 border border-cyber/20 hover:border-cyber/60 rounded-sm"
       >
        {isLogin ? "CRIAR SEU REGISTRO AGORA" : "VOLTAR PARA LOGIN"}
       </button>
      </div>

     </div>

    </section>
   </main>
  </div>
 );
}
