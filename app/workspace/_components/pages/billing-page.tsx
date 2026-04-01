"use client";

import { Bolt, Clock3, Sparkles } from "lucide-react";
import { useWorkspace } from "@/app/workspace/_components/workspace-provider";
import { DataCard, MetricCard, PageFrame, Pill, PrimaryButton, SecondaryButton, SectionGrid } from "@/app/workspace/_components/workspace-ui";
import { billingIntervalLabel, formatCurrencyBrl, formatDateTime, planCode } from "@/utils/workspace/helpers";

export function BillingPage() {
  const {
    data,
    refreshBilling,
    createCheckout,
    openPortal,
    cancelSubscription,
    syncBilling,
  } = useWorkspace();
  const billing = data!.billing;
  const current = billing.current_plan;

  return (
    <PageFrame
      title="Plano e cobrança"
      subtitle="Assinatura, trial e recursos premium conectados ao billing oficial do seu workspace."
      actions={
        <>
          <SecondaryButton onClick={() => void refreshBilling()}>
            Atualizar snapshot
          </SecondaryButton>
          <PrimaryButton onClick={() => void syncBilling()}>
            Sincronizar status
          </PrimaryButton>
        </>
      }
    >
      <div className="workspace-stack">
        <SectionGrid columns={4}>
          <MetricCard
            label="Plano atual"
            value={(current?.code || "free").toUpperCase()}
            helper={current?.name || "Free"}
            icon={<Sparkles size={16} />}
          />
          <MetricCard
            label="Provider"
            value={billing.config.billing_provider.toUpperCase()}
            helper="Billing ativo"
            icon={<Bolt size={16} />}
          />
          <MetricCard
            label="Trial"
            value={billing.subscription?.is_trialing ? "Ativo" : "Inativo"}
            helper={billing.subscription?.trial_ends_at ? formatDateTime(billing.subscription.trial_ends_at) : "Sem trial"}
            icon={<Clock3 size={16} />}
          />
          <MetricCard
            label="Pagamentos"
            value={`${billing.payments.length}`}
            helper="Histórico recente"
            icon={<Sparkles size={16} />}
          />
        </SectionGrid>

        <DataCard title="Status da assinatura" subtitle="Snapshot atual retornado pelo RPC de billing.">
          <div className="workspace-inline-banner">
            <div>
              <strong>
                {billing.subscription
                  ? `Status ${billing.subscription.status}`
                  : "Sem assinatura premium ativa"}
              </strong>
              <p>
                {billing.subscription?.current_period_end
                  ? `Período atual até ${formatDateTime(billing.subscription.current_period_end)}`
                  : "Faça upgrade para liberar recursos premium em toda a experiência do CodeTrail."}
              </p>
            </div>
            <div className="workspace-inline-actions">
              <SecondaryButton onClick={() => void openPortal()}>
                Gerenciar assinatura
              </SecondaryButton>
              {billing.subscription && planCode(billing) !== "free" ? (
                <SecondaryButton onClick={() => void cancelSubscription()}>
                  Cancelar
                </SecondaryButton>
              ) : null}
            </div>
          </div>
        </DataCard>

        <DataCard title="Planos disponíveis" subtitle="Mesmo catálogo de billing ativo do CodeTrail.">
          <SectionGrid columns={3}>
            {billing.available_plans.map((plan) => (
              <DataCard
                key={plan.id}
                title={plan.name}
                subtitle={plan.description}
                accent={plan.code === current?.code ? "primary" : undefined}
              >
                <div className="workspace-stack">
                  <strong className="workspace-plan-price">
                    {formatCurrencyBrl(plan.price_cents)}
                    <span>{billingIntervalLabel(plan.interval)}</span>
                  </strong>
                  <div className="workspace-inline-actions">
                    {(plan.features ?? []).slice(0, 5).map((feature) => (
                      <Pill key={feature.feature_key} tone={feature.enabled ? "success" : "neutral"}>
                        {feature.feature_key}
                      </Pill>
                    ))}
                  </div>
                  <PrimaryButton
                    disabled={plan.code === current?.code}
                    onClick={() => void createCheckout(plan.code)}
                  >
                    {plan.code === current?.code ? "Plano atual" : "Assinar"}
                  </PrimaryButton>
                </div>
              </DataCard>
            ))}
          </SectionGrid>
        </DataCard>
      </div>
    </PageFrame>
  );
}
