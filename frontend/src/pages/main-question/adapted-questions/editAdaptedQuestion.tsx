import { EditAdaptedQuestionForm } from "../../../components/adaptedQuestion/editAdaptedQuestionForm";
import { FormHeader } from "../../../components/formHeader";
import { Header } from "../../../components/header";
import { NavigationBar } from "../../../components/navigationBar";

export function EditAdaptedQuestion() {
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
        <EditAdaptedQuestionForm />
      </div>
    </>
  )
}