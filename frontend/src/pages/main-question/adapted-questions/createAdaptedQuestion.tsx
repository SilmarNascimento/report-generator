import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FormHeader } from "../../../components/FormHeader";
import { NavigationBar } from "../../../components/NavigationBar";
import { AdaptedQuestionForm } from "@/components/Forms/AdaptedQuestion/AdaptedQuestionForm";
import { successAlert, warningAlert } from "@/utils/toastAlerts";
import PaginaContainer from "@/components/Shared/PaginaContainer";

export function CreateAdaptedQuestion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mainQuestionId = "" } = useParams<{ mainQuestionId: string }>();

  async function handleCreate(formData: FormData) {
    const response = await fetch(
      `/main-question/${mainQuestionId}/adapted-question`,
      { method: "POST", body: formData },
    );

    if (response.status === 201) {
      queryClient.invalidateQueries({ queryKey: ["get-adapted-questions"] });
      queryClient.invalidateQueries({ queryKey: ["get-main-questions"] });
      successAlert("Questão adaptada salva com sucesso!");
      navigate(`/main-questions/${mainQuestionId}/adapted-questions`);
    }

    if (response.status === 400) {
      const errorMessage = await response.text();
      warningAlert(errorMessage);
    }
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <PaginaContainer className="pt-[3%] pb-[2%]">
        <FormHeader
          headerTitle="Nova Questão Adaptada"
          headerDetails="Informe os campos a seguir para criar uma nova questão adaptada"
        />
        <AdaptedQuestionForm
          titulo="Nova Questão Adaptada"
          modo="criacao"
          handleSubmitRequest={handleCreate}
        />
      </PaginaContainer>
    </>
  );
}
