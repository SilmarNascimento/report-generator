import { useParams } from "react-router-dom";
import { FormHeader } from "../../components/formHeader";
import { Header } from "../../components/header";
import { EditMainQuestionForm } from "../../components/mainQuestion/editMainQuestionForm";
import { NavigationBar } from "../../components/navigationBar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MainQuestion } from "../../interfaces";
import { MainQuestionReceived } from "../../interfaces/MainQuestion";
import { convertMainQuestionData } from "../../utils/convertMainQuestiondata";

export function EditMainQuestion() {
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";

  const { data: mainQuestionResponse } = useQuery<MainQuestion>({
    queryKey: ['get-main-questions', mainQuestionId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}`)
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
        { mainQuestionResponse && <EditMainQuestionForm entity={mainQuestionResponse}/>}
      </div>
    </>
  )
}