import { Pagination } from "@/components/Pagination";
import Botao from "@/components/Shared/Botao";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { MainQuestion, PageResponse } from "@/interfaces";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import { FilePlus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

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

  const INITIAL_QUESTION_NUMBER = 136;

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
      <div className="space-y-5">
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

        <div
          className={`transition-opacity duration-200 ${isFetching ? "opacity-50" : ""}`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Nº</TableHead>
                <TableHead>Gabarito</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Lerikucas</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Área da Matemática</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entity?.data.map((mainQuestion, index) => (
                <TableRow key={mainQuestion.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(mainQuestion.id)}
                      onChange={() => toggleCheckBox(mainQuestion.id)}
                      disabled={maxReached}
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {INITIAL_QUESTION_NUMBER + index}
                  </TableCell>
                  <TableCell>
                    <span>{handleCorrectAnswer(mainQuestion)}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.level}</span>
                  </TableCell>
                  <TableCell>{mainQuestion.lerickucas}</TableCell>
                  <TableCell>
                    <span>{mainQuestion.mainSubject?.name ?? "—"}</span>
                  </TableCell>
                  <TableCell>{mainQuestion.pattern}</TableCell>
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
