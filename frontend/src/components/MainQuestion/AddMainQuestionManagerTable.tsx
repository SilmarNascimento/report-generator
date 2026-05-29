import { FilePlus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { MainQuestion, PageResponse } from "../../interfaces";
import { useEffect, useState } from "react";
import { Pagination } from "../Pagination";
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";
import FiltroListagem from "../Shared/FiltroListagem";
import Botao from "../Shared/Botao";

type AddMainQuestionManagerTableProps = {
  entity: PageResponse<MainQuestion>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  maxReached: boolean;
  isFetching: boolean;
  onAddQuestions: (questions: MainQuestion[]) => void;
};

export function AddMainQuestionManagerTable({
  entity,
  filter,
  setFilter,
  page,
  maxReached,
  isFetching,
  onAddQuestions,
}: AddMainQuestionManagerTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const currentAvailableIds = new Set(entity.data.map((q) => q.id));

    setSelectedIds((prev) => prev.filter((id) => currentAvailableIds.has(id)));
  }, [entity.data]);

  function toggleCheckBox(questionId: string) {
    setSelectedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleAdd(questions: MainQuestion[]) {
    setSelectedIds([]);
    onAddQuestions(questions);
  }

  function getSelectedQuestions() {
    return entity.data.filter((q) => selectedIds.includes(q.id));
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Questões disponíveis</h1>
          {maxReached && (
            <span className="text-sm text-destructive font-medium">
              Limite de 45 questões atingido
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
          </form>

          <Botao
            variant="secondary"
            disabled={selectedIds.length === 0 || maxReached || isFetching}
            icon={<FilePlus className="size-3" />}
            onClick={() => handleAdd(getSelectedQuestions())}
          >
            Adicionar selecionados ({selectedIds.length})
          </Botao>
        </div>

        <div className={`transition-opacity duration-200 ${isFetching ? "opacity-50" : ""}`}>
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
            {entity?.data.map((mainQuestion) => (
              <TableRow key={mainQuestion.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(mainQuestion.id)}
                    onChange={() => toggleCheckBox(mainQuestion.id)}
                    disabled={maxReached}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="font-medium">{mainQuestion.id}</span>
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
                  <Botao
                    size="icon"
                    className="mx-0.5"
                    variant="muted"
                    disabled={maxReached || isFetching}
                    onClick={() => handleAdd([mainQuestion])}
                  >
                    <Plus className="size-3" color="green" />
                  </Botao>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
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
