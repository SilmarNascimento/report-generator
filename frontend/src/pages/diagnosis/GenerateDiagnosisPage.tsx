import { useState } from "react";
import { DiagnosisTable } from "../../components/Diagnosis/DiagnosisTable";
import { NavigationBar } from "../../components/NavigationBar";
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import { GenerateResponsesForm } from "../../components/Diagnosis/DiagnosisForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "../../utils/toastAlerts";

export function GenerateDiagnosis() {
  const [studentResponseList, setStudentResponseList] = useState<
    MockExamDiagnosisResponse[]
  >([]);
  const queryClient = useQueryClient();

  const deleteResponse = useMutation({
    mutationFn: async (studentResponseId: string) => {
      try {
        await fetch(
          `/students-response/${studentResponseId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "DELETE",
          },
        );
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-responses"],
      });
      successAlert("Resposta do aluno para o simulado excluída com sucesso!");
    },
  });

  async function handleDeleteStudentResponse(studentResponseId: string) {
    await deleteResponse.mutateAsync(studentResponseId);
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="block w-auto">
          <GenerateResponsesForm
            setStudentResponseList={setStudentResponseList}
            selectPlaceholder="Selecione um Simulado"
            dragAndDropPlaceholder="Escolha o arquivo Excel de respostas"
          />
        </div>
        <div>
          {!!studentResponseList.length && (
            <DiagnosisTable
              deleteFunction={handleDeleteStudentResponse}
              entity={studentResponseList}
            />
          )}
        </div>
      </main>
    </>
  );
}
