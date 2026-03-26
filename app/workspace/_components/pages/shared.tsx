"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useWorkspace } from "@/app/workspace/_components/workspace-provider";
import {
  EmptyState,
  PageFrame,
  PrimaryButton,
  ProgressBar,
} from "@/app/workspace/_components/workspace-ui";

export function QuickAction({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <button className="workspace-quick-action" onClick={() => window.location.assign(href)}>
      <div className="workspace-quick-action__icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </button>
  );
}

export function PriorityRow({
  icon,
  title,
  subtitle,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
}) {
  return (
    <div className="workspace-priority-row">
      <div className="workspace-priority-row__icon">{icon}</div>
      <div className="workspace-priority-row__copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="workspace-priority-row__value">{value}</div>
    </div>
  );
}

export function SnapshotTile({
  title,
  value,
  helper,
}: {
  title: string;
  value: number;
  helper?: string;
}) {
  return (
    <div className="workspace-snapshot">
      <div className="workspace-snapshot__head">
        <strong>{title}</strong>
        <span>{helper || `${value.toFixed(0)}%`}</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}

export function QueuePanel({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: Array<{ title: string; subtitle: string }>;
}) {
  return (
    <div className="workspace-queue">
      <strong>{title}</strong>
      {items.length ? (
        <div className="workspace-stack">
          {items.map((item) => (
            <div key={`${item.title}-${item.subtitle}`} className="workspace-queue__item">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="workspace-copy-muted">{emptyLabel}</p>
      )}
    </div>
  );
}

export function MiniChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return data.length ? (
    <div className="workspace-chart">
      {data.map((item) => (
        <div key={item.label} className="workspace-chart__bar">
          <span>{item.label}</span>
          <div>
            <i style={{ height: `${(item.value / max) * 100}%` }} />
          </div>
          <strong>{item.value.toFixed(1)}h</strong>
        </div>
      ))}
    </div>
  ) : (
    <EmptyState
      title="Sem amostras suficientes"
      subtitle="Registre mais sessões para liberar estes gráficos."
    />
  );
}

export function LockedFeaturePage({
  title,
  feature,
}: {
  title: string;
  feature: string;
}) {
  const { createCheckout } = useWorkspace();
  return (
    <PageFrame
      title={feature}
      subtitle="Este módulo está conectado ao billing do produto principal."
    >
      <EmptyState
        title={title}
        subtitle="Faça upgrade para o plano Pro e liberar esse recurso também na web."
        action={
          <PrimaryButton onClick={() => void createCheckout("pro")}>
            <Sparkles size={16} />
            Fazer upgrade
          </PrimaryButton>
        }
      />
    </PageFrame>
  );
}

export function ModalForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="workspace-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
          await onSubmit(new FormData(event.currentTarget));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {children}
      <div className="workspace-modal__actions">
        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </PrimaryButton>
      </div>
    </form>
  );
}

export function nullable(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();
  return normalized ? normalized : null;
}

export function nullableDate(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();
  return normalized ? new Date(normalized).toISOString() : null;
}

export function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function toDateInput(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}
