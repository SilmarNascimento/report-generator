import { MockExamFormType } from "@/components/mockExam/mockExamSchema";
import { MockExam } from "@/interfaces";

export const mapMockExamToForm = (mockExam: MockExam): MockExamFormType => {
  return {
    name: mockExam.name,
    className: mockExam.className[0],
    releasedYear: mockExam.releasedYear.toString(),
    number: mockExam.number.toString(),
    coverPdfFile: mockExam.coverPdfFile.file,
    matrixPdfFile: mockExam.matrixPdfFile.file,
    answersPdfFile: mockExam.answersPdfFile.file,
  };
};
