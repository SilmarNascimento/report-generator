import { FormHeader } from "../../components/formHeader";
import { Header } from "../../components/header";
import { CreateMainQuestionForm } from "../../components/mainQuestion/createMainQuestionForm";
import { NavigationBar } from "../../components/navigationBar";

export function CreateMainQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Nova Questão"
          headerDetails="Informe os campos a seguir para criar uma nova Questão"
        />
        <CreateMainQuestionForm />
      </div>
    </>
  )
}
