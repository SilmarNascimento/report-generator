import { useState } from "react"
import { DiagnosisTable } from "../../components/diagnosis/diagnosisTable"
import { NavigationBar } from "../../components/navigationBar"
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import { GenerateResponsesForm } from "../../components/diagnosis/diagnosisForm";

export function GenerateDiagnosis() {
  const [studentResponseList, setStudentResponseList] = useState<MockExamDiagnosisResponse[]>([]);

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className='block w-auto'>
          <GenerateResponsesForm
            setStudentResponseList={setStudentResponseList}
            selectPlaceholder="Selecione um Simulado"
            dragAndDropPlaceholder="Escolha o arquivo para a capa do simulado"
          />
        </div>
        <div>
          { !!studentResponseList.length && 
            <DiagnosisTable
              entity={studentResponseList}
            />
          }
        </div>
      </main>
    </>
  )
}