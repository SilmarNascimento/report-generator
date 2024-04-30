import { MainQuestion } from "."
import { Subject } from "./Subject"


export type MockExam =  {
  id: string
  name: string
  className: ("Intensivo" | "Extensivo")[]
  subjects: Subject[]
  releasedYear: string
  number: number
  mockExamQuestions: { [key: number]: MainQuestion };
}