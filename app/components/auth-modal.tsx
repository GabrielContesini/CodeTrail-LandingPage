"use client";

import { login, savePlanIntent, signup } from "@/app/actions/auth";
import { usePlanIntent } from "@/store/plan-intent-store";
import { ArrowRight, Loader2, Terminal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
 const router = useRouter();
 const { selectedPlan, clearIntent } = usePlanIntent();

 const [isLogin, setIsLogin] = useState(true);
 const [isLoading, setIsLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");

 if (!isOpen) return null;

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

   // If auth successful, save intent if exists
   if (selectedPlan) {
    const intentResult = await savePlanIntent(selectedPlan);
    if (intentResult?.error) {
     console.error("Failed to save plan intent:", intentResult.error);
     // Non-blocking error, user is still authenticated
    }
    clearIntent();
   }

   router.push("/download/windows");
   onClose();
  } catch (error) {
   console.error(error);
   setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
  } finally {
   setIsLoading(false);
  }
 }

 return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
   <div
    className="absolute inset-0 z-0"
    onClick={onClose}
   />

   <div className="hud-panel relative z-10 w-full max-w-md bg-[#030507] border-cyber/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] p-8">
    <button
     onClick={onClose}
     className="absolute top-4 right-4 text-text-secondary hover:text-cyber transition-colors"
    >
     <X size={20} />
    </button>

    <div className="flex items-center gap-3 mb-6">
     <Terminal className="text-cyber" size={24} />
     <h2 className="text-white text-2xl font-display tracking-widest uppercase">
      {isLogin ? "INICIALIZAR SESSÃO" : "CRIAR REGISTRO"}
     </h2>
    </div>

    {selectedPlan && (
     <div className="cyber-badge mb-6 border-cyber/30 text-cyber/80 w-full justify-center">
      PLANO SELECIONADO: {selectedPlan.toUpperCase()}
     </div>
    )}

    {errorMsg && (
     <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 text-xs font-sans uppercase tracking-wider mb-6">
      ERRO: {errorMsg}
     </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
     <div>
      <label className="block text-xs font-sans text-text-secondary uppercase tracking-widest mb-2">
       E-MAIL OPERACIONAL
      </label>
      <input
       name="email"
       type="email"
       required
       placeholder="seu@email.com"
       className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-cyber focus:outline-none focus:ring-1 focus:ring-cyber/50 font-sans text-sm transition-all"
      />
     </div>

     <div>
      <label className="block text-xs font-sans text-text-secondary uppercase tracking-widest mb-2">
       CHAVE DE ENCRIPTAÇÃO
      </label>
      <input
       name="password"
       type="password"
       required
       placeholder="••••••••"
       minLength={6}
       className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-cyber focus:outline-none focus:ring-1 focus:ring-cyber/50 font-sans text-sm transition-all"
      />
     </div>

     <button
      type="submit"
      disabled={isLoading}
      className="btn-cyber btn-cyber-primary w-full py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center"
     >
      {isLoading ? (
       <Loader2 size={18} className="animate-spin text-white" />
      ) : (
       <>
        {isLogin ? "AUTENTICAR" : "REGISTRAR NO SISTEMA"}
        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
       </>
      )}
     </button>
    </form>

    <div className="mt-8 text-center border-t border-white/10 pt-6">
     <p className="text-text-secondary font-sans text-xs uppercase tracking-widest mb-3">
      {isLogin ? "NOVO RECRUTA?" : "JÁ POSSUI ACESSO?"}
     </p>
     <button
      onClick={() => setIsLogin(!isLogin)}
      className="text-cyber hover:text-white font-sans text-xs uppercase tracking-widest transition-colors"
     >
      {isLogin ? "CRIAR SEU REGISTROagora" : "VOLTAR PARA LOGIN"}
     </button>
    </div>
   </div>
  </div>
 );
}
