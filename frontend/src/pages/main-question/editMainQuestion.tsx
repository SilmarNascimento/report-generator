import { useParams } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { convertMainQuestionData } from "@/utils/convertMainQuestiondata";
import { useGetMainQuestionById } from "@/hooks/CRUD/mainQuestion/useGetMainQuestionById";
import { FormHeader } from "@/components/FormHeader";
import { Header } from "@/components/Header";
import { EditMainQuestionForm } from "@/components/MainQuestion/EditMainQuestionForm";

export function EditMainQuestion() {
  const { mainQuestionId = "" } = useParams<{ mainQuestionId: string }>();

  const { data: mainQuestionResponse } = useGetMainQuestionById(mainQuestionId);
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
          <EditMainQuestionForm
            entity={convertMainQuestionData(mainQuestionResponse)}
          />
        )}
      </div>
    </>
  );
}
