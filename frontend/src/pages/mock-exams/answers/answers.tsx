import { NavigationBar } from "@/components/NavigationBar";
import { useParams } from "react-router-dom";
import { MainQuestion } from "@/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import { useGetMockExamById } from "@/hooks/CRUD/mockExam/useGetMockExamById";

export function MockExamAnswers() {
  const { mockExamId } = useParams<{ mockExamId: string }>();
  const { data: mockExam } = useGetMockExamById(mockExamId ?? "");

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleUrlResolution(question: MainQuestion) {
    return question.videoResolutionUrl ? question.videoResolutionUrl : "-";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <NavigationBar />
      {mockExam && (
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
              {Object.entries(mockExam.mockExamQuestions).map(
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
                      <TableCell>
                        <span>{mainQuestion.level}</span>
                      </TableCell>
                      <TableCell>
                        <span>{handleCorrectAnswer(mainQuestion)}</span>
                      </TableCell>
                      <TableCell>
                        <span>{mainQuestion.subjects[0].name}</span>
                      </TableCell>
                      <TableCell>
                        <span>{handleUrlResolution(mainQuestion)}</span>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
