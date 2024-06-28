import { Subject } from "./Subject";
import { Alternative, CreateAlternative } from "./Alternative";
import { AdaptedQuestion } from "./AdaptedQuestion"
import { MockExam } from "./MockExam";
import { Handout } from "./Handout";
import { FileEntity, FileHandle } from "./FileEntity";

export type MainQuestionReceived = {
  id: string
  title: string
  subjects: Subject[]
  level: "Fácil" | "Médio" | "Difícil"
  images: string[]
  videoResolutionUrl: string
  adaptedQuestionsPdfFile: FileEntity
  alternatives: Alternative[]
  adaptedQuestions: AdaptedQuestion[]
  mockExams: MockExam[]
  handouts: Handout[]
}

export type MainQuestion =  {
  id: string
  title: string
  subjects: Subject[]
  level: "Fácil" | "Médio" | "Difícil"
  images: string[]
  alternatives: Alternative[]
  videoResolutionUrl: string
  adaptedQuestions: AdaptedQuestion[]
  adaptedQuestionPdfFile: FileHandle
  mockExams: MockExam[]
  handouts: Handout[]
  questionNumber: number
}

export type CreateQuestion = {
  title: string
  level: string
  alternatives: CreateAlternative[]
  videoResolutionUrl?: string
}