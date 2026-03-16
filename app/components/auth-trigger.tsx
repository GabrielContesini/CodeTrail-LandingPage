"use client";

import { usePlanIntent } from "@/store/plan-intent-store";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function AuthTrigger({
 children,
 className,
 plan,
 onClick
}: {
 children: React.ReactNode;
 className?: string;
 plan?: "free" | "pro" | "founding";
 onClick?: (e: React.MouseEvent) => void;
}) {
 const { setIntent } = usePlanIntent();
 const supabase = createClient();
 const router = useRouter();

 const handleTrigger = async (e: React.MouseEvent) => {
  e.preventDefault();
  if (onClick) onClick(e);

  if (plan) {
   setIntent(plan);
  } else {
   setIntent(null);
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
   router.push("/download/windows");
  } else {
   router.push("/auth");
  }
 };

 return (
  <button onClick={handleTrigger} className={className}>
   {children}
  </button>
 );
}
