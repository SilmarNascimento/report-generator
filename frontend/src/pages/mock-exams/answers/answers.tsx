import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NavigationBar } from "../../../components/NavigationBar";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { MainQuestion, MockExam } from "../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getAlternativeLetter } from "../../../utils/correctAnswerMapping";

export function MockExamAnswers() {
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";
  const mockExam = useRef<MockExam>();

  useQuery<MockExam>({
    queryKey: ["get-mock-exams", mockExamId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamId}`
      );
      const data: MockExam = await response.json();

      if (data) {
        mockExam.current = data;
      }

      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleUrlResolution(question: MainQuestion) {
    console.log(question);

    return question.videoResolutionUrl ? question.videoResolutionUrl : "-";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <NavigationBar />
      {mockExam.current && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>
                  <span>Número da Questão</span>
                </TableHead>
                <TableHead>
                  <span>Nível</span>
                </TableHead>
                <TableHead>
                  <span>Gabarito</span>
                </TableHead>
                <TableHead>
                  <span>Assuntos</span>
                </TableHead>
                <TableHead>
                  <span>Vídeo Resolução</span>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(mockExam.current.mockExamQuestions).map(
                ([questionIndex, mainQuestion]) => {
                  return (
                    <TableRow key={mainQuestion.id}>
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 justify-center items-center">
                          <span className="font-medium">
                            {Number(questionIndex)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <span>{mainQuestion.level}</span>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <span>{handleCorrectAnswer(mainQuestion)}</span>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <span>{mainQuestion.subjects[0].name}</span>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <span>{handleUrlResolution(mainQuestion)}</span>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
