import { GenerateResponsesForm } from "@/components/Diagnosis/DiagnosisForm";
import { NavigationBar } from "@/components/NavigationBar";

export function GenerateDiagnosis() {
  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="block w-auto">
          <GenerateResponsesForm
            selectPlaceholder="Selecione um Simulado"
            dragAndDropPlaceholder="Escolha o arquivo Excel de respostas"
          />
        </div>
      </main>
    </>
  );
}
