"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  cancelSubscription,
  createCheckout,
  createPortalSession,
  deleteRow,
  fetchBillingSnapshot,
  loadWorkspaceData,
  syncBillingSubscription,
  upsertRow,
} from "@/utils/workspace/api";
import {
  applyFlashcardReview,
  buildDefaultSettings,
  projectCompletion,
} from "@/utils/workspace/helpers";
import type {
  AppSettingsRow,
  BillingPlanCode,
  FlashcardRow,
  MindMapRow,
  ProfileRow,
  ProjectRow,
  ProjectStepRow,
  ReviewRow,
  StudyNoteRow,
  StudySessionRow,
  TaskRow,
  UserGoalRow,
  WorkspaceContextValue,
  WorkspaceData,
  WorkspaceUser,
} from "@/utils/workspace/types";

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  initialUser,
  children,
}: {
  initialUser: WorkspaceUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      setLoading(true);
      setError(null);
      try {
        const result = await loadWorkspaceData(supabase, initialUser.id);
        if (!active) return;
        setData(result);
        setError(result.errors.length ? result.errors.join(" | ") : null);
      } catch (nextError) {
        if (!active) return;
        setError(nextError instanceof Error ? nextError.message : "Falha ao carregar.");
        setData(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [initialUser.id, supabase]);

  async function reload() {
    setRefreshing(true);
    setError(null);
    try {
      const result = await loadWorkspaceData(supabase, initialUser.id);
      setData(result);
      setError(result.errors.length ? result.errors.join(" | ") : null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha ao atualizar.");
    } finally {
      setRefreshing(false);
    }
  }

  async function runMutation(action: () => Promise<void>) {
    setRefreshing(true);
    setError(null);
    try {
      await action();
      await reload();
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : "Não foi possível salvar.";
      setError(message);
      setRefreshing(false);
      throw nextError;
    }
  }

  async function saveProfile(payload: Partial<ProfileRow>) {
    const base = data?.profile ?? defaultProfile(initialUser);
    const now = nowIso();
    const row: ProfileRow = {
      ...base,
      ...payload,
      id: initialUser.id,
      email: payload.email ?? base.email ?? initialUser.email,
      created_at: base.created_at || now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "profiles", row));
  }

  async function saveGoal(payload: Partial<UserGoalRow>) {
    const base = data?.goal ?? defaultGoal(initialUser.id, data?.profile?.desired_area);
    const now = nowIso();
    const row: UserGoalRow = {
      ...base,
      ...payload,
      id: payload.id ?? base.id,
      user_id: initialUser.id,
      created_at: base.created_at || now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "user_goals", row));
  }

  async function saveSettings(payload: Partial<AppSettingsRow>) {
    const base = data?.settings ?? buildDefaultSettings(initialUser.id);
    const now = nowIso();
    const row: AppSettingsRow = {
      ...base,
      ...payload,
      id: base.id || initialUser.id,
      user_id: initialUser.id,
      created_at: base.created_at || now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "app_settings", row));
  }

  async function saveSession(payload: Partial<StudySessionRow>) {
    const existing = data?.sessions.find((item) => item.id === payload.id);
    const now = nowIso();
    const startTime = payload.start_time ?? existing?.start_time ?? now;
    const duration =
      payload.duration_minutes ?? existing?.duration_minutes ?? 50;
    const row: StudySessionRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      track_id: payload.track_id ?? existing?.track_id ?? null,
      skill_id: payload.skill_id ?? existing?.skill_id ?? null,
      module_id: payload.module_id ?? existing?.module_id ?? null,
      type: payload.type ?? existing?.type ?? "practice",
      start_time: startTime,
      end_time:
        payload.end_time ??
        existing?.end_time ??
        new Date(new Date(startTime).getTime() + duration * 60000).toISOString(),
      duration_minutes: duration,
      notes: payload.notes ?? existing?.notes ?? "",
      productivity_score:
        payload.productivity_score ?? existing?.productivity_score ?? 4,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "study_sessions", row));
  }

  async function deleteSession(id: string) {
    await runMutation(() => deleteRow(supabase, "study_sessions", id));
  }

  async function saveTask(payload: Partial<TaskRow>) {
    const existing = data?.tasks.find((item) => item.id === payload.id);
    const now = nowIso();
    const status = payload.status ?? existing?.status ?? "pending";
    const row: TaskRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      track_id: payload.track_id ?? existing?.track_id ?? null,
      module_id: payload.module_id ?? existing?.module_id ?? null,
      title: payload.title ?? existing?.title ?? "Nova tarefa",
      description: payload.description ?? existing?.description ?? "",
      priority: payload.priority ?? existing?.priority ?? "medium",
      status,
      due_date: payload.due_date ?? existing?.due_date ?? null,
      completed_at:
        status === "completed"
          ? payload.completed_at ?? existing?.completed_at ?? now
          : null,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "tasks", row));
  }

  async function deleteTask(id: string) {
    await runMutation(() => deleteRow(supabase, "tasks", id));
  }

  async function saveReview(payload: Partial<ReviewRow>) {
    const existing = data?.reviews.find((item) => item.id === payload.id);
    const now = nowIso();
    const status = payload.status ?? existing?.status ?? "pending";
    const row: ReviewRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      session_id: payload.session_id ?? existing?.session_id ?? null,
      track_id: payload.track_id ?? existing?.track_id ?? null,
      skill_id: payload.skill_id ?? existing?.skill_id ?? null,
      title: payload.title ?? existing?.title ?? "Nova revisão",
      scheduled_for:
        payload.scheduled_for ??
        existing?.scheduled_for ??
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status,
      interval_label: payload.interval_label ?? existing?.interval_label ?? "D+1",
      notes: payload.notes ?? existing?.notes ?? null,
      completed_at:
        status === "completed"
          ? payload.completed_at ?? existing?.completed_at ?? now
          : null,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "reviews", row));
  }

  async function deleteReview(id: string) {
    await runMutation(() => deleteRow(supabase, "reviews", id));
  }

  async function saveProject(payload: Partial<ProjectRow>) {
    const existing = data?.projects.find((item) => item.id === payload.id);
    const now = nowIso();
    const row: ProjectRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      track_id: payload.track_id ?? existing?.track_id ?? null,
      title: payload.title ?? existing?.title ?? "Novo projeto",
      scope: payload.scope ?? existing?.scope ?? "Entrega prática",
      description: payload.description ?? existing?.description ?? "",
      repository_url: payload.repository_url ?? existing?.repository_url ?? null,
      documentation_url:
        payload.documentation_url ?? existing?.documentation_url ?? null,
      video_url: payload.video_url ?? existing?.video_url ?? null,
      status: payload.status ?? existing?.status ?? "planned",
      progress_percent:
        payload.progress_percent ?? existing?.progress_percent ?? 0,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "projects", row));
  }

  async function deleteProject(id: string) {
    await runMutation(() => deleteRow(supabase, "projects", id));
  }

  async function saveProjectStep(payload: Partial<ProjectStepRow>) {
    const existing = data?.projectSteps.find((item) => item.id === payload.id);
    const projectId = payload.project_id ?? existing?.project_id;
    if (!projectId) {
      throw new Error("Etapa sem projeto associado.");
    }

    const now = nowIso();
    const row: ProjectStepRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      project_id: projectId,
      title: payload.title ?? existing?.title ?? "Nova etapa",
      description: payload.description ?? existing?.description ?? "",
      is_done: payload.is_done ?? existing?.is_done ?? false,
      sort_order:
        payload.sort_order ??
        existing?.sort_order ??
        (data?.projectSteps.filter((item) => item.project_id === projectId).length ?? 0) + 1,
      completed_at:
        payload.is_done ?? existing?.is_done
          ? payload.completed_at ?? existing?.completed_at ?? now
          : null,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };

    const mergedSteps = [
      ...(data?.projectSteps ?? []).filter((item) => item.project_id === projectId && item.id !== row.id),
      row,
    ];

    await runMutation(async () => {
      await upsertRow(supabase, "project_steps", row);
      await syncProjectProgress(projectId, mergedSteps);
    });
  }

  async function deleteProjectStep(id: string) {
    const step = data?.projectSteps.find((item) => item.id === id);
    await runMutation(async () => {
      await deleteRow(supabase, "project_steps", id);
      if (!step) return;
      await syncProjectProgress(
        step.project_id,
        (data?.projectSteps ?? []).filter((item) => item.id !== id),
      );
    });
  }

  async function syncProjectProgress(projectId: string, steps: ProjectStepRow[]) {
    const project = data?.projects.find((item) => item.id === projectId);
    if (!project) return;
    await upsertRow(supabase, "projects", {
      ...project,
      progress_percent: projectCompletion({
        project,
        steps: steps.filter((item) => item.project_id === projectId),
      }),
      updated_at: nowIso(),
    });
  }

  async function saveNote(payload: Partial<StudyNoteRow>) {
    const existing = data?.notes.find((item) => item.id === payload.id);
    const now = nowIso();
    const row: StudyNoteRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      folder_name: payload.folder_name ?? existing?.folder_name ?? "Geral",
      title: payload.title ?? existing?.title ?? "Nova nota",
      content: payload.content ?? existing?.content ?? "",
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "study_notes", row));
  }

  async function deleteNote(id: string) {
    await runMutation(() => deleteRow(supabase, "study_notes", id));
  }

  async function saveFlashcard(payload: Partial<FlashcardRow>) {
    const existing = data?.flashcards.find((item) => item.id === payload.id);
    const now = nowIso();
    const row: FlashcardRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      deck_name: payload.deck_name ?? existing?.deck_name ?? "Geral",
      question: payload.question ?? existing?.question ?? "Nova pergunta",
      answer: payload.answer ?? existing?.answer ?? "",
      track_id: payload.track_id ?? existing?.track_id ?? null,
      module_id: payload.module_id ?? existing?.module_id ?? null,
      project_id: payload.project_id ?? existing?.project_id ?? null,
      due_at: payload.due_at ?? existing?.due_at ?? now,
      last_reviewed_at: payload.last_reviewed_at ?? existing?.last_reviewed_at ?? null,
      review_count: payload.review_count ?? existing?.review_count ?? 0,
      correct_streak: payload.correct_streak ?? existing?.correct_streak ?? 0,
      ease_factor: payload.ease_factor ?? existing?.ease_factor ?? 2.3,
      interval_days: payload.interval_days ?? existing?.interval_days ?? 0,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "flashcards", row));
  }

  async function deleteFlashcard(id: string) {
    await runMutation(() => deleteRow(supabase, "flashcards", id));
  }

  async function saveMindMap(payload: Partial<MindMapRow>) {
    const existing = data?.mindMaps.find((item) => item.id === payload.id);
    const now = nowIso();
    const row: MindMapRow = {
      id: payload.id ?? existing?.id ?? randomId(),
      user_id: initialUser.id,
      folder_name: payload.folder_name ?? existing?.folder_name ?? "Geral",
      title: payload.title ?? existing?.title ?? "Novo mapa",
      content_json: payload.content_json ?? existing?.content_json ?? "{}",
      track_id: payload.track_id ?? existing?.track_id ?? null,
      module_id: payload.module_id ?? existing?.module_id ?? null,
      project_id: payload.project_id ?? existing?.project_id ?? null,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    await runMutation(() => upsertRow(supabase, "mind_maps", row));
  }

  async function deleteMindMap(id: string) {
    await runMutation(() => deleteRow(supabase, "mind_maps", id));
  }

  async function reviewFlashcard(
    flashcard: FlashcardRow,
    grade: "again" | "hard" | "good" | "easy",
  ) {
    const updated = applyFlashcardReview(flashcard, grade);
    await runMutation(() => upsertRow(supabase, "flashcards", updated));
  }

  async function refreshBilling() {
    setRefreshing(true);
    setError(null);
    try {
      const billing = await fetchBillingSnapshot(supabase);
      setData((current) =>
        current
          ? {
              ...current,
              billing,
              featureAccess: current.featureAccess,
            }
          : current,
      );
      await reload();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha no billing.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCheckout(planCode: BillingPlanCode) {
    setRefreshing(true);
    setError(null);
    try {
      const response = await createCheckout(supabase, planCode);
      if (response.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
        return;
      }
      if (response.managementUrl) {
        window.location.assign(response.managementUrl);
        return;
      }
      await reload();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha no checkout.");
      throw nextError;
    } finally {
      setRefreshing(false);
    }
  }

  async function openPortal() {
    setRefreshing(true);
    setError(null);
    try {
      const url = await createPortalSession(supabase);
      window.location.assign(url);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha no portal.");
      throw nextError;
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCancelSubscription() {
    setRefreshing(true);
    setError(null);
    try {
      await cancelSubscription(supabase);
      await reload();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha ao cancelar.");
      throw nextError;
    } finally {
      setRefreshing(false);
    }
  }

  async function syncBilling() {
    setRefreshing(true);
    setError(null);
    try {
      await syncBillingSubscription(supabase);
      await reload();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha ao sincronizar.");
      throw nextError;
    } finally {
      setRefreshing(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  const value: WorkspaceContextValue = {
    user: initialUser,
    data,
    loading,
    refreshing,
    error,
    modalOpen,
    setModalOpen,
    reload,
    saveProfile,
    saveGoal,
    saveSettings,
    saveSession,
    deleteSession,
    saveTask,
    deleteTask,
    saveReview,
    deleteReview,
    saveProject,
    deleteProject,
    saveProjectStep,
    deleteProjectStep,
    saveNote,
    deleteNote,
    saveFlashcard,
    deleteFlashcard,
    saveMindMap,
    deleteMindMap,
    reviewFlashcard,
    refreshBilling,
    createCheckout: handleCheckout,
    openPortal,
    cancelSubscription: handleCancelSubscription,
    syncBilling,
    signOut,
  };

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("WorkspaceProvider não encontrado.");
  }
  return context;
}

function randomId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function defaultProfile(user: WorkspaceUser): ProfileRow {
  const now = nowIso();
  return {
    id: user.id,
    full_name: user.fullName || "Seu workspace",
    email: user.email,
    desired_area: "Tecnologia",
    current_level: "beginner",
    onboarding_completed: false,
    selected_track_id: null,
    created_at: now,
    updated_at: now,
  };
}

function defaultGoal(userId: string, desiredArea = "Tecnologia"): UserGoalRow {
  const now = nowIso();
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 90);
  return {
    id: userId,
    user_id: userId,
    primary_goal: "Construir consistência semanal",
    desired_area: desiredArea,
    focus_type: "solid_foundation",
    hours_per_day: 2,
    days_per_week: 5,
    deadline: deadline.toISOString(),
    current_level: "beginner",
    generated_plan:
      "Plano semanal ajustado para ganhar ritmo, constância e prática real.",
    created_at: now,
    updated_at: now,
  };
}
