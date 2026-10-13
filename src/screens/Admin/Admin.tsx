"use client";

import { DOWNLOAD_ZIP_URL } from "@/services/api/adminApi";
import { OrphanRow } from "@/screens/Admin/components/OrphanRow/OrphanRow";
import { PhotoRow } from "@/screens/Admin/components/PhotoRow/PhotoRow";
import { useAdmin } from "@/screens/Admin/useAdmin";
import type { AdminData } from "@/types";

const PILL_BTN =
  "inline-flex min-h-9 items-center justify-center rounded-full border border-nmk-border-strong bg-transparent px-4 py-2 text-[11px] tracking-[0.04em] text-nmk-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nmk-text";

function SectionHeader({ label }: { label: string }) {
  return <h2 className="m-0 text-[11px] font-normal uppercase tracking-[0.18em] text-nmk-text-muted">{label}</h2>;
}

function EmptyMessage({ text }: { text: string }) {
  return <p className="m-0 py-2 font-display text-[13px] italic text-nmk-text-muted">{text}</p>;
}

export function Admin({ initialData }: { initialData: AdminData }) {
  const {
    pendingPhotos,
    approvedPhotos,
    orphanGroups,
    busyId,
    approve,
    reject,
    deleteApproved,
    deleteOrphanGroup,
    handleLogout,
  } = useAdmin(initialData);

  return (
    <div className="min-h-screen bg-nmk-bg">
      <div className="mx-auto max-w-page">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[oklch(1_0_0/0.08)] bg-nmk-bg px-5 py-[22px]">
          <h1 className="m-0 font-display text-[19px] font-normal italic">Moderação</h1>
          <div className="flex gap-2.5">
            <a href={DOWNLOAD_ZIP_URL} className={PILL_BTN}>
              Transferir tudo (ZIP)
            </a>
            <button type="button" onClick={handleLogout} className={PILL_BTN}>
              Sair
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-9 px-5 pb-12 pt-7">
          <section className="flex flex-col gap-3.5">
            <SectionHeader label="Pendentes" />
            {pendingPhotos.length === 0 && <EmptyMessage text="Sem fotos pendentes." />}
            <div className="flex flex-col gap-2.5">
              {pendingPhotos.map((photo) => (
                <PhotoRow
                  key={photo.id}
                  photo={photo}
                  busy={busyId === photo.id}
                  actions={[
                    { label: "Aprovar", variant: "approve", onClick: () => approve(photo) },
                    { label: "Rejeitar", variant: "danger", onClick: () => reject(photo) },
                  ]}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3.5">
            <SectionHeader label="No mural" />
            {approvedPhotos.length === 0 && <EmptyMessage text="O mural ainda não tem fotos." />}
            <div className="flex flex-col gap-2.5">
              {approvedPhotos.map((photo) => (
                <PhotoRow
                  key={photo.id}
                  photo={photo}
                  busy={busyId === photo.id}
                  actions={[{ label: "Apagar", variant: "danger", onClick: () => deleteApproved(photo) }]}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3.5">
            <SectionHeader label="Ficheiros órfãos" />
            {orphanGroups.length === 0 && <EmptyMessage text="Sem ficheiros órfãos." />}
            <div className="flex flex-col gap-2.5">
              {orphanGroups.map((group) => (
                <OrphanRow
                  key={group.uuid}
                  group={group}
                  busy={busyId === group.uuid}
                  onDelete={() => deleteOrphanGroup(group)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
