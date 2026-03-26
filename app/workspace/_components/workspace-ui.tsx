"use client";

import type { CSSProperties, ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function PageFrame({
  eyebrow = "Workspace",
  title,
  subtitle,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="workspace-frame">
      <div className="workspace-frame__flare" />
      <header className="workspace-frame__header">
        <div className="workspace-frame__copy">
          <span className="workspace-badge">{eyebrow}</span>
          <h1 className="workspace-frame__title">{title}</h1>
          <p className="workspace-frame__subtitle">{subtitle}</p>
        </div>
        {actions ? <div className="workspace-frame__actions">{actions}</div> : null}
      </header>
      <div className="workspace-frame__divider" />
      <div className="workspace-frame__body">{children}</div>
    </section>
  );
}

export function DataCard({
  title,
  subtitle,
  accent,
  actions,
  children,
  dense = false,
  className,
}: {
  title?: string;
  subtitle?: string;
  accent?: "primary" | "success" | "warning" | "danger";
  actions?: ReactNode;
  children: ReactNode;
  dense?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "workspace-card",
        dense && "workspace-card--dense",
        accent && `workspace-card--${accent}`,
        className,
      )}
    >
      {title || subtitle || actions ? (
        <header className="workspace-card__header">
          <div>
            {title ? <h2 className="workspace-card__title">{title}</h2> : null}
            {subtitle ? <p className="workspace-card__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="workspace-card__actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="workspace-card__body">{children}</div>
    </article>
  );
}

export function MetricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon?: ReactNode;
}) {
  return (
    <DataCard dense>
      <div className="workspace-metric">
        <div className="workspace-metric__icon">{icon}</div>
        <div className="workspace-metric__content">
          <span className="workspace-metric__label">{label}</span>
          <strong className="workspace-metric__value">{value}</strong>
          <span className="workspace-metric__helper">{helper}</span>
        </div>
      </div>
    </DataCard>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  return <span className={cx("workspace-pill", `workspace-pill--${tone}`)}>{children}</span>;
}

export function ProgressBar({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "success" | "warning";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="workspace-progress">
      <div
        className={cx("workspace-progress__fill", `workspace-progress__fill--${tone}`)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="workspace-empty">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {action ? <div className="workspace-empty__action">{action}</div> : null}
    </div>
  );
}

export function WorkspaceModal({
  title,
  subtitle,
  open,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="workspace-modal" role="dialog" aria-modal="true">
      <button
        className="workspace-modal__backdrop"
        aria-label="Fechar modal"
        onClick={onClose}
      />
      <div className="workspace-modal__panel">
        <header className="workspace-modal__header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="workspace-icon-button" onClick={onClose}>
            Fechar
          </button>
        </header>
        <div className="workspace-modal__content">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="workspace-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("workspace-input", props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx("workspace-textarea", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx("workspace-select", props.className)} />;
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cx("workspace-button", "workspace-button--primary", className)}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx("workspace-button", "workspace-button--secondary", className)}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cx("workspace-button", "workspace-button--ghost", className)}>
      {children}
    </button>
  );
}

export function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cx("workspace-icon-button", className)}>
      {children}
    </button>
  );
}

export function SectionGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
}) {
  const minWidthByColumns: Record<typeof columns, string> = {
    1: "100%",
    2: "240px",
    3: "190px",
    4: "150px",
  };

  return (
    <div
      className="workspace-grid"
      style={
        {
          "--workspace-grid-min": minWidthByColumns[columns],
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
