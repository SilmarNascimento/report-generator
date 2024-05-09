import { AdaptedQuestionWrapper } from "./AdaptedQuestionWrapper"

export type MockExamResponse =  {
  id: string
  name: string
  email: string
  mockExamId: string
  correctAnswers: number
  response: string[]
  adaptedQuestions: AdaptedQuestionWrapper[]
  comment: string
  createdAt: string
}