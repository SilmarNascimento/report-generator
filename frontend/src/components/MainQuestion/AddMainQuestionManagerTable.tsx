import { FilePlus, Plus } from "lucide-react";
import { Button } from "../ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { MainQuestion, PageResponse } from "../../interfaces";
import { useState } from "react";
import { Pagination } from "../Pagination";
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";
import FiltroListagem from "../Shared/FiltroListagem";

type AddMainQuestionManagerTableProps = {
  entity: PageResponse<MainQuestion>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  handleAddMainQuestion: UseMutateAsyncFunction<void, Error, string[], unknown>;
};

export function AddMainQuestionManagerTable({
  entity,
  filter,
  setFilter,
  page,
  handleAddMainQuestion,
}: AddMainQuestionManagerTableProps) {
  const [mainQuestionIdToAdd, setMainQuestionIdToAdd] = useState<string[]>([]);

  function toggleCheckBox(subjectId: string) {
    setMainQuestionIdToAdd((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  }

  function getMainQuestionCode(mainQuestion: MainQuestion) {
    return mainQuestion.id;
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleClick(mainQuestionIdList: string[]) {
    setMainQuestionIdToAdd([]);
    handleAddMainQuestion(mainQuestionIdList);
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Questões principais disponíveis</h1>
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
          </form>

          <Button
            variant="secondary"
            onClick={() => handleClick(mainQuestionIdToAdd)}
          >
            <FilePlus className="size-3" />
            Adicionar todos
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>
                <span>Código</span>
              </TableHead>
              <TableHead>
                <span>Nível</span>
              </TableHead>
              <TableHead>
                <span>Assuntos</span>
              </TableHead>
              <TableHead>
                <span>Gabarito</span>
              </TableHead>
              <TableHead>
                <span>Questões adaptadas</span>
              </TableHead>
              <TableHead>
                <span>Simulados</span>
              </TableHead>
              <TableHead>
                <span>Apostilas</span>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entity?.data.map((mainQuestion) => {
              return (
                <TableRow key={mainQuestion.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={mainQuestionIdToAdd.includes(mainQuestion.id)}
                      onChange={() => toggleCheckBox(mainQuestion.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="font-medium">
                        {getMainQuestionCode(mainQuestion)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.level}</span>
                  </TableCell>
                  <TableCell>
                    <span>
                      {mainQuestion.subjects.length
                        ? mainQuestion.subjects[0].name
                        : "Sem assunto principal"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>{handleCorrectAnswer(mainQuestion)}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.adaptedQuestions.length}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.mockExams.length}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.handouts.length}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      className="mx-0.5"
                      variant="muted"
                      onClick={() => handleClick([mainQuestion.id])}
                    >
                      <Plus className="size-3" color="green" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {entity && (
          <Pagination
            pages={entity.pages}
            items={entity.pageItems}
            page={page}
            totalItems={entity.totalItems}
          />
        )}
      </div>
    </>
  );
}
