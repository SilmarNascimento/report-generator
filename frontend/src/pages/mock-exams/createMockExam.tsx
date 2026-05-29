import { useNavigate } from "react-router-dom";
import { FormHeader } from "../../components/FormHeader";
import { NavigationBar } from "../../components/NavigationBar";
import { useHandleCreateMockExam } from "@/hooks/CRUD/mockExam/useHandleCreateMockExam";
import { MockExamForm } from "@/components/Forms/MockExam/MockExamForm";
import { MockExamFormType } from "@/components/Forms/MockExam/MockExamSchema";
import { successAlert, warningAlert } from "@/utils/toastAlerts";

export function CreateMockExam() {
  const navigate = useNavigate();
  const createMutation = useHandleCreateMockExam();

  async function handleCreate(data: MockExamFormType) {
    try {
      await createMutation.mutateAsync(data);
      successAlert("Simulado salvo com sucesso!");
      navigate("/mock-exams");
    } catch {
      warningAlert("Erro ao salvar simulado");
    }
  }

  return (
    <>
      <div className="max-w-[80%] min-w-96 m-auto">
        <header>
          <NavigationBar />
        </header>
        <FormHeader
          headerTitle="Novo Simulado"
          headerDetails="Informe os campos a seguir para criar um novo simulado"
        />
        <MockExamForm
          titulo="Novo Simulado"
          modo="criacao"
          handleSubmitRequest={handleCreate}
        />
      </div>
    </>
  );
}
