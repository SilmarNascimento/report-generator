import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { convertMainQuestionData } from "@/utils/convertMainQuestiondata";
import { useGetMainQuestionById } from "@/hooks/CRUD/mainQuestion/useGetMainQuestionById";
import { useHandleEditMainQuestion } from "@/hooks/CRUD/mainQuestion/useHandleEditMainQuestion";
import { FormHeader } from "@/components/FormHeader";
import { MainQuestionForm } from "@/components/Forms/MainQuestion/MainQuestionForm";
import { MainQuestionFormType } from "@/components/Forms/MainQuestion/MainQuestionSchema";
import { LerikucasEnum, QuestionPatternEnum } from "@/constants/general";

export function EditMainQuestion() {
  const navigate = useNavigate();
  const { mainQuestionId = "" } = useParams<{ mainQuestionId: string }>();

  const { data: mainQuestionResponse } = useGetMainQuestionById(mainQuestionId);
  const updateMutation = useHandleEditMainQuestion(mainQuestionId);

  const mainQuestion = mainQuestionResponse
    ? convertMainQuestionData(mainQuestionResponse)
    : undefined;

  const defaultValues = useMemo<MainQuestionFormType | undefined>(() => {
    if (!mainQuestion) return undefined;
    return {
      title: mainQuestion.title,
      level: mainQuestion.level,
      lerikucas: String(mainQuestion.lerickucas) as LerikucasEnum,
      pattern: mainQuestion.pattern as unknown as QuestionPatternEnum,
      videoResolutionUrl: mainQuestion.videoResolutionUrl,
      adaptedQuestionsPdfFile: mainQuestion.adaptedQuestionPdfFile.file,
      questionAnswer: mainQuestion.alternatives
        .findIndex((a) => a.questionAnswer)
        .toString(),
      alternatives: mainQuestion.alternatives.map((a) => ({
        description: a.description,
      })),
    };
  }, [mainQuestion]);

  async function handleEdit(formData: FormData) {
    await updateMutation.mutateAsync(formData);
    navigate("/main-questions");
  }

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Editar Questão Principal"
          headerDetails="Altere os campos a seguir para atualizar a questão principal"
        />
        {defaultValues && (
          <MainQuestionForm
            titulo="Editar Questão Principal"
            modo="edicao"
            defaultValues={defaultValues}
            handleSubmitRequest={handleEdit}
          />
        )}
      </div>
    </>
  );
}
