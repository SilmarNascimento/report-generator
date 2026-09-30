import { GenerateResponsesForm } from "@/components/Diagnosis/DiagnosisForm";
import { NavigationBar } from "@/components/NavigationBar";
import PaginaContainer from "@/components/Shared/PaginaContainer";

export function GenerateDiagnosis() {
  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <PaginaContainer>
        <div className="block w-auto">
          <GenerateResponsesForm
            selectPlaceholder="Selecione um Simulado"
            dragAndDropPlaceholder="Escolha o arquivo Excel de respostas"
          />
        </div>
      </PaginaContainer>
    </>
  );
}
