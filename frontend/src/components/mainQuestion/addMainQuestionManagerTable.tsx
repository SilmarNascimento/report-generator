import { FilePlus, Pencil, Plus, Search } from "lucide-react";
import { Control, Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { MainQuestion, PageResponse } from "../../interfaces";
import { useState } from "react";
import { Pagination } from "../pagination";
import { Link } from "react-router-dom";
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";

type AddMainQuestionManagerTableProps = ({
  entity: PageResponse<MainQuestion>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  handleAddMainQuestion: UseMutateAsyncFunction<void, Error, string[], unknown>;
})

export function AddMainQuestionManagerTable({ entity, filter, setFilter, page, handleAddMainQuestion }: AddMainQuestionManagerTableProps) {
  const [mainQuestionIdToAdd, setMainQuestionIdToAdd] = useState<string[]>([]);

  function toggleCheckBox(subjectId: string) {
    setMainQuestionIdToAdd(prev => (
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
          <h1 className="text-xl font-bold">Questões principais disponíveis</h1>
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

          <Button onClick={() => handleAddMainQuestion(mainQuestionIdToAdd)}>
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
                  <TableCell className="text-zinc-300">
                    <span>
                      {mainQuestion.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/main-questions/${mainQuestion.id}/subjects`}>
                      <span>
                        <Pencil className="size-3" color="green"/>
                      </span>
                    </Link>
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
                    <Button size="icon" className="mx-0.5" onClick={() => handleAddMainQuestion([mainQuestion.id])}>
                      <Plus className="size-3" color="red"/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {entity && <Pagination pages={entity.pages} items={entity.pageItems} page={page} totalItems={entity.totalItems}/>}
      </div>
    </>
  );
}