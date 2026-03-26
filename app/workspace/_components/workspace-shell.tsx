"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  ChartSpline,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  NotepadText,
  RefreshCcw,
  Settings,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  getInitials,
  navigationItems,
  planCode,
  resolveSection,
  routeMetaBySection,
} from "@/utils/workspace/helpers";
import { useWorkspace } from "@/app/workspace/_components/workspace-provider";
import { IconButton, Pill, PrimaryButton, SecondaryButton } from "@/app/workspace/_components/workspace-ui";

const icons = {
  dashboard: LayoutDashboard,
  layers: Layers3,
  timer: Activity,
  checklist: CheckSquare,
  rotate: RefreshCcw,
  folder: FolderKanban,
  notes: NotepadText,
  cards: Sparkles,
  mindmap: Map,
  analytics: ChartSpline,
  settings: Settings,
} as const;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data, user, refreshing, reload, signOut } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const section = resolveSection(pathname.split("/").filter(Boolean).slice(1));
  const meta = routeMetaBySection[section];
  const initials = getInitials(data?.profile?.full_name || user.fullName || user.email);
  const displayName = data?.profile?.full_name || user.fullName || "Seu workspace";
  const goal =
    data?.goal?.primary_goal ||
    "Defina uma meta principal para manter clareza no próximo ciclo de estudo.";
  const currentPlan = planCode(data?.billing ?? null);
  const summary = data?.dashboardSummary;
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const sidebarStats = [
    {
      label: "Horas semana",
      value: `${summary?.hoursThisWeek.toFixed(1) ?? "0.0"}h`,
    },
    {
      label: "Pendências",
      value: `${summary?.pendingTasks ?? 0}`,
    },
  ];

  return (
    <div className={cx("workspace-app", mobileNavOpen && "workspace-app--nav-open")}>
      <aside
        className={cx(
          "workspace-sidebar",
          collapsed && "workspace-sidebar--collapsed",
          mobileNavOpen && "workspace-sidebar--open",
        )}
      >
        <div className="workspace-sidebar__head">
          <div className="workspace-brand">
            <div className="workspace-brand__mark">CT</div>
            {!collapsed ? (
              <div className="workspace-brand__copy">
                <strong>CodeTrail</strong>
                <span>Workspace web</span>
              </div>
            ) : null}
          </div>
          <div className="workspace-sidebar__controls">
            <IconButton
              className="workspace-sidebar__desktop-toggle"
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </IconButton>
            <IconButton
              className="workspace-sidebar__mobile-close"
              onClick={() => setMobileNavOpen(false)}
            >
              <X size={18} />
            </IconButton>
          </div>
        </div>

        {!collapsed ? (
          <div className="workspace-sidebar__overview">
            {sidebarStats.map((item) => (
              <div key={item.label} className="workspace-sidebar__metric">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        ) : null}

        <div className="workspace-sidebar__primary">
          <PrimaryButton
            className={collapsed ? "workspace-button--icon" : undefined}
            onClick={() => {
              setMobileNavOpen(false);
              window.location.assign("/workspace/sessions");
            }}
          >
            {collapsed ? <BookOpen size={18} /> : "Nova sessão"}
          </PrimaryButton>
        </div>

        <nav className="workspace-sidebar__nav">
          {!collapsed ? <span className="workspace-sidebar__label">Navegação</span> : null}
          {navigationItems.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            const active =
              section === item.section ||
              (item.section === "settings" && section === "settings-billing");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "workspace-nav-item workspace-nav-item--active" : "workspace-nav-item"}
                title={item.label}
                onClick={() => setMobileNavOpen(false)}
              >
                <Icon size={18} />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="workspace-profile">
          <div className="workspace-profile__header">
            <div className="workspace-profile__avatar">{initials}</div>
            {!collapsed ? (
              <div className="workspace-profile__copy">
                <strong>{displayName}</strong>
                <span>{user.email}</span>
              </div>
            ) : null}
          </div>
          {!collapsed ? (
            <>
              <p className="workspace-profile__goal">{goal}</p>
              <div className="workspace-profile__footer">
                <Pill tone={currentPlan === "free" ? "neutral" : "primary"}>
                  Plano {currentPlan.toUpperCase()}
                </Pill>
                <div className="workspace-profile__actions">
                  <IconButton
                    onClick={() => {
                      setMobileNavOpen(false);
                      window.location.assign("/workspace/settings");
                    }}
                  >
                    <Settings size={16} />
                  </IconButton>
                  <IconButton onClick={() => void signOut()}>
                    <LogOut size={16} />
                  </IconButton>
                </div>
              </div>
            </>
          ) : (
            <div className="workspace-profile__compact-actions">
              <IconButton
                onClick={() => {
                  setMobileNavOpen(false);
                  window.location.assign("/workspace/settings");
                }}
              >
                <Settings size={16} />
              </IconButton>
              <IconButton onClick={() => void signOut()}>
                <LogOut size={16} />
              </IconButton>
            </div>
          )}
        </div>
      </aside>
      <button
        className="workspace-sidebar__scrim"
        aria-label="Fechar navegação"
        onClick={() => setMobileNavOpen(false)}
      />

      <main className="workspace-main">
        <div className="workspace-topbar">
          <div className="workspace-topbar__copy">
            <div className="workspace-topbar__cluster">
              <IconButton
                className="workspace-topbar__menu"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu size={18} />
              </IconButton>
              <div className="workspace-topbar__meta">
                <span className="workspace-topbar__date">{dateLabel}</span>
                <strong className="workspace-topbar__section">{meta.title}</strong>
              </div>
            </div>
            <p>{meta.subtitle}</p>
          </div>

          <div className="workspace-topbar__actions">
            <div className="workspace-topbar__status">
              <span>Consistência</span>
              <strong>{summary?.streakDays ?? 0} dias</strong>
              <p>{summary?.overdueReviews ?? 0} revisões urgentes</p>
            </div>
            <Pill tone={currentPlan === "free" ? "neutral" : "primary"}>
              <Target size={14} />
              Plano {currentPlan.toUpperCase()}
            </Pill>
            <SecondaryButton onClick={() => window.location.assign("/workspace/settings")}>
              <Settings size={16} />
              Ajustes
            </SecondaryButton>
            <PrimaryButton disabled={refreshing} onClick={() => void reload()}>
              <RefreshCcw size={16} />
              {refreshing ? "Atualizando..." : "Sincronizar"}
            </PrimaryButton>
          </div>
        </div>
        <div className="workspace-main__body">{children}</div>
      </main>
    </div>
  );
}
