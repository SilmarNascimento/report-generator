import { FormHeader } from "../../components/FormHeader";
import { Header } from "../../components/Header";
import { CreateMockExamForm } from "../../components/MockExam/CreateMockExamForm";
import { NavigationBar } from "../../components/NavigationBar";

export function CreateMockExam() {
  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <Header />
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Novo Simulado"
          headerDetails="Informe os campos a seguir para criar um novo simulado"
        />
        <CreateMockExamForm />
      </div>
    </>
  );
}
