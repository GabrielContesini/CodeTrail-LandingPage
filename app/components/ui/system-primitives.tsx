import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { BadgeCheck, CircleAlert, LoaderCircle } from "lucide-react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SurfaceTone = "solid" | "glass" | "soft";
type ButtonVariant = "primary" | "secondary" | "ghost";
type FeedbackTone = "success" | "warning" | "error" | "neutral";

export function Surface({
  children,
  className,
  tone = "solid",
}: {
  children: ReactNode;
  className?: string;
  tone?: SurfaceTone;
}) {
  const toneClass =
    tone === "glass"
      ? "glass-panel"
      : tone === "soft"
        ? "rounded-[28px] border border-border/70 bg-white/[0.03]"
        : "landing-surface";

  return <div className={cx(toneClass, className)}>{children}</div>;
}

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "border-primary/25 bg-primary/10 text-primary"
      : tone === "success"
        ? "border-success/25 bg-success/10 text-success"
        : tone === "warning"
          ? "border-warning/25 bg-warning/10 text-warning"
          : tone === "danger"
            ? "border-[rgba(255,107,122,0.28)] bg-[rgba(255,107,122,0.12)] text-[#ffb7c0]"
            : "border-border/70 bg-white/[0.03] text-text-secondary";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ActionButton({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  const variantClass =
    variant === "secondary"
      ? "landing-button landing-button--secondary"
      : variant === "ghost"
        ? "inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-border/70 hover:bg-white/[0.04] hover:text-white"
        : "landing-button landing-button--primary";

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={cx("touch-target min-h-[48px] text-sm disabled:cursor-not-allowed disabled:opacity-60", variantClass, className)}
    >
      {children}
    </button>
  );
}

export function ActionLink({
  children,
  href,
  className,
  variant = "primary",
  external = false,
  download = false,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: ButtonVariant;
  external?: boolean;
  download?: boolean;
}) {
  const variantClass =
    variant === "secondary"
      ? "landing-button landing-button--secondary"
      : variant === "ghost"
        ? "inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-border/70 hover:bg-white/[0.04] hover:text-white"
        : "landing-button landing-button--primary";
  const sharedClass = cx("touch-target inline-flex min-h-[48px] items-center justify-center gap-2.5 text-sm", variantClass, className);

  if (external || download) {
    return (
      <a href={href} className={sharedClass} download={download || undefined}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={sharedClass}>
      {children}
    </Link>
  );
}

export function FormField({
  label,
  helper,
  children,
  className,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cx("flex flex-col gap-2.5", className)}>
      <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">{label}</span>
      {children}
      {helper ? <span className="text-xs leading-relaxed text-text-tertiary">{helper}</span> : null}
    </label>
  );
}

export function FeedbackMessage({
  tone,
  title,
  message,
  className,
}: {
  tone: FeedbackTone;
  title?: string;
  message: string;
  className?: string;
}) {
  const styles = toneStyles(tone);
  return (
    <div className={cx("rounded-[24px] border px-5 py-4", styles.panel, className)}>
      <div className="flex items-start gap-3.5">
        <div className={cx("mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border", styles.iconWrap)}>
          {tone === "success" ? <BadgeCheck size={18} /> : <CircleAlert size={18} />}
        </div>
        <div className="min-w-0">
          {title ? <strong className="block text-sm font-semibold text-white">{title}</strong> : null}
          <p className={cx("m-0 text-sm leading-relaxed", title ? "mt-1" : "", styles.copy)}>{message}</p>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5", className)}>
      <div className="flex max-w-2xl flex-col gap-2.5">
        {eyebrow ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="m-0 text-3xl font-display font-medium text-white">{title}</h2>
        {subtitle ? <p className="m-0 text-sm leading-relaxed text-text-secondary sm:text-base">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}

export function LoadingState({
  title,
  message,
  className,
}: {
  title: string;
  message?: string;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col items-center justify-center gap-4 py-10 text-center sm:py-12", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
        <LoaderCircle size={22} className="animate-spin" />
      </div>
      <div className="flex flex-col gap-1">
        <strong className="font-display text-xl text-white">{title}</strong>
        {message ? <p className="m-0 text-sm leading-relaxed text-text-secondary">{message}</p> : null}
      </div>
    </div>
  );
}

function toneStyles(tone: FeedbackTone) {
  switch (tone) {
    case "success":
      return {
        panel: "border-success/25 bg-success/10",
        iconWrap: "border-success/30 bg-success/14 text-success",
        copy: "text-[#b8f3da]",
      };
    case "warning":
      return {
        panel: "border-warning/25 bg-warning/10",
        iconWrap: "border-warning/30 bg-warning/14 text-warning",
        copy: "text-[#f8ddb1]",
      };
    case "error":
      return {
        panel: "border-[rgba(255,107,122,0.28)] bg-[rgba(255,107,122,0.12)]",
        iconWrap: "border-[rgba(255,107,122,0.32)] bg-[rgba(255,107,122,0.16)] text-[#ffb7c0]",
        copy: "text-[#ffb7c0]",
      };
    case "neutral":
    default:
      return {
        panel: "border-border/70 bg-white/[0.03]",
        iconWrap: "border-border/70 bg-white/[0.05] text-white",
        copy: "text-text-secondary",
      };
  }
}
