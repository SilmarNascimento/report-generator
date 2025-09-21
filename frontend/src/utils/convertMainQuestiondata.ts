import { MainQuestion, MainQuestionReceived } from "../types/MainQuestion";
import { parseFile } from "./parseFile";

export function convertMainQuestionData(
  data: MainQuestionReceived
): MainQuestion {
  const { adaptedQuestionsPdfFile } = data;
  let answerIndex;
  const [adaptedQuestionFileHandle] = parseFile([adaptedQuestionsPdfFile]);

  data.alternatives.forEach((alternative, index) => {
    if (alternative.questionAnswer) {
      answerIndex = index;
    }
  });

  const formattedData: MainQuestion = {
    ...data,
    adaptedQuestionPdfFile: adaptedQuestionFileHandle,
    questionNumber: answerIndex ?? 0,
  };

  return formattedData;
}
