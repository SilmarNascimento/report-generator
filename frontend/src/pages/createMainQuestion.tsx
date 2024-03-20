import { Header } from "../components/header";
import { CreateMainQuestionForm } from "../components/mainQuestion/createMainQuestionForm";
import { NavigationBar } from "../components/navigationBar";

export function CreateMainQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
      <div>
        <Header />
        <NavigationBar />
      </div>
        <div className="flex flex-col my-8">
          <span className="font-bold text-lg">
            Nova Questão
          </span>
          <span className="font-normal text-lg">
            Informe os campos a seguir para criar uma nova Questão
          </span>
        </div>
        <CreateMainQuestionForm />
      </div>
    </>
  )
}
