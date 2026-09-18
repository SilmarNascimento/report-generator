import { FormHeader } from "../../components/FormHeader";
import { NavigationBar } from "../../components/NavigationBar";
import { useHandleCreateMainQuestion } from "@/hooks/CRUD/mainQuestion/useHandleCreateMainQuestion";
import { MainQuestionForm } from "@/components/Forms/MainQuestion/MainQuestionForm";

export function CreateMainQuestion() {
  const createMutation = useHandleCreateMainQuestion();

  async function handleCreate(formData: FormData) {
    await createMutation.mutateAsync(formData);
  }

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto pt-[3%] pb-[2%]">
        <header>
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Nova Questão Principal"
          headerDetails="Informe os campos a seguir para criar uma nova questão principal"
        />
        <MainQuestionForm
          titulo="Nova Questão Principal"
          modo="criacao"
          handleSubmitRequest={handleCreate}
        />
      </div>
    </>
  );
}
