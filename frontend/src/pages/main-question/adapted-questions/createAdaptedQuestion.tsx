import { CreateAdaptedQuestionForm } from "../../../components/adaptedQuestion/createAdaptedQuestionForm";
import { FormHeader } from "../../../components/formHeader";
import { Header } from "../../../components/header";
import { NavigationBar } from "../../../components/NavigationBar";

export function CreateAdaptedQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
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
