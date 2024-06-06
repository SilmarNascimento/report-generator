import { MainQuestion } from "."
import { Subject } from "./Subject"


export type MockExam = {
  id: string
  name: string
  className: ("Intensivo" | "Extensivo")[]
  subjects: Subject[]
  releasedYear: string
  number: number
  coverPdfFile: FileList
  matrixPdfFile: FileList
  answersPdfFile: FileList
  mockExamQuestions: { [key: number]: MainQuestion };
}

export type CreateMockExam = {
  name: string
  className: ("Intensivo" | "Extensivo")[]
  releasedYear: string
  number: number
}