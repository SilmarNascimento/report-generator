import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FormHeader } from "../../components/formHeader";
import { Header } from "../../components/header";
import { EditMockExamForm } from "../../components/mockExam/editMockExamForm";
import { NavigationBar } from "../../components/navigationBar";
import { MockExam } from "../../interfaces";
import { useParams } from "react-router-dom";

export function EditMockExam() {
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";
  
  const { data: mockExamResponse } = useQuery<MockExam>({
    queryKey: ['get-mock-exams', mockExamId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/mock-exam/${mockExamId}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
  const mockExamCode = `${mockExamResponse?.releasedYear}:S${mockExamResponse?.number}-${mockExamResponse?.className}`;

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle={`Editar Simulado ${mockExamCode}`}
          headerDetails="Altere os campos a seguir para atualizar o simulado"
        />
        { mockExamResponse && <EditMockExamForm entity={mockExamResponse}/> }
      </div>
    </>
  )
}