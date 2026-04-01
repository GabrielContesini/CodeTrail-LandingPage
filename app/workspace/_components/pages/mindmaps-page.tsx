"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Link2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useWorkspace } from "@/app/workspace/_components/workspace-provider";
import {
  DataCard,
  EmptyState,
  Field,
  GhostButton,
  PageFrame,
  PrimaryButton,
  Select,
  TextInput,
  WorkspaceModal,
} from "@/app/workspace/_components/workspace-ui";
import { colorFromHex, decodeMindMap, encodeMindMap, initialMindMapDocument } from "@/utils/workspace/helpers";
import { LockedFeaturePage, ModalForm } from "@/app/workspace/_components/pages/shared";
import type { MindMapDocument, MindMapRow, ProjectBundle, TrackBlueprint } from "@/utils/workspace/types";

export function MindMapsPage() {
  const { data, saveMindMap, deleteMindMap } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MindMapRow | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(data!.mindMaps[0]?.id ?? null);
  const [draftState, setDraftState] = useState<{
    mapId: string | null;
    document: MindMapDocument | null;
  }>({
    mapId: data!.mindMaps[0]?.id ?? null,
    document: data!.mindMaps[0]
      ? decodeMindMap(data!.mindMaps[0].content_json, data!.mindMaps[0].title)
      : null,
  });
  const [nodeState, setNodeState] = useState<{
    mapId: string | null;
    nodeId: string | null;
  }>({
    mapId: data!.mindMaps[0]?.id ?? null,
    nodeId: data!.mindMaps[0]
      ? decodeMindMap(data!.mindMaps[0].content_json, data!.mindMaps[0].title).nodes[0]?.id ??
        null
      : null,
  });
  const selected = data!.mindMaps.find((item) => item.id === selectedId) ?? data!.mindMaps[0] ?? null;
  const draft =
    draftState.mapId === selected?.id
      ? draftState.document
      : selected
        ? decodeMindMap(selected.content_json, selected.title)
        : null;
  const selectedNodeId =
    nodeState.mapId === selected?.id
      ? nodeState.nodeId
      : draft?.nodes[0]?.id ?? null;

  if (!data!.featureAccess.mindMaps) {
    return <LockedFeaturePage title="Mind maps premium bloqueados" feature="Mind Maps" />;
  }

  async function handleSubmit(formData: FormData) {
    await saveMindMap({
      id: editing?.id,
      folder_name: formData.get("folder_name")?.toString(),
      title: formData.get("title")?.toString(),
      content_json:
        editing?.content_json ??
        encodeMindMap(initialMindMapDocument(formData.get("title")?.toString() || "Tema central")),
      track_id: nullable(formData.get("track_id")),
      module_id: nullable(formData.get("module_id")),
      project_id: nullable(formData.get("project_id")),
    });
    setEditing(null);
    setOpen(false);
  }

  async function persistDraft() {
    if (!selected || !draft) return;
    await saveMindMap({
      id: selected.id,
      folder_name: selected.folder_name,
      title: selected.title,
      content_json: encodeMindMap(draft),
      track_id: selected.track_id,
      module_id: selected.module_id,
      project_id: selected.project_id,
    });
  }

  function selectedNode() {
    return draft?.nodes.find((item) => item.id === selectedNodeId) ?? null;
  }

  function commitDraft(nextDraft: MindMapDocument, nextNodeId = selectedNodeId) {
    setDraftState({ mapId: selected?.id ?? null, document: nextDraft });
    setNodeState({ mapId: selected?.id ?? null, nodeId: nextNodeId ?? null });
  }

  function addNode(linkToSelected: boolean) {
    if (!draft) return;
    const base = selectedNode() ?? draft.nodes[0];
    const nextId = crypto.randomUUID();
    const node = {
      id: nextId,
      label: "Novo conceito",
      shape: "rectangle" as const,
      colorHex: base?.colorHex || "#2EC5FF",
      x: (base?.x ?? 220) + 220,
      y: (base?.y ?? 240) + 40,
      width: 200,
      height: 96,
    };
    commitDraft({
      nodes: [...draft.nodes, node],
      connections:
        linkToSelected && base
          ? [...draft.connections, { id: crypto.randomUUID(), sourceId: base.id, targetId: node.id }]
          : draft.connections,
    }, nextId);
  }

  function moveNode(direction: "up" | "down" | "left" | "right") {
    if (!draft || !selectedNodeId) return;
    commitDraft({
      ...draft,
      nodes: draft.nodes.map((node) => {
        if (node.id !== selectedNodeId) return node;
        return {
          ...node,
          x: direction === "left" ? node.x - 24 : direction === "right" ? node.x + 24 : node.x,
          y: direction === "up" ? node.y - 24 : direction === "down" ? node.y + 24 : node.y,
        };
      }),
    });
  }

  function updateNodeLabel(label: string) {
    if (!draft || !selectedNodeId) return;
    commitDraft({
      ...draft,
      nodes: draft.nodes.map((node) =>
        node.id === selectedNodeId ? { ...node, label } : node,
      ),
    });
  }

  function removeSelectedNode() {
    if (!draft || !selectedNodeId || draft.nodes.length <= 1) return;
    const nextNodes = draft.nodes.filter((node) => node.id !== selectedNodeId);
    commitDraft({
      nodes: nextNodes,
      connections: draft.connections.filter(
        (item) => item.sourceId !== selectedNodeId && item.targetId !== selectedNodeId,
      ),
    }, nextNodes[0]?.id ?? null);
  }

  return (
    <>
      <PageFrame
        title="Mind Maps"
        subtitle="Canvas visual para conectar conceitos, módulos e projetos no mesmo fluxo do workspace."
        actions={
          <PrimaryButton
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={16} />
            Novo mapa
          </PrimaryButton>
        }
      >
        <div className="workspace-split">
          <DataCard title="Biblioteca de boards" subtitle="Mapas mentais disponíveis.">
            {data!.mindMaps.length ? (
              <div className="workspace-stack">
                {data!.mindMaps.map((map) => (
                  <button
                    key={map.id}
                    className={
                      map.id === selected?.id
                        ? "workspace-list-item workspace-list-item--active"
                        : "workspace-list-item"
                    }
                    onClick={() => setSelectedId(map.id)}
                  >
                    <div>
                      <strong>{map.title}</strong>
                      <span>{map.folder_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sem mapas ainda"
                subtitle="Crie um board para ligar conceitos, módulos e dependências."
              />
            )}
          </DataCard>

          {selected && draft ? (
            <div className="workspace-stack">
              <DataCard
                title={selected.title}
                subtitle={`${draft.nodes.length} nó(s) • ${draft.connections.length} conexão(ões)`}
                actions={
                  <>
                    <PrimaryButton onClick={() => void persistDraft()}>
                      <Save size={16} />
                      Salvar canvas
                    </PrimaryButton>
                    <GhostButton onClick={() => void deleteMindMap(selected.id)}>
                      <Trash2 size={16} />
                    </GhostButton>
                  </>
                }
              >
                <div className="workspace-inline-actions">
                  <PrimaryButton onClick={() => addNode(false)}>
                    <Plus size={16} />
                    Novo nó
                  </PrimaryButton>
                  <PrimaryButton onClick={() => addNode(true)}>
                    <Link2 size={16} />
                    Adicionar ligado
                  </PrimaryButton>
                  <GhostButton onClick={removeSelectedNode}>
                    <Trash2 size={16} />
                    Remover nó
                  </GhostButton>
                </div>
                <div className="workspace-canvas">
                  <svg className="workspace-canvas__lines" viewBox="0 0 1600 900">
                    {draft.connections.map((connection) => {
                      const source = draft.nodes.find((item) => item.id === connection.sourceId);
                      const target = draft.nodes.find((item) => item.id === connection.targetId);
                      if (!source || !target) return null;
                      return (
                        <path
                          key={connection.id}
                          d={`M ${source.x + source.width / 2} ${source.y + source.height / 2} C ${source.x + 180} ${source.y + source.height / 2}, ${target.x - 180} ${target.y + target.height / 2}, ${target.x + target.width / 2} ${target.y + target.height / 2}`}
                        />
                      );
                    })}
                  </svg>
                  {draft.nodes.map((node) => (
                    <button
                      key={node.id}
                      className={
                        node.id === selectedNodeId
                          ? "workspace-node workspace-node--active"
                          : "workspace-node"
                      }
                      style={{
                        left: node.x,
                        top: node.y,
                        width: node.width,
                        height: node.height,
                        background: colorFromHex(node.colorHex),
                      }}
                      onClick={() =>
                        setNodeState({ mapId: selected?.id ?? null, nodeId: node.id })
                      }
                    >
                      {node.label}
                    </button>
                  ))}
                </div>
              </DataCard>
              <DataCard title="Inspector" subtitle="Edição rápida do nó selecionado.">
                {selectedNode() ? (
                  <div className="workspace-stack">
                    <Field label="Título do nó">
                      <TextInput
                        value={selectedNode()?.label || ""}
                        onChange={(event) => updateNodeLabel(event.target.value)}
                      />
                    </Field>
                    <div className="workspace-inline-actions">
                      <GhostButton onClick={() => moveNode("up")}>
                        <ArrowUp size={16} />
                      </GhostButton>
                      <GhostButton onClick={() => moveNode("left")}>
                        <ArrowLeft size={16} />
                      </GhostButton>
                      <GhostButton onClick={() => moveNode("right")}>
                        <ArrowRight size={16} />
                      </GhostButton>
                      <GhostButton onClick={() => moveNode("down")}>
                        <ArrowDown size={16} />
                      </GhostButton>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="Nenhum nó selecionado"
                    subtitle="Selecione um nó no canvas para editar posição e rótulo."
                  />
                )}
              </DataCard>
            </div>
          ) : null}
        </div>
      </PageFrame>
      <MindMapModal
        open={open}
        onClose={() => {
          setEditing(null);
          setOpen(false);
        }}
        editing={editing}
        onSubmit={handleSubmit}
        tracks={data!.trackBlueprints}
        projects={data!.projectBundles}
      />
    </>
  );
}

function MindMapModal({
  open,
  onClose,
  editing,
  onSubmit,
  tracks,
  projects,
}: {
  open: boolean;
  onClose: () => void;
  editing: MindMapRow | null;
  onSubmit: (formData: FormData) => Promise<void>;
  tracks: TrackBlueprint[];
  projects: ProjectBundle[];
}) {
  return (
    <WorkspaceModal
      title={editing ? "Editar mapa" : "Novo mapa"}
      subtitle="Crie o board inicial do canvas."
      open={open}
      onClose={onClose}
    >
      <ModalForm onSubmit={onSubmit}>
        <Field label="Pasta">
          <TextInput name="folder_name" defaultValue={editing?.folder_name || "Geral"} />
        </Field>
        <Field label="Título">
          <TextInput name="title" defaultValue={editing?.title || ""} />
        </Field>
        <Field label="Trilha">
          <Select name="track_id" defaultValue={editing?.track_id || ""}>
            <option value="">Sem trilha</option>
            {tracks.map((item) => (
              <option key={item.track.id} value={item.track.id}>
                {item.track.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Módulo">
          <Select name="module_id" defaultValue={editing?.module_id || ""}>
            <option value="">Sem módulo</option>
            {tracks.flatMap((item) =>
              item.modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {item.track.name} • {module.title}
                </option>
              )),
            )}
          </Select>
        </Field>
        <Field label="Projeto">
          <Select name="project_id" defaultValue={editing?.project_id || ""}>
            <option value="">Sem projeto</option>
            {projects.map((item) => (
              <option key={item.project.id} value={item.project.id}>
                {item.project.title}
              </option>
            ))}
          </Select>
        </Field>
      </ModalForm>
    </WorkspaceModal>
  );
}

function nullable(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();
  return normalized ? normalized : null;
}
