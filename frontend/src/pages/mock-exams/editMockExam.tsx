import { FormHeader } from "../../components/formHeader";
import { Header } from "../../components/header";
import { EditMockExamForm } from "../../components/mockExam/editMockExamForm";
import { NavigationBar } from "../../components/navigationBar";

export function EditMainQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Editar Questão"
          headerDetails="Altere os campos a seguir para atualizar a Questão"
        />
        <EditMockExamForm />
      </div>
    </>
  )
}