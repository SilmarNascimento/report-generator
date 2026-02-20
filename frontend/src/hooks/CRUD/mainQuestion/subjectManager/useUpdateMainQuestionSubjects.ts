import { MainQuestion } from "@/interfaces";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateMainQuestionSubjects(
  mainQuestionId: string | undefined,
  mainQuestionRef: React.MutableRefObject<MainQuestion | undefined>,
  subjectIdListRef: React.MutableRefObject<string[] | undefined>,
) {
  const qc = useQueryClient();

  const syncRefs = (updated: MainQuestion) => {
    mainQuestionRef.current = updated;
    subjectIdListRef.current = updated.subjects.map((s) => s.id);
  };

  const addSubject = useMutation({
    mutationFn: (ids: string[]) =>
      apiService.patch<MainQuestion>(
        `/main-question/${mainQuestionId}/subject`,
        { subjectsId: ids },
      ),

    onSuccess: (updated, ids) => {
      syncRefs(updated);
      qc.invalidateQueries({ queryKey: ["subjects-filter"] });

      successAlert(
        ids.length === 1
          ? "Assunto adicionado com sucesso"
          : "Assuntos adicionados com sucesso",
      );
    },
  });

  const removeSubject = useMutation({
    mutationFn: (ids: string[]) =>
      apiService.delete<MainQuestion>(
        `/main-question/${mainQuestionId}/subject`,
        { subjectsId: ids },
      ),

    onSuccess: (updated, ids) => {
      syncRefs(updated);
      qc.invalidateQueries({ queryKey: ["subjects-filter"] });

      successAlert(
        ids.length === 1
          ? "Assunto removido com sucesso"
          : "Assuntos removidos com sucesso",
      );
    },
  });

  return { addSubject, removeSubject };
}
