import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteOrphans, logout, moderatePhoto } from "@/services/api/adminApi";
import type { AdminData, ModerationAction, OrphanGroup, Photo } from "@/types";

export function useAdmin(initialData: AdminData) {
  const router = useRouter();
  const [pendingPhotos, setPendingPhotos] = useState(initialData.pendingPhotos);
  const [approvedPhotos, setApprovedPhotos] = useState(initialData.approvedPhotos);
  const [orphanGroups, setOrphanGroups] = useState(initialData.orphanGroups);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function act(id: string, action: ModerationAction) {
    setBusyId(id);
    const ok = await moderatePhoto(id, action);
    if (ok) {
      const approvedPhoto = pendingPhotos.find((p) => p.id === id);
      setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
      setApprovedPhotos((prev) => {
        const remaining = prev.filter((p) => p.id !== id);
        return action === "approve" && approvedPhoto
          ? [{ ...approvedPhoto, approved: true }, ...remaining]
          : remaining;
      });
    } else {
      window.alert("Não foi possível concluir esta ação. Tenta novamente.");
    }
    setBusyId(null);
  }

  function approve(photo: Photo) {
    act(photo.id, "approve");
  }

  function reject(photo: Photo) {
    act(photo.id, "reject");
  }

  function deleteApproved(photo: Photo) {
    const confirmed = window.confirm(
      `Apagar a foto de "${photo.name}"? Vai ser removida do mural, do R2 e da base de dados — não é possível desfazer.`
    );
    if (confirmed) act(photo.id, "reject");
  }

  async function deleteOrphanGroup(group: OrphanGroup) {
    const confirmed = window.confirm(
      `Apagar estes ${group.keys.length} ficheiro(s) órfãos do bucket? Não estão ligados a nenhuma foto publicada.`
    );
    if (!confirmed) return;

    setBusyId(group.uuid);
    const ok = await deleteOrphans(group.keys);
    if (ok) {
      setOrphanGroups((prev) => prev.filter((g) => g.uuid !== group.uuid));
    } else {
      window.alert("Não foi possível apagar estes ficheiros. Tenta novamente.");
    }
    setBusyId(null);
  }

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  return {
    pendingPhotos,
    approvedPhotos,
    orphanGroups,
    busyId,
    approve,
    reject,
    deleteApproved,
    deleteOrphanGroup,
    handleLogout,
  };
}
