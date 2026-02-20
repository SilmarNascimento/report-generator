import { CLASS_GROUP } from "@/constants/students";
import { MainQuestion } from ".";
import { FileEntity, FileHandle } from "./FileEntity";
import { Subject } from "./Subject";

export type MockExamReceived = {
  id: string;
  name: string;
  className: CLASS_GROUP[];
  subjects: Subject[];
  releasedYear: string;
  number: number;
  coverPdfFile: FileEntity;
  matrixPdfFile: FileEntity;
  answersPdfFile: FileEntity;
  mockExamQuestions: { [key: number]: MainQuestion };
};

export type MockExam = {
  id: string;
  name: string;
  className: CLASS_GROUP[];
  subjects: Subject[];
  releasedYear: string;
  number: number;
  coverPdfFile: FileHandle;
  matrixPdfFile: FileHandle;
  answersPdfFile: FileHandle;
  mockExamQuestions: { [key: number]: MainQuestion };
};

export type CreateMockExam = {
  name: string;
  className: CLASS_GROUP[];
  releasedYear: string;
  number: number;
};
