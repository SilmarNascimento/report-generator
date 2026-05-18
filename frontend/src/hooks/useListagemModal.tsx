import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { ModalItemInformationType, ModalType } from "@/interfaces/Modal";

interface UseListagemModalProps {
  endpoint: string;
  chaveStatus?: string;
  invalidateKeys: (string | number)[][];
  entidade: string;
  onAfterChange?: () => void;
}

export function useListagemModal({
  endpoint,
  chaveStatus,
  invalidateKeys,
  entidade,
  onAfterChange,
}: UseListagemModalProps) {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    tipo: ModalType;
    item: ModalItemInformationType | null;
  }>({
    isOpen: false,
    tipo: "exclusao",
    item: null,
  });

  const fecharModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false, item: null }));

  const abrirModal = (item: ModalItemInformationType, tipo: ModalType) => {
    setModalState({ isOpen: true, tipo, item });
  };

  const handleInvalidation = () => {
    invalidateKeys.forEach((key) =>
      queryClient.invalidateQueries({ queryKey: key }),
    );
    onAfterChange?.();
    fecharModal();
  };

  const mutationStatus = useMutation({
    mutationFn: async () => {
      if (!modalState.item || !chaveStatus) return;
      const novoStatus =
        modalState.item.status === "ATIVO" ? "INATIVO" : "ATIVO";
      await apiService.patch(`${endpoint}/${modalState.item.id}/status`, {
        [chaveStatus]: novoStatus,
      });
    },
    onSuccess: () => {
      successAlert(`${entidade} atualizado com sucesso!`);
      handleInvalidation();
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async () => {
      if (!modalState.item) return;
      await apiService.delete(`${endpoint}/${modalState.item.id}`);
    },
    onSuccess: () => {
      successAlert(`${entidade} excluído com sucesso!`);
      handleInvalidation();
    },
  });

  const confirmarAcao = () => {
    if (modalState.tipo === "status") mutationStatus.mutate();
    if (modalState.tipo === "exclusao") mutationDelete.mutate();
  };

  return {
    modalState,
    abrirModal,
    fecharModal,
    confirmarAcao,
    isPending: mutationStatus.isPending || mutationDelete.isPending,
  };
}
