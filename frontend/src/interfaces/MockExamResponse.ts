export type MockExamDiagnosisResponse =  {
  id: string
  name: string
  email: string
  mockExamId: string
  examCode: string
  className: string
  correctAnswers: number
  response: string[]
  hasDiagnosisPdfFile: boolean
  comment: string
  createdAt: string
}