import { useParams } from "react-router-dom";
import { FormHeader } from "../../components/FormHeader";
import { Header } from "../../components/Header";
import { EditMainQuestionForm } from "../../components/MainQuestion/EditMainQuestionForm";
import { NavigationBar } from "../../components/NavigationBar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MainQuestion } from "../../interfaces";
import { MainQuestionReceived } from "../../interfaces/MainQuestion";
import { convertMainQuestionData } from "../../utils/convertMainQuestiondata";

export function EditMainQuestion() {
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";

  const { data: mainQuestionResponse } = useQuery<MainQuestion>({
    queryKey: ["get-main-questions", mainQuestionId],
    queryFn: async () => {
      const response = await fetch(
        `/main-question/${mainQuestionId}`,
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
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle={`Editar Questão Principal ${mainQuestionCode}`}
          headerDetails="Altere os campos a seguir para atualizar a questão principal"
        />
        {mainQuestionResponse && (
          <EditMainQuestionForm entity={mainQuestionResponse} />
        )}
      </div>
    </>
  );
}
