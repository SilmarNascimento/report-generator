import { FormHeader } from "@/components/FormHeader";
import { Header } from "@/components/Header";
import { EditMockExamForm } from "@/components/MockExam/EditMockExamForm";
import { NavigationBar } from "@/components/NavigationBar";
import { useGetMockExamById } from "@/hooks/CRUD/mockExam/useGetMockExamById";
import { convertMockExamData } from "@/utils/convertMockExamData";
import { useParams } from "react-router-dom";

export function EditMockExam() {
  const { mockExamId = "" } = useParams<{ mockExamId: string }>();

  const { data: mockExamResponse } = useGetMockExamById(mockExamId);
  const mockExamResponseFormatted = mockExamResponse
    ? convertMockExamData(mockExamResponse)
    : undefined;

  const mockExamCode = `${mockExamResponseFormatted?.releasedYear}:S${mockExamResponseFormatted?.number}-${mockExamResponseFormatted?.className}`;

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
        {mockExamResponseFormatted && (
          <EditMockExamForm entity={mockExamResponseFormatted} />
        )}
      </div>
    </>
  );
}
