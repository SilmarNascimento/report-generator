import { MainQuestion } from "."
import { Subject } from "./Subject"


export type MockExam =  {
  id: string
  name: string
  className: string[]
  subjects: Subject[]
  number: number
  mockExamQuestions: MainQuestion[]
}