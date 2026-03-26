"use client";

import { savePlanIntent } from "@/app/actions/auth";
import { usePlanIntent } from "@/store/plan-intent-store";
import { createClient } from "@/utils/supabase/client";
import { createCheckout } from "@/utils/workspace/api";
import type { BillingPlanCode } from "@/utils/workspace/types";
import { useRouter } from "next/navigation";

export function AuthTrigger({
  children,
  className,
  plan,
  target = "workspace",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  plan?: BillingPlanCode;
  target?: "workspace" | "download";
  onClick?: (event: React.MouseEvent) => void;
}) {
  const { setIntent, clearIntent } = usePlanIntent();
  const router = useRouter();

  const handleTrigger = async (event: React.MouseEvent) => {
    event.preventDefault();
    onClick?.(event);

    setIntent(plan ?? null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const authParams = new URLSearchParams();

    if (user) {
      if (plan) {
        const intentResult = await savePlanIntent(plan);
        if (intentResult?.error) {
          console.error("Failed to save plan intent:", intentResult.error);
        }

        if (plan === "free") {
          clearIntent();
          router.push("/workspace/dashboard");
          return;
        }

        try {
          const checkout = await createCheckout(supabase, plan);
          clearIntent();

          if (checkout.checkoutUrl) {
            window.location.assign(checkout.checkoutUrl);
            return;
          }

          if (checkout.managementUrl) {
            window.location.assign(checkout.managementUrl);
            return;
          }
        } catch (error) {
          if (!isExistingSubscriptionError(error)) {
            console.error("Failed to create checkout from landing CTA:", error);
          }
        }

        clearIntent();
        router.push("/workspace/settings/billing");
        return;
      }

      router.push(target === "download" ? "/download/windows" : "/workspace/dashboard");
      return;
    }

    if (plan) {
      authParams.set("plan", plan);
    }

    if (target !== "workspace") {
      authParams.set("target", target);
    }

    router.push(authParams.size ? `/auth?${authParams.toString()}` : "/auth");
  };

  return (
    <button onClick={handleTrigger} className={className}>
      {children}
    </button>
  );
}

function isExistingSubscriptionError(error: unknown) {
  const message = readErrorMessage(error).toLowerCase();
  return (
    message.includes("already active") ||
    message.includes("subscription is already active") ||
    message.includes("paid subscription")
  );
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }

  return "";
}
