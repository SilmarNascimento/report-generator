import { FileMinus, Pencil, Search, X } from "lucide-react";
import { Control, Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { MainQuestion } from "../../interfaces";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { PaginationFromList } from "../paginationFromList";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";

type RemoveMainQuestionManagerTableProps = ({
  entity: MainQuestion[];
  handleRemoveMainQuestions: UseMutateAsyncFunction<void, Error, string[], unknown>;
});

export function RemoveMainQuestionManagerTable({ entity: mainQuestionList, handleRemoveMainQuestions }: RemoveMainQuestionManagerTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [filteredEntity, setFilteredEntity] = useState<MainQuestion[]>(mainQuestionList);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);
  const [mainQuestionIdToDelete, setMainQuestionIdToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (debouncedQueryFilter) {
      setCurrentPage(1);
      const filteredSubject = mainQuestionList.filter((mainQuestion) => mainQuestion.title.includes(debouncedQueryFilter));
      setFilteredEntity(filteredSubject);
      setFilter(debouncedQueryFilter);
    }
  }, [debouncedQueryFilter, currentPage, filter]);

  function toggleCheckBox(subjectId: string) {
    setMainQuestionIdToDelete(prev => (
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    ));
  }

  function getMainQuestionCode(mainQuestion: MainQuestion) {
    return mainQuestion.id;
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(alternative => alternative.questionAnswer);
    return getAlternativeLetter(correctIndex);
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Questões principais já adicionadas</h1>
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <Input variant='filter'>
              <Search className="size-3" />
              <Control 
                placeholder="Search tags..." 
                onChange={event => setFilter(event.target.value)}
                value={filter}
              />
            </Input>
          </form>

          <Button onClick={() => handleRemoveMainQuestions(mainQuestionIdToDelete)}>
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
            {mainQuestionList.map((mainQuestion) => {
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
                  <TableCell className="text-zinc-300">
                    <span>
                      {mainQuestion.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                      <span>
                        <Pencil className="size-3" color="green"/>
                      </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {handleCorrectAnswer(mainQuestion)}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {mainQuestion.adaptedQuestions.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {mainQuestion.mockExams.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {mainQuestion.handouts.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" className="mx-0.5" onClick={() => handleRemoveMainQuestions([mainQuestion.id])}>
                      <X className="size-3" color="red"/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
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