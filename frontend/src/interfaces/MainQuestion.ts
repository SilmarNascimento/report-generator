import { Subject } from "./Subject";
import { Alternative, CreateAlternative } from "./Alternative";
import { AdaptedQuestion } from "./AdaptedQuestion";
import { MockExam } from "./MockExam";
import { Handout } from "./Handout";
import { FileEntity, FileHandle } from "./FileEntity";
import { LerikucasEnum, QuestionLevelEnum } from "@/constants/general";

export type QuestionPattern = "ARITMETICA" | "ALGEBRA" | "GEOMETRIA";

export type LevelType = QuestionLevelEnum;

export type LerikucasType = LerikucasEnum;

export type MainQuestionReceived = {
  id: string;
  title: string;
  subjects: Subject[];
  level: LevelType;
  lerickucas: number;
  pattern: QuestionPattern;
  weight: number;
  images: string[];
  videoResolutionUrl: string;
  adaptedQuestionsPdfFile: FileEntity;
  alternatives: Alternative[];
  adaptedQuestions: AdaptedQuestion[];
  mockExams: MockExam[];
  handouts: Handout[];
};

export type MainQuestion = {
  id: string;
  title: string;
  subjects: Subject[];
  level: LevelType;
  lerickucas: number;
  pattern: QuestionPattern;
  weight: number;
  images: string[];
  alternatives: Alternative[];
  videoResolutionUrl: string;
  adaptedQuestions: AdaptedQuestion[];
  adaptedQuestionPdfFile: FileHandle;
  mockExams: MockExam[];
  handouts: Handout[];
  questionNumber: number;
};

export type CreateQuestion = {
  title: string;
  level: string;
  lerickucas?: number;
  pattern?: QuestionPattern;
  alternatives: CreateAlternative[];
  videoResolutionUrl?: string;
};
