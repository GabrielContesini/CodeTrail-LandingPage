"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function getAuthError(error: any) {
 const msg = error?.message || "";
 if (msg.includes("Invalid login credentials")) return "Credenciais incorretas (E-mail ou Senha).";
 if (msg.includes("User already registered")) return "Este e-mail já está sendo utilizado.";
 if (msg.includes("Password should be at least")) return "A senha deve ter no mínimo 6 caracteres.";
 if (msg.includes("rate limit")) return "Muitas tentativas em pouco tempo. Aguarde um momento.";
 if (msg.includes("Email not confirmed")) return "Verifique sua caixa de e-mail para validar a conta antes de entrar.";
 return "Falha de comunicação com os servidores. Verifique sua conexão e tente novamente.";
}

export async function login(formData: FormData) {
 const supabase = await createClient();

 const email = formData.get("email") as string;
 const password = formData.get("password") as string;

 const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
 });

 if (error) {
  return { error: getAuthError(error) };
 }

 return { success: true, isSignup: false };
}

export async function signup(formData: FormData) {
 const supabase = await createClient();

 const email = formData.get("email") as string;
 const password = formData.get("password") as string;

 const { data, error } = await supabase.auth.signUp({
  email,
  password,
 });

 if (error) {
  return { error: getAuthError(error) };
 }

 if (data?.user && !data?.session) {
  // Supabase requires email verification, so no session is created yet
  return { success: true, isSignup: true };
 }

 return { success: true, isSignup: true };
}

export async function savePlanIntent(selectedPlan: string) {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
  return { error: "User not authenticated" };
 }

 if (selectedPlan && ["free", "pro", "founding"].includes(selectedPlan)) {
  const { error } = await supabase
   .from("plan_intents")
   .insert({
    user_id: user.id,
    selected_plan: selectedPlan,
    source: "landing_page",
    platform_interest: "windows",
    status: "interested",
   });

  if (error) {
   // Ignore table not found errors gracefully so it doesn't break the user's flow
   if (error.message.includes("Could not find the table") || error.code === '42P01') {
    return { success: true, warning: 'Table plan_intents not found' };
   }
   return { error: error.message };
  }
 }

 return { success: true };
}

export async function logout() {
 const supabase = await createClient();
 await supabase.auth.signOut();
 redirect("/");
}
