import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FormHeader } from "../../components/FormHeader";
import { Header } from "../../components/Header";
import { EditMockExamForm } from "../../components/MockExam/EditMockExamForm";
import { NavigationBar } from "../../components/NavigationBar";
import { MockExam } from "../../interfaces";
import { useParams } from "react-router-dom";
import { MockExamReceived } from "../../interfaces/MockExam";
import { convertMockExamData } from "../../utils/convertMockExamData";

export function EditMockExam() {
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";

  const { data: mockExamResponse } = useQuery<MockExam>({
    queryKey: ["get-mock-exams", mockExamId],
    queryFn: async () => {
      const response = await fetch(
        `/mock-exam/${mockExamId}`,
      );
      const data: MockExamReceived = await response.json();

      return convertMockExamData(data);
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
  const mockExamCode = `${mockExamResponse?.releasedYear}:S${mockExamResponse?.number}-${mockExamResponse?.className}`;

  console.log(mockExamResponse);

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
        {mockExamResponse && <EditMockExamForm entity={mockExamResponse} />}
      </div>
    </>
  );
}
