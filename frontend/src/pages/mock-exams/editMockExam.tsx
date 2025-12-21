import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FormHeader } from "../../components/formHeader";
import { EditMockExamForm } from "../../components/mockExam/editMockExamForm";
import { NavigationBar } from "../../components/NavigationBar";
import { MockExam } from "../../types";
import { MockExamReceived } from "../../types/MockExam";
import { convertMockExamData } from "@/utils/convertMockExamData";
import { Route } from "@/router/mock-exams/edit/$mockExamId";

export function EditMockExam() {
  const { mockExamId } = Route.useParams();

  const { data: mockExamResponse } = useQuery<MockExam>({
    queryKey: ["get-mock-exams", mockExamId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamId}`
      );
      const data: MockExamReceived = await response.json();

      return convertMockExamData(data);
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const mockExamCode = `${mockExamResponse?.releasedYear}:S${mockExamResponse?.number}-${mockExamResponse?.className}`;

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
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
