import { FormHeader } from "../../components/FormHeader";
import { NavigationBar } from "../../components/NavigationBar";
import { useHandleCreateMainQuestion } from "@/hooks/CRUD/mainQuestion/useHandleCreateMainQuestion";
import { MainQuestionForm } from "@/components/Forms/MainQuestion/MainQuestionForm";
import PaginaContainer from "@/components/Shared/PaginaContainer";

export function CreateMainQuestion() {
  const createMutation = useHandleCreateMainQuestion();

  async function handleCreate(formData: FormData) {
    await createMutation.mutateAsync({ formData });
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <PaginaContainer className="pt-[3%] pb-[2%]">
        <FormHeader
          headerTitle="Nova Questão Principal"
          headerDetails="Informe os campos a seguir para criar uma nova questão principal"
        />
        <MainQuestionForm
          titulo="Nova Questão Principal"
          modo="criacao"
          handleSubmitRequest={handleCreate}
        />
      </PaginaContainer>
    </>
  );
}
