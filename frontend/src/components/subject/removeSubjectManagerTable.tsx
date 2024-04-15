import { FileDown, Search, X } from "lucide-react";
import { Control, Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { MockExam, MainQuestion, Subject } from "../../interfaces";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { PaginationFromList } from "../paginationFromList";

type RemoveSubjectManagerTableProps = ({
  entity: MockExam;
  handleRemoveSubjects: (mockExamId: string, subjectsId: string[]) => Promise<void>;
} | {
  entity: MainQuestion;
  handleRemoveSubjects: (mainQuestionId: string, subjectsId: string[]) => Promise<void>;
});

export function RemoveSubjectManagerTable({ entity, handleRemoveSubjects }: RemoveSubjectManagerTableProps) {
  const [filteredEntity, setFilteredEntity] = useState<Subject[]>(entity.subjects);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const debouncedQueryFilter = useDebounceValue(filter, 1000);
  const [subjectIdToDelete, setSubjectIdToDelete] = useState<string[]>([]);
  const entitySubjects = entity.subjects;

  useEffect(() => {
    if (filter !== debouncedQueryFilter) {
      setCurrentPage(1);
      setFilter(debouncedQueryFilter);
      filterSubject();
    }
  }, [debouncedQueryFilter, currentPage, filter]);

  function filterSubject() {
    const filteredSubject = entitySubjects.filter((subject) => subject.name.includes(filter));
    setFilteredEntity(filteredSubject);

  }

  function toggleCheckBox(subjectId: string) {
    subjectIdToDelete.find((id) => id === subjectId)
      ? setSubjectIdToDelete(subjectIdToDelete.filter((id) => id !== subjectId))
      : setSubjectIdToDelete(prev => ([...prev, subjectId]));
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Assuntos</h1>
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

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Id</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entitySubjects.map((subject) => {
              return (
                <TableRow key={subject.id}>
                  <TableCell>
                    <input type="checkbox" onClick={() => toggleCheckBox(subject.id)}/>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{subject.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {subject.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" className="mx-0.5" onClick={() => handleRemoveSubjects(entity.id, subjectIdToDelete)}>
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