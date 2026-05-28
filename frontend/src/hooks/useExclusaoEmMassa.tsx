import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { ModalExclusaoEmMassaInformationType } from "@/interfaces/Modal";

interface UseExclusaoEmMassaProps {
  endpoint: string;
  invalidateKeys: (string | number)[][];
  entidade: string;
  onSuccess?: () => void;
}

export function useExclusaoEmMassa({
  endpoint,
  invalidateKeys,
  entidade,
  onSuccess,
}: UseExclusaoEmMassaProps) {
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [idsSelecionados, setIdsSelecionados] = useState<string[]>([]);

  const handleInvalidation = () => {
    invalidateKeys.forEach((key) =>
      queryClient.invalidateQueries({ queryKey: key }),
    );
  };

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await apiService.delete(`${endpoint}/batch`, { ids });
    },
    onSuccess: (_, ids) => {
      successAlert(`${ids.length} ${entidade}(s) excluído(s) com sucesso!`);
      handleInvalidation();
      onSuccess?.();
      setModalAberto(false);
      setIdsSelecionados([]);
    },
  });

  const abrirModalExclusaoEmMassa = (ids: string[]) => {
    setIdsSelecionados(ids);
    setModalAberto(true);
  };

  const fecharModalExclusaoEmMassa = () => {
    setModalAberto(false);
    setIdsSelecionados([]);
  };

  const confirmarExclusaoEmMassa = () => {
    mutation.mutate(idsSelecionados);
  };

  const itemModal: ModalExclusaoEmMassaInformationType | null = modalAberto
    ? { quantidade: idsSelecionados.length }
    : null;

  return {
    exclusaoEmMassaModalState: {
      isOpen: modalAberto,
      tipo: "exclusaoEmMassa" as const,
      item: itemModal,
    },
    abrirModalExclusaoEmMassa,
    fecharModalExclusaoEmMassa,
    confirmarExclusaoEmMassa,
    isPendingExclusaoEmMassa: mutation.isPending,
  };
}
