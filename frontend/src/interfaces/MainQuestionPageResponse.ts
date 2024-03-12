import { MainQuestion } from "./MainQuestion"

export type MainQuestionPageResponse = {
  pageItems: number
  totalItems: number
  pages: number
  data: MainQuestion[]
}
