import { Subject } from "./Subject";
import { Alternative } from "./Alternative";
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
  adaptedQuestions: AdaptedQuestion[]
  mockExams: MockExam[]
  handouts: Handout[]
  questionNumber: number
}