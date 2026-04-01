"use client";

import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

export function DepthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { tiltStrength } = useLandingMotionConfig();

  if (tiltStrength === 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`h-full min-h-0 ${className ?? ""}`}>
      {children}
    </div>
  );
}