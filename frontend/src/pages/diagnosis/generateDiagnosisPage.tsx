import { NavigationBar } from "@/components/NavigationBar";
import { GenerateResponsesForm } from "@/components/diagnosis/diagnosisForm";

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
