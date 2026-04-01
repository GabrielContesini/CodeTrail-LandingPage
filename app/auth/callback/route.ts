import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  buildAuthErrorRedirect,
  getOAuthErrorMessage,
  parseAuthFlowTarget,
  parseAuthPlan,
} from "@/utils/auth/oauth";
import { persistPlanIntent } from "@/utils/auth/plan-intent";
import { createCheckoutSessionOnServer } from "@/utils/workspace/server-billing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const plan = parseAuthPlan(request.nextUrl.searchParams.get("plan"));
  const target = parseAuthFlowTarget(request.nextUrl.searchParams.get("target"));
  const providerError = request.nextUrl.searchParams.get("error");
  const providerErrorDescription = request.nextUrl.searchParams.get("error_description");
  const code = request.nextUrl.searchParams.get("code");

  if (providerError) {
    const destination = buildAuthErrorRedirect({
      plan,
      target,
      message: getOAuthErrorMessage(providerError, providerErrorDescription),
    });

    return NextResponse.redirect(new URL(destination, request.url), 303);
  }

  if (!code) {
    const destination = buildAuthErrorRedirect({
      plan,
      target,
      message: "Nao foi possivel validar o retorno do Google.",
    });

    return NextResponse.redirect(new URL(destination, request.url), 303);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const destination = buildAuthErrorRedirect({
      plan,
      target,
      message: getOAuthErrorMessage(exchangeError.message, providerErrorDescription),
    });

    return NextResponse.redirect(new URL(destination, request.url), 303);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const destination = buildAuthErrorRedirect({
      plan,
      target,
      message: "A sessao do Google nao pode ser restaurada. Tente novamente.",
    });

    return NextResponse.redirect(new URL(destination, request.url), 303);
  }

  if (plan) {
    try {
      await persistPlanIntent(supabase, {
        userId: user.id,
        selectedPlan: plan,
        source: "google_oauth",
        platformInterest: "web",
      });
    } catch {
      // Mantem o fluxo principal mesmo se o registro do interesse falhar.
    }
  }

  if (plan === "pro" || plan === "founding") {
    try {
      const checkout = await createCheckoutSessionOnServer(plan);
      const redirectUrl =
        checkout.checkoutUrl ??
        checkout.managementUrl ??
        "/workspace/settings/billing";

      return NextResponse.redirect(new URL(redirectUrl, request.url), 303);
    } catch (error) {
      const destination = buildAuthErrorRedirect({
        plan,
        target,
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel iniciar a assinatura agora.",
      });

      return NextResponse.redirect(new URL(destination, request.url), 303);
    }
  }

  const destination = "/workspace/dashboard";
  return NextResponse.redirect(new URL(destination, request.url), 303);
}
