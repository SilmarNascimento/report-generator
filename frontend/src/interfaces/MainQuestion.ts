import { Subject } from "./Subject";
import { Alternative, CreateAlternative } from "./Alternative";
import { AdaptedQuestion } from "./AdaptedQuestion"
import { MockExam } from "./MockExam";
import { Handout } from "./Handout";

export type MainQuestion =  {
  id: string
  title: string
  subjects: Subject[]
  level: "Fácil" | "Médio" | "Difícil"
  images: string[]
  alternatives: Alternative[]
  videoResolutionUrl: string
  adaptedQuestions: AdaptedQuestion[]
  adaptedQuestionPdfFile: FileList
  mockExams: MockExam[]
  handouts: Handout[]
  questionNumber: number
}

export type PartialMainQuestion =  {
  id: string
  title: string
  subjects: Subject[]
  level: "Fácil" | "Médio" | "Difícil"
  images: string[]
  alternatives: Alternative[]
  videoResolutionUrl: string
  adaptedQuestions: AdaptedQuestion[]
  mockExams: MockExam[]
  handouts: Handout[]
  questionNumber: number
}

export type CreateQuestion = {
  title: string
  level: string
  alternatives: CreateAlternative[]
}