import { createClient } from "@/utils/supabase/server";
import type { BillingCheckoutSession, BillingPlanCode } from "@/utils/workspace/types";

export async function createCheckoutSessionOnServer(
  planCode: BillingPlanCode,
  accessToken?: string | null,
) {
  const resolvedAccessToken = accessToken ?? (await readAccessTokenFromSession());
  if (!resolvedAccessToken) {
    throw new Error("Invalid JWT");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/billing-create-checkout`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resolvedAccessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planCode }),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(readServerBillingError(payload) || `Checkout failed with status ${response.status}.`);
  }

  return payload as BillingCheckoutSession;
}

function readServerBillingError(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if ("error" in payload && payload.error) {
    return String(payload.error);
  }

  if ("message" in payload && payload.message) {
    return String(payload.message);
  }

  return "";
}

async function readAccessTokenFromSession() {
  const supabase = await createClient();
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] =
    await Promise.all([
      supabase.auth.getSession(),
      supabase.auth.getUser(),
    ]);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData.user) {
    return null;
  }

  return sessionData.session?.access_token ?? null;
}
