import { FormHeader } from "../../components/FormHeader";
import { Header } from "../../components/Header";
import { CreateMainQuestionForm } from "../../components/MainQuestion/CreateMainQuestionForm";
import { NavigationBar } from "../../components/NavigationBar";

export function CreateMainQuestion() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Nova Questão Principal"
          headerDetails="Informe os campos a seguir para criar uma nova questão principal"
        />
        <CreateMainQuestionForm />
      </div>
    </>
  );
}
