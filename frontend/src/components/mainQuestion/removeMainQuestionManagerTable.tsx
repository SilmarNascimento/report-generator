import { FileMinus, X } from "lucide-react";
import { Button } from "../ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MainQuestion } from "../../interfaces";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { PaginationFromList } from "../paginationFromList";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";
import FiltroListagem from "../shared/FiltroListagem";

type RemoveMainQuestionManagerTableProps = {
  entity: { [key: number]: MainQuestion };
  handleRemoveMainQuestions: UseMutateAsyncFunction<
    void,
    Error,
    string[],
    unknown
  >;
};

export function RemoveMainQuestionManagerTable({
  entity,
  handleRemoveMainQuestions,
}: RemoveMainQuestionManagerTableProps) {
  const mainQuestionList = Object.values(entity);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [filteredEntity, setFilteredEntity] =
    useState<MainQuestion[]>(mainQuestionList);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);
  const [mainQuestionIdToDelete, setMainQuestionIdToDelete] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (debouncedQueryFilter) {
      setCurrentPage(1);
      const filteredSubject = mainQuestionList.filter((mainQuestion) =>
        mainQuestion.title.includes(debouncedQueryFilter),
      );
      setFilteredEntity(filteredSubject);
      setFilter(debouncedQueryFilter);
    }
  }, [debouncedQueryFilter, currentPage, filter, mainQuestionList]);

  function toggleCheckBox(subjectId: string) {
    setMainQuestionIdToDelete((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  }

  function getMainQuestionCode(mainQuestion: MainQuestion) {
    return mainQuestion.id;
  }

  function getMainQuestionNumber(questionIndex: number) {
    const questionsNumber = Object.keys(entity);
    return Number(questionsNumber[questionIndex]) + 136;
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleClick(subjectIdList: string[]) {
    setMainQuestionIdToDelete([]);
    handleRemoveMainQuestions(subjectIdList);
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">
            Questões principais já adicionadas
          </h1>
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
          </form>

          <Button onClick={() => handleClick(mainQuestionIdToDelete)}>
            <FileMinus className="size-3" />
            Remover todos
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
                <span>Número da Questão</span>
              </TableHead>
              <TableHead>
                <span>Gabarito</span>
              </TableHead>
              <TableHead>
                <span>Área da Matemática</span>
              </TableHead>
              <TableHead>
                <span>Nível</span>
              </TableHead>
              <TableHead>
                <span>Lerikucas</span>
              </TableHead>
              <TableHead>
                <span>Assuntos</span>
              </TableHead>
              <TableHead>
                <span>Questões adaptadas</span>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mainQuestionList.map((mainQuestion, questionIndex) => {
              return (
                <TableRow key={mainQuestion.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={mainQuestionIdToDelete.includes(mainQuestion.id)}
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
                    <div className="flex flex-col gap-0.5 justify-center items-center">
                      <span className="font-medium">
                        {getMainQuestionNumber(questionIndex)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{handleCorrectAnswer(mainQuestion)}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.pattern}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.level}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.lerickucas}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mainQuestion.subjects[0].name}</span>
                  </TableCell>

                  <TableCell>
                    <span>{mainQuestion.adaptedQuestions.length}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      className="mx-0.5"
                      variant="muted"
                      onClick={() => handleClick([mainQuestion.id])}
                    >
                      <X className="size-3" color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <PaginationFromList
          page={currentPage}
          items={pageSize}
          totalItems={filteredEntity.length}
          pages={Math.ceil(filteredEntity.length / pageSize)}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      </div>
    </>
  );
}
