import { FormHeader } from "../../components/formHeader";
import { EditMainQuestionForm } from "../../components/mainQuestion/editMainQuestionForm";
import { NavigationBar } from "../../components/NavigationBar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MainQuestion } from "../../types";
import { MainQuestionReceived } from "../../types/MainQuestion";
import { convertMainQuestionData } from "../../utils/convertMainQuestionData";
import { Route } from "@/router/main-questions/edit/$mainQuestionId";

export function EditMainQuestion() {
  const { mainQuestionId } = Route.useParams();

  const { data: mainQuestionResponse } = useQuery<MainQuestion>({
    queryKey: ["get-main-questions", mainQuestionId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/main-question/${mainQuestionId}`
      );
      const data: MainQuestionReceived = await response.json();
      console.log(data);

      return convertMainQuestionData(data);
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
  const mainQuestionCode = ``;

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle={`Editar Questão Principal ${mainQuestionCode}`}
          headerDetails="Altere os campos a seguir para atualizar a questão principal"
        />
        {mainQuestionResponse && (
          <EditMainQuestionForm
            entity={mainQuestionResponse}
            mainQuestionId={mainQuestionId}
          />
        )}
      </div>
    </>
  );
}
