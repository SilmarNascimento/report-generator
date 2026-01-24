import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { EditAdaptedQuestionForm } from "../../../components/adaptedQuestion/editAdaptedQuestionForm";
import { FormHeader } from "../../../components/formHeader";
import { Header } from "../../../components/header";
import { NavigationBar } from "../../../components/NavigationBar";
import { AdaptedQuestion } from "../../../interfaces";
import { useParams } from "react-router-dom";

export function EditAdaptedQuestion() {
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  const { adaptedQuestionId } =
    useParams<{ adaptedQuestionId: string }>() ?? "";

  const { data: adaptedQuestionResponse } = useQuery<AdaptedQuestion>({
    queryKey: ["get-adapted-questions", mainQuestionId, adaptedQuestionId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/main-question/${mainQuestionId}/adapted-question/${adaptedQuestionId}`,
      );
      const data = await response.json();

      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Editar Questão Adaptada"
          headerDetails="Altere os campos a seguir para atualizar a questão adaptada."
        />
        {adaptedQuestionResponse && (
          <EditAdaptedQuestionForm entity={adaptedQuestionResponse} />
        )}
      </div>
    </>
  );
}
