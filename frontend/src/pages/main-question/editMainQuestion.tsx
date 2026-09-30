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
import { DropdownType } from "@/interfaces/general";
import PaginaContainer from "@/components/Shared/PaginaContainer";

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
      mainSubject: mainQuestion.mainSubject?.id,
      secondarySubjects: mainQuestion.secondarySubjects.map((subject) => ({
        value: subject.id,
        dropdownLabel: subject.name,
        displayLabel: subject.name,
      })),
    };
  }, [mainQuestion]);

  const initialMainSubjectOption = useMemo<DropdownType | undefined>(() => {
    if (!mainQuestion?.mainSubject) return undefined;

    return {
      value: mainQuestion.mainSubject.id,
      label: mainQuestion.mainSubject.name,
    };
  }, [mainQuestion]);

  async function handleEdit(formData: FormData) {
    await updateMutation.mutateAsync({ formData });
    navigate("/main-questions");
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <PaginaContainer className="pt-[3%] pb-[2%]">
        <FormHeader
          headerTitle="Editar Questão Principal"
          headerDetails="Altere os campos a seguir para atualizar a questão principal"
        />
        {defaultValues && (
          <MainQuestionForm
            titulo="Editar Questão Principal"
            modo="edicao"
            defaultValues={defaultValues}
            initialMainSubjectOption={initialMainSubjectOption}
            handleSubmitRequest={handleEdit}
          />
        )}
      </PaginaContainer>
    </>
  );
}
