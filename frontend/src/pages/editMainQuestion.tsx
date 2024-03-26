import { Header } from "../components/header";
import { EditMainQuestionForm } from "../components/mainQuestion/editMainQuestionForm";
import { NavigationBar } from "../components/navigationBar";

export function EditMainQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
      <div>
        <Header />
        <NavigationBar />
      </div>
        <div className="flex flex-col my-8">
          <span className="font-bold text-lg">
            Editar Questão
          </span>
          <span className="font-normal text-lg">
            Altere os campos a seguir para atualizar a Questão
          </span>
        </div>
        <EditMainQuestionForm />
      </div>
    </>
  )
}