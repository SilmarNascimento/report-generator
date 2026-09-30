import { useState } from "react";
import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "@/utils/toastAlerts";
import { studentService } from "@/service/studentService";
import { ModalCadastroEmMassaInformationType } from "@/interfaces/Modal";
import { StudentImportError, StudentImportResult } from "@/interfaces/Student";

export function useImportStudents() {
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [erros, setErros] = useState<StudentImportError[]>([]);

  const mutation = useMutation({
    mutationFn: (arquivo: File) => studentService.importStudents(arquivo),

    onMutate: () => setErros([]),

    onSuccess: (result) => {
      successAlert(
        `${result.importedCount} aluno(s) cadastrado(s) com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: ["get-students"] });
      setModalAberto(false);
    },

    onError: (error) => {
      if (isAxiosError<StudentImportResult>(error)) {
        setErros(error.response?.data?.errors ?? []);
      }
    },
  });

  const abrirModalCadastroEmMassa = () => {
    setErros([]);
    setModalAberto(true);
  };

  const fecharModalCadastroEmMassa = () => {
    setModalAberto(false);
    setErros([]);
  };

  const confirmarCadastroEmMassa = (arquivo?: File) => {
    if (arquivo) mutation.mutate(arquivo);
  };

  const itemModal: ModalCadastroEmMassaInformationType | null = modalAberto
    ? { erros }
    : null;

  return {
    cadastroEmMassaModalState: {
      isOpen: modalAberto,
      tipo: "cadastroEmMassa" as const,
      item: itemModal,
    },
    abrirModalCadastroEmMassa,
    fecharModalCadastroEmMassa,
    confirmarCadastroEmMassa,
    isPendingCadastroEmMassa: mutation.isPending,
  };
}
