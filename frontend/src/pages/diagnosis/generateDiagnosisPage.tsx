import { useState } from "react"
import { DiagnosisTable } from "../../components/diagnosis/diagnosisTable"
import { NavigationBar } from "../../components/navigationBar"
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import { GenerateResponsesForm } from "../../components/diagnosis/diagnosisForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "../../utils/toastAlerts";

export function GenerateDiagnosis() {
  const [studentResponseList, setStudentResponseList] = useState<MockExamDiagnosisResponse[]>([]);
  const queryClient = useQueryClient();

  const deleteResponse = useMutation({
    mutationFn: async (studentResponseId: string) => {
      try {
        await fetch(`http://localhost:8080/students-response/${studentResponseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        })
      
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-responses'],
      });
      successAlert('Resposta do aluno para o simulado excluída com sucesso!');
    }
  })

  async function handleDeleteStudentResponse(studentResponseId: string) {
    await deleteResponse.mutateAsync(studentResponseId)
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className='block w-auto'>
          <GenerateResponsesForm
            setStudentResponseList={setStudentResponseList}
            selectPlaceholder="Selecione um Simulado"
            dragAndDropPlaceholder="Escolha o arquivo Excel de respostas"
          />
        </div>
        <div>
          { !!studentResponseList.length && 
            <DiagnosisTable
              deleteFunction={handleDeleteStudentResponse}
              entity={studentResponseList}
            />
          }
        </div>
      </main>
    </>
  )
}