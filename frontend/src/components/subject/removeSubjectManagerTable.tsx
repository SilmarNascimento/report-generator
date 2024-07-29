import { FileMinus, Search, X } from "lucide-react";
import { Control, Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Subject } from "../../interfaces";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { PaginationFromList } from "../paginationFromList";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

type RemoveSubjectManagerTableProps = ({
  entity: Subject[];
  handleRemoveSubjects: UseMutateAsyncFunction<void, Error, string[], unknown>;
});

export function RemoveSubjectManagerTable({ entity: subjectList, handleRemoveSubjects }: RemoveSubjectManagerTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [filteredEntity, setFilteredEntity] = useState<Subject[]>(subjectList);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const [subjectIdToDelete, setSubjectIdToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (debouncedQueryFilter) {
      setCurrentPage(1);
      const filteredSubject = subjectList.filter((subject) => subject.name.includes(debouncedQueryFilter));
      setFilteredEntity(filteredSubject);
      setFilter(debouncedQueryFilter);
    }
  }, [debouncedQueryFilter, currentPage, filter, subjectList]);

  function toggleCheckBox(subjectId: string) {
    setSubjectIdToDelete(prev => (
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    ));
  }

  function handleClick(subjectIdList: string[]) {
    setSubjectIdToDelete([]);
    handleRemoveSubjects(subjectIdList);
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Assuntos já adicionados</h1>
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

          <Button onClick={() => handleClick(subjectIdToDelete)}>
            <FileMinus className="size-3" />
            Remover todos
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
            {subjectList.map((subject) => {
              return (
                <TableRow key={subject.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={subjectIdToDelete.includes(subject.id)}
                      onChange={() => toggleCheckBox(subject.id)}/>
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
                    <Button size="icon" className="mx-0.5" onClick={() => handleClick([subject.id])}>
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