"use client";

import { useRouter } from "next/navigation";
import { useWorkspace } from "@/app/workspace/_components/workspace-provider";
import {
  DataCard,
  Field,
  PageFrame,
  Pill,
  PrimaryButton,
  SecondaryButton,
  Select,
  TextArea,
  TextInput,
  WorkspaceModal,
} from "@/app/workspace/_components/workspace-ui";
import { buildDefaultSettings, labelForFocusType, labelForSkillLevel, planCode } from "@/utils/workspace/helpers";
import { ModalForm, toDateInput } from "@/app/workspace/_components/pages/shared";
import type { AppSettingsRow, ProfileRow, UserGoalRow } from "@/utils/workspace/types";
import { useState } from "react";

export function SettingsPage() {
  const router = useRouter();
  const { data, user, saveProfile, saveGoal, saveSettings } = useWorkspace();
  const [profileOpen, setProfileOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const settings = data!.settings ?? buildDefaultSettings(user.id);

  async function submitProfile(formData: FormData) {
    await saveProfile({
      full_name: formData.get("full_name")?.toString(),
      desired_area: formData.get("desired_area")?.toString(),
      current_level: formData.get("current_level")?.toString() as ProfileRow["current_level"],
      selected_track_id: nullable(formData.get("selected_track_id")),
    });
    setProfileOpen(false);
  }

  async function submitGoal(formData: FormData) {
    await saveGoal({
      primary_goal: formData.get("primary_goal")?.toString(),
      focus_type: formData.get("focus_type")?.toString() as UserGoalRow["focus_type"],
      hours_per_day: Number(formData.get("hours_per_day") || 2),
      days_per_week: Number(formData.get("days_per_week") || 5),
      deadline: new Date(formData.get("deadline")?.toString() || new Date()).toISOString(),
    });
    setGoalOpen(false);
  }

  async function submitSettings(formData: FormData) {
    await saveSettings({
      theme_preference:
        formData.get("theme_preference")?.toString() as AppSettingsRow["theme_preference"],
      notifications_enabled: Boolean(formData.get("notifications_enabled")),
      daily_reminder_hour: Number(formData.get("daily_reminder_hour") || 20),
    });
    setPrefsOpen(false);
  }

  return (
    <>
      <PageFrame
        title="Configurações"
        subtitle="Conta, metas, notificações e manutenção do workspace web."
      >
        <div className="workspace-split">
          <div className="workspace-stack">
            <DataCard title="Perfil" subtitle="Identidade do usuário atual.">
              <div className="workspace-stack">
                <div className="workspace-inline-banner">
                  <div>
                    <strong>{data!.profile?.full_name || user.fullName}</strong>
                    <p>{user.email}</p>
                  </div>
                  <Pill tone="primary">
                    {labelForSkillLevel(data!.profile?.current_level || "beginner")}
                  </Pill>
                </div>
                <div className="workspace-inline-banner">
                  <div>
                    <strong>{data!.goal?.primary_goal || "Meta não definida"}</strong>
                    <p>{labelForFocusType(data!.goal?.focus_type || "solid_foundation")}</p>
                  </div>
                  <Pill tone="warning">{`${data!.goal?.hours_per_day || 2}h / dia`}</Pill>
                </div>
                <div className="workspace-inline-actions">
                  <SecondaryButton onClick={() => setProfileOpen(true)}>
                    Editar conta
                  </SecondaryButton>
                  <SecondaryButton onClick={() => setGoalOpen(true)}>
                    Ajustar meta
                  </SecondaryButton>
                </div>
              </div>
            </DataCard>
            <DataCard title="Sincronização" subtitle="Estado desta versão web do sistema.">
              <div className="workspace-inline-banner">
                <div>
                  <strong>Supabase conectado</strong>
                  <p>As alterações da web escrevem nas mesmas tabelas usadas pelo Windows.</p>
                </div>
                <Pill tone="success">Online</Pill>
              </div>
            </DataCard>
          </div>

          <div className="workspace-stack">
            <DataCard title="Preferências" subtitle="Tema, lembretes e rotina diária.">
              <div className="workspace-inline-banner">
                <div>
                  <strong>Tema {settings.theme_preference}</strong>
                  <p>Preferência visual do workspace</p>
                </div>
                <Pill tone={settings.notifications_enabled ? "primary" : "neutral"}>
                  {settings.notifications_enabled ? "Alertas ativos" : "Alertas pausados"}
                </Pill>
              </div>
              <div className="workspace-inline-banner">
                <div>
                  <strong>Lembrete diário</strong>
                  <p>Horário-base para revisão da rotina</p>
                </div>
                <Pill tone="warning">
                  {`${String(settings.daily_reminder_hour ?? 20).padStart(2, "0")}:00`}
                </Pill>
              </div>
              <div className="workspace-inline-actions">
                <PrimaryButton onClick={() => setPrefsOpen(true)}>
                  Editar preferências
                </PrimaryButton>
                <SecondaryButton onClick={() => router.push("/workspace/settings/billing")}>
                  Plano e cobrança
                </SecondaryButton>
              </div>
            </DataCard>
            <DataCard title="Plano atual" subtitle="Billing compartilhado com o desktop.">
              <div className="workspace-inline-banner">
                <div>
                  <strong>Plano {planCode(data!.billing).toUpperCase()}</strong>
                  <p>
                    {data!.billing.subscription?.is_trialing
                      ? "Trial em andamento"
                      : "Gerencie cobrança e acesso premium na área dedicada."}
                  </p>
                </div>
                <Pill tone="primary">Stripe</Pill>
              </div>
            </DataCard>
          </div>
        </div>
      </PageFrame>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} onSubmit={submitProfile} />
      <GoalModal open={goalOpen} onClose={() => setGoalOpen(false)} onSubmit={submitGoal} />
      <PreferencesModal
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        onSubmit={submitSettings}
        settings={settings}
      />
    </>
  );
}

function ProfileModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const { data, user } = useWorkspace();
  return (
    <WorkspaceModal
      title="Editar conta"
      subtitle="Nome, área, nível e trilha ativa."
      open={open}
      onClose={onClose}
    >
      <ModalForm onSubmit={onSubmit}>
        <Field label="Nome">
          <TextInput name="full_name" defaultValue={data?.profile?.full_name || user.fullName} />
        </Field>
        <Field label="Área desejada">
          <TextInput name="desired_area" defaultValue={data?.profile?.desired_area || "Tecnologia"} />
        </Field>
        <Field label="Nível">
          <Select name="current_level" defaultValue={data?.profile?.current_level || "beginner"}>
            <option value="beginner">Iniciante</option>
            <option value="junior">Júnior</option>
            <option value="mid_level">Pleno</option>
            <option value="senior">Sênior</option>
          </Select>
        </Field>
        <Field label="Trilha ativa">
          <Select name="selected_track_id" defaultValue={data?.profile?.selected_track_id || ""}>
            <option value="">Sem trilha</option>
            {data?.trackBlueprints.map((item) => (
              <option key={item.track.id} value={item.track.id}>
                {item.track.name}
              </option>
            ))}
          </Select>
        </Field>
      </ModalForm>
    </WorkspaceModal>
  );
}

function GoalModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const { data } = useWorkspace();
  return (
    <WorkspaceModal
      title="Ajustar meta"
      subtitle="Objetivo principal e ritmo semanal do plano."
      open={open}
      onClose={onClose}
    >
      <ModalForm onSubmit={onSubmit}>
        <Field label="Objetivo principal">
          <TextArea name="primary_goal" rows={4} defaultValue={data?.goal?.primary_goal || ""} />
        </Field>
        <Field label="Foco">
          <Select name="focus_type" defaultValue={data?.goal?.focus_type || "solid_foundation"}>
            <option value="job">Conseguir vaga</option>
            <option value="promotion">Promoção</option>
            <option value="freelance">Freelas</option>
            <option value="solid_foundation">Base sólida</option>
            <option value="career_transition">Transição de carreira</option>
          </Select>
        </Field>
        <Field label="Horas por dia">
          <TextInput name="hours_per_day" type="number" min={1} max={12} defaultValue={data?.goal?.hours_per_day || 2} />
        </Field>
        <Field label="Dias por semana">
          <TextInput name="days_per_week" type="number" min={1} max={7} defaultValue={data?.goal?.days_per_week || 5} />
        </Field>
        <Field label="Prazo">
          <TextInput name="deadline" type="date" defaultValue={toDateInput(data?.goal?.deadline)} />
        </Field>
      </ModalForm>
    </WorkspaceModal>
  );
}

function PreferencesModal({
  open,
  onClose,
  onSubmit,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  settings: ReturnType<typeof buildDefaultSettings>;
}) {
  return (
    <WorkspaceModal
      title="Preferências"
      subtitle="Tema, alertas e lembrete diário."
      open={open}
      onClose={onClose}
    >
      <ModalForm onSubmit={onSubmit}>
        <Field label="Tema">
          <Select name="theme_preference" defaultValue={settings.theme_preference}>
            <option value="system">Sistema</option>
            <option value="dark">Escuro</option>
            <option value="light">Claro</option>
          </Select>
        </Field>
        <Field label="Lembrete diário">
          <TextInput
            name="daily_reminder_hour"
            type="number"
            min={0}
            max={23}
            defaultValue={settings.daily_reminder_hour || 20}
          />
        </Field>
        <label className="workspace-checkbox">
          <input
            name="notifications_enabled"
            type="checkbox"
            defaultChecked={settings.notifications_enabled}
          />
          <span>Notificações habilitadas</span>
        </label>
      </ModalForm>
    </WorkspaceModal>
  );
}

function nullable(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();
  return normalized ? normalized : null;
}
