import { CreateAdaptedQuestionForm } from "../../../components/AdaptedQuestion/CreateAdaptedQuestionForm";
import { FormHeader } from "../../../components/FormHeader";
import { NavigationBar } from "../../../components/NavigationBar";

export function CreateAdaptedQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Nova Questão Adaptada"
          headerDetails="Informe os campos a seguir para criar uma nova questão adaptada"
        />
        <CreateAdaptedQuestionForm />
      </div>
    </>
  );
}
