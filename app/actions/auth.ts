"use server";

import { createClient } from "@/utils/supabase/server";
import { createCheckoutSessionOnServer } from "@/utils/workspace/server-billing";
import type { BillingPlanCode } from "@/utils/workspace/types";
import { redirect } from "next/navigation";

function getAuthError(error: Error | unknown) {
 const msg = error instanceof Error ? error.message : "";
 if (msg.includes("Missing Supabase environment configuration")) {
  return "A autenticacao nao esta configurada neste ambiente ainda.";
 }
 if (msg.includes("Invalid login credentials")) return "Credenciais incorretas (E-mail ou Senha).";
 if (msg.includes("User already registered")) return "Este e-mail já está sendo utilizado.";
 if (msg.includes("Password should be at least")) return "A senha deve ter no mínimo 6 caracteres.";
 if (msg.includes("rate limit")) return "Muitas tentativas em pouco tempo. Aguarde um momento.";
 if (msg.includes("Email not confirmed")) return "Verifique sua caixa de e-mail para validar a conta antes de entrar.";
 return "Falha de comunicação com os servidores. Verifique sua conexão e tente novamente.";
}

export async function login(formData: FormData) {
 try {
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
 } catch (error) {
  return { error: getAuthError(error) };
 }
}

export async function loginAndContinue(
 formData: FormData,
 options?: {
  selectedPlan?: string | null
  target?: "workspace"
 }
) {
 let supabase: Awaited<ReturnType<typeof createClient>>;

 try {
  supabase = await createClient();
 } catch (error) {
  return { error: getAuthError(error) };
 }

 const email = formData.get("email") as string;
 const password = formData.get("password") as string;

 const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
 });

 if (error) {
  return { error: getAuthError(error) };
 }

 const selectedPlan = parsePlanCode(options?.selectedPlan ?? null);
 if (selectedPlan) {
  const intentResult = await persistPlanIntent(supabase, selectedPlan);
  if (intentResult?.error) {
   return intentResult;
  }
 }

 if (selectedPlan === "pro" || selectedPlan === "founding") {
  let checkout;

  try {
   checkout = await createCheckoutSessionOnServer(
    selectedPlan,
    data.session?.access_token ?? null,
   );
  } catch (error) {
   return {
    error: error instanceof Error ? error.message : "Nao foi possivel iniciar a assinatura agora.",
   };
  }

  if (checkout.checkoutUrl) {
   redirect(checkout.checkoutUrl);
  }

  if (checkout.managementUrl) {
   redirect(checkout.managementUrl);
  }

  redirect("/workspace/settings/billing");
 }

 if (selectedPlan === "free") {
  redirect("/workspace/dashboard");
 }

 redirect("/workspace/dashboard");
}

export async function signup(formData: FormData) {
 try {
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
 } catch (error) {
  return { error: getAuthError(error) };
 }
}

export async function savePlanIntent(selectedPlan: string) {
 try {
  const supabase = await createClient();
  return await persistPlanIntent(supabase, selectedPlan);
 } catch (error) {
  return { error: getAuthError(error) };
 }
}

export async function logout() {
 const supabase = await createClient();
 await supabase.auth.signOut();
 redirect("/");
}

async function persistPlanIntent(supabase: Awaited<ReturnType<typeof createClient>>, selectedPlan: string) {
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
     platform_interest: "web",
     status: "interested",
   });

  if (error) {
   if (error.message.includes("Could not find the table") || error.code === '42P01') {
    return { success: true, warning: "Table plan_intents not found" };
   }
   return { error: error.message };
  }
 }

 return { success: true };
}

function parsePlanCode(selectedPlan: string | null): BillingPlanCode | null {
 if (selectedPlan === "free" || selectedPlan === "pro" || selectedPlan === "founding") {
  return selectedPlan;
 }

 return null;
}
