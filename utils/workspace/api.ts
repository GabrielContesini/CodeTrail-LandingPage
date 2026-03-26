import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildDefaultSettings,
  composeWorkspaceData,
  emptyBillingSnapshot,
  featureAccess,
} from "@/utils/workspace/helpers";
import type {
  AppSettingsRow,
  BillingCheckoutSession,
  BillingPlanCode,
  BillingSnapshot,
  FlashcardRow,
  MindMapRow,
  ProfileRow,
  ProjectRow,
  ProjectStepRow,
  ReviewRow,
  StudyModuleRow,
  StudyNoteRow,
  StudySessionRow,
  StudySkillRow,
  StudyTrackRow,
  TaskRow,
  UserGoalRow,
  UserSkillProgressRow,
  WorkspaceLoadResult,
} from "@/utils/workspace/types";

export async function loadWorkspaceData(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceLoadResult> {
  const errors: string[] = [];
  const billing = await fetchBillingSnapshot(supabase).catch((error: unknown) => {
    errors.push(errorMessage(error));
    return emptyBillingSnapshot();
  });
  const access = featureAccess(billing);

  const [
    profile,
    goal,
    tracks,
    skills,
    progress,
    modules,
    sessions,
    tasks,
    reviews,
    projects,
    projectSteps,
    notes,
    settings,
    flashcards,
    mindMaps,
  ] = await Promise.all([
    maybeSingle<ProfileRow>(
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      errors,
      "profiles",
    ),
    maybeSingle<UserGoalRow>(
      supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      errors,
      "user_goals",
    ),
    listRows<StudyTrackRow>(
      supabase.from("study_tracks").select("*").order("updated_at"),
      errors,
      "study_tracks",
    ),
    listRows<StudySkillRow>(
      supabase.from("study_skills").select("*").order("sort_order"),
      errors,
      "study_skills",
    ),
    listRows<UserSkillProgressRow>(
      supabase
        .from("user_skill_progress")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      errors,
      "user_skill_progress",
    ),
    listRows<StudyModuleRow>(
      supabase.from("study_modules").select("*").order("sort_order"),
      errors,
      "study_modules",
    ),
    listRows<StudySessionRow>(
      supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("start_time", { ascending: false }),
      errors,
      "study_sessions",
    ),
    listRows<TaskRow>(
      supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("updated_at", { ascending: false }),
      errors,
      "tasks",
    ),
    listRows<ReviewRow>(
      supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .order("scheduled_for", { ascending: true }),
      errors,
      "reviews",
    ),
    listRows<ProjectRow>(
      supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      errors,
      "projects",
    ),
    listRows<ProjectStepRow>(
      supabase.from("project_steps").select("*").order("sort_order"),
      errors,
      "project_steps",
    ),
    listRows<StudyNoteRow>(
      supabase
        .from("study_notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      errors,
      "study_notes",
    ),
    maybeSingle<AppSettingsRow>(
      supabase.from("app_settings").select("*").eq("user_id", userId).maybeSingle(),
      errors,
      "app_settings",
    ),
    access.flashcards
      ? listRows<FlashcardRow>(
          supabase
            .from("flashcards")
            .select("*")
            .eq("user_id", userId)
            .order("due_at", { ascending: true }),
          errors,
          "flashcards",
        )
      : Promise.resolve([]),
    access.mindMaps
      ? listRows<MindMapRow>(
          supabase
            .from("mind_maps")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false }),
          errors,
          "mind_maps",
        )
      : Promise.resolve([]),
  ]);

  return {
    ...composeWorkspaceData({
      profile,
      goal,
      tracks,
      skills,
      progress,
      modules,
      sessions,
      tasks,
      reviews,
      projects,
      projectSteps,
      notes,
      flashcards,
      mindMaps,
      settings: settings ?? buildDefaultSettings(userId),
      billing,
    }),
    errors,
  };
}

export async function upsertRow<T>(
  supabase: SupabaseClient,
  table: string,
  payload: T,
) {
  const { error } = await supabase.from(table).upsert(payload as never);
  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteRow(
  supabase: SupabaseClient,
  table: string,
  id: string,
) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchBillingSnapshot(
  supabase: SupabaseClient,
): Promise<BillingSnapshot> {
  const { data, error } = await supabase.rpc("get_my_billing_snapshot");
  if (error) {
    throw new Error(error.message);
  }

  return (data as BillingSnapshot | null) ?? emptyBillingSnapshot();
}

export async function createCheckout(
  supabase: SupabaseClient,
  planCode: BillingPlanCode,
) {
  const { data, error } = await supabase.functions.invoke("billing-create-checkout", {
    body: { planCode },
  });
  if (error) {
    throw new Error(extractFunctionError(error));
  }
  return data as BillingCheckoutSession;
}

export async function createPortalSession(supabase: SupabaseClient) {
  const { data, error } = await supabase.functions.invoke(
    "billing-create-portal-session",
    {
      body: {},
    },
  );
  if (error) {
    throw new Error(extractFunctionError(error));
  }
  const url = (data as { url?: string } | null)?.url;
  if (!url) {
    throw new Error("Resposta inválida ao criar sessão do portal.");
  }
  return url;
}

export async function cancelSubscription(supabase: SupabaseClient) {
  const { data, error } = await supabase.functions.invoke(
    "billing-cancel-subscription",
    {
      body: {},
    },
  );
  if (error) {
    throw new Error(extractFunctionError(error));
  }
  const snapshot = (data as { snapshot?: BillingSnapshot } | null)?.snapshot;
  if (!snapshot) {
    throw new Error("Resposta inválida ao cancelar assinatura.");
  }
  return snapshot;
}

export async function syncBillingSubscription(supabase: SupabaseClient) {
  const { data, error } = await supabase.functions.invoke("billing-sync-subscription", {
    body: {},
  });
  if (error) {
    throw new Error(extractFunctionError(error));
  }
  const snapshot = (data as { snapshot?: BillingSnapshot } | null)?.snapshot;
  if (!snapshot) {
    throw new Error("Resposta inválida ao sincronizar assinatura.");
  }
  return snapshot;
}

async function listRows<T>(
  query: PromiseLike<{
    data: T[] | null;
    error: { message: string } | null;
  }>,
  errors: string[],
  label: string,
) {
  const { data, error } = await query;
  if (error) {
    errors.push(`${label}: ${error.message}`);
    return [];
  }
  return data ?? [];
}

async function maybeSingle<T>(
  query: PromiseLike<{
    data: T | null;
    error: { message: string } | null;
  }>,
  errors: string[],
  label: string,
) {
  const { data, error } = await query;
  if (error) {
    errors.push(`${label}: ${error.message}`);
    return null;
  }
  return data;
}

function extractFunctionError(error: unknown) {
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }
  return "Falha ao executar a operação.";
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Erro inesperado ao carregar o workspace.";
}
