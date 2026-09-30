import { useNavigate, useParams } from "react-router-dom";
import { FormHeader } from "@/components/FormHeader";
import { NavigationBar } from "@/components/NavigationBar";
import { useGetMockExamById } from "@/hooks/CRUD/mockExam/useGetMockExamById";
import { useHandleEditMockExam } from "@/hooks/CRUD/mockExam/useHandleEditMockExam";
import { convertMockExamData } from "@/utils/convertMockExamData";
import { mapMockExamToForm } from "@/mapper/mockExamMapper";
import { MockExamForm } from "@/components/Forms/MockExam/MockExamForm";
import { MockExamFormType } from "@/components/Forms/MockExam/mockExamSchema";
import { CreateMockExam } from "@/interfaces/MockExam";
import PaginaContainer from "@/components/Shared/PaginaContainer";

export function EditMockExam() {
  const navigate = useNavigate();
  const { mockExamId = "" } = useParams<{ mockExamId: string }>();

  const { data: mockExamResponse } = useGetMockExamById(mockExamId);
  const updateMutation = useHandleEditMockExam(mockExamId);

  const mockExam = mockExamResponse
    ? convertMockExamData(mockExamResponse)
    : undefined;

  const defaultValues = mockExam ? mapMockExamToForm(mockExam) : undefined;

  const mockExamCode = mockExam
    ? `${mockExam.releasedYear}:S${mockExam.number}-${mockExam.className}`
    : "";

  function buildFormData(data: MockExamFormType): FormData {
    const formData = new FormData();

    formData.append("coverPdfFile", data.coverPdfFile);
    formData.append("matrixPdfFile", data.matrixPdfFile);
    formData.append("answersPdfFile", data.answersPdfFile);

    const payload: CreateMockExam = {
      name: data.name,
      className: [data.className],
      releasedYear: data.releasedYear,
      number: Number(data.number),
    };

    formData.append(
      "mockExamInputDto",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    return formData;
  }

  async function handleEdit(data: MockExamFormType) {
    const formData = buildFormData(data);
    await updateMutation.mutateAsync(formData);
    navigate("/mock-exams");
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <PaginaContainer className="pt-[3%] pb-[2%]">
        <FormHeader
          headerTitle={`Editar Simulado ${mockExamCode}`}
          headerDetails="Altere os campos a seguir para atualizar o simulado"
        />
        {defaultValues && mockExam && (
          <MockExamForm
            titulo={`Editar Simulado ${mockExamCode}`}
            modo="edicao"
            defaultValues={defaultValues}
            fileUrls={{
              cover: mockExam.coverPdfFile.url,
              matrix: mockExam.matrixPdfFile.url,
              answers: mockExam.answersPdfFile.url,
            }}
            handleSubmitRequest={handleEdit}
          />
        )}
      </PaginaContainer>
    </>
  );
}
