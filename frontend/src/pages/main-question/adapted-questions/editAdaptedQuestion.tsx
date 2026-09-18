import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormHeader } from "../../../components/FormHeader";
import { NavigationBar } from "../../../components/NavigationBar";
import { AdaptedQuestion } from "../../../interfaces";
import { AdaptedQuestionForm } from "@/components/Forms/AdaptedQuestion/AdaptedQuestionForm";
import { AdaptedQuestionFormType } from "@/components/Forms/AdaptedQuestion/AdaptedQuestionSchema";
import { successAlert, warningAlert } from "@/utils/toastAlerts";

export function EditAdaptedQuestion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mainQuestionId = "" } = useParams<{ mainQuestionId: string }>();
  const { adaptedQuestionId = "" } = useParams<{ adaptedQuestionId: string }>();

  const { data: adaptedQuestion } = useQuery<AdaptedQuestion>({
    queryKey: ["get-adapted-questions", mainQuestionId, adaptedQuestionId],
    queryFn: async () => {
      const response = await fetch(
        `/main-question/${mainQuestionId}/adapted-question/${adaptedQuestionId}`,
      );
      return response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const defaultValues = useMemo<AdaptedQuestionFormType | undefined>(() => {
    if (!adaptedQuestion) return undefined;
    return {
      title: adaptedQuestion.title,
      level: adaptedQuestion.level,
      questionAnswer: adaptedQuestion.alternatives
        .findIndex((a) => a.questionAnswer)
        .toString(),
    };
  }, [adaptedQuestion]);

  async function handleEdit(formData: FormData) {
    const response = await fetch(
      `/main-question/${mainQuestionId}/adapted-question/${adaptedQuestionId}`,
      { method: "PUT", body: formData },
    );

    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["get-adapted-questions"] });
      queryClient.invalidateQueries({ queryKey: ["get-main-questions"] });
      successAlert("Questão adaptada salva com sucesso!");
      navigate(`/main-questions/${mainQuestionId}/adapted-questions`);
    }

    if (response.status === 400) {
      const errorMessage = await response.text();
      warningAlert(errorMessage);
    }
  }

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Editar Questão Adaptada"
          headerDetails="Altere os campos a seguir para atualizar a questão adaptada."
        />
        {defaultValues && (
          <AdaptedQuestionForm
            titulo="Editar Questão Adaptada"
            modo="edicao"
            defaultValues={defaultValues}
            handleSubmitRequest={handleEdit}
          />
        )}
      </div>
    </>
  );
}
