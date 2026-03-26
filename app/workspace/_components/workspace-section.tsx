"use client";

import { LoaderCircle } from "lucide-react";
import type { WorkspaceSectionKey } from "@/utils/workspace/types";
import { useWorkspace } from "@/app/workspace/_components/workspace-provider";
import { PageFrame } from "@/app/workspace/_components/workspace-ui";
import { DashboardPage } from "@/app/workspace/_components/pages/dashboard-page";
import { TracksPage } from "@/app/workspace/_components/pages/tracks-page";
import { SessionsPage } from "@/app/workspace/_components/pages/sessions-page";
import { TasksPage } from "@/app/workspace/_components/pages/tasks-page";
import { ReviewsPage } from "@/app/workspace/_components/pages/reviews-page";
import { ProjectsPage } from "@/app/workspace/_components/pages/projects-page";
import { NotesPage } from "@/app/workspace/_components/pages/notes-page";
import { FlashcardsPage } from "@/app/workspace/_components/pages/flashcards-page";
import { MindMapsPage } from "@/app/workspace/_components/pages/mindmaps-page";
import { AnalyticsPage } from "@/app/workspace/_components/pages/analytics-page";
import { SettingsPage } from "@/app/workspace/_components/pages/settings-page";
import { BillingPage } from "@/app/workspace/_components/pages/billing-page";

export function WorkspaceSection({ section }: { section: WorkspaceSectionKey }) {
  const { data, loading, error } = useWorkspace();

  if (loading) {
    return (
      <PageFrame
        title="Carregando workspace"
        subtitle="Sincronizando o app web com o mesmo backend do Windows."
      >
        <div className="workspace-loading">
          <LoaderCircle className="animate-spin" size={28} />
          <span>Carregando dados do Supabase...</span>
        </div>
      </PageFrame>
    );
  }

  if (!data) {
    return (
      <PageFrame
        title="Workspace indisponível"
        subtitle="Não foi possível montar o app web com os dados atuais."
      >
        <div className="workspace-error">{error || "Falha ao carregar."}</div>
      </PageFrame>
    );
  }

  if (section === "dashboard") return <DashboardPage />;
  if (section === "tracks") return <TracksPage />;
  if (section === "sessions") return <SessionsPage />;
  if (section === "tasks") return <TasksPage />;
  if (section === "reviews") return <ReviewsPage />;
  if (section === "projects") return <ProjectsPage />;
  if (section === "notes") return <NotesPage />;
  if (section === "flashcards") return <FlashcardsPage />;
  if (section === "mind-maps") return <MindMapsPage />;
  if (section === "analytics") return <AnalyticsPage />;
  if (section === "settings") return <SettingsPage />;
  return <BillingPage />;
}
