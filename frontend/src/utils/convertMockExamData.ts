import { MockExam, MockExamReceived } from "../interfaces/MockExam";
import { parseFile } from "./parseFile";

export function convertMockExamData(data: MockExamReceived): MockExam {
  const { coverPdfFile, matrixPdfFile, answersPdfFile } = data;
  const [coverFileHandle, matrixFileHandle, answerFileHandle] = parseFile([coverPdfFile, matrixPdfFile, answersPdfFile]);

  const formattedData: MockExam = {
    ...data,
    coverPdfFile: coverFileHandle,
    matrixPdfFile: matrixFileHandle,
    answersPdfFile: answerFileHandle
  };

  return formattedData;
}