import { FilePlus, Plus, Search } from "lucide-react";
import { Control, Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { PageResponse, Subject } from "../../interfaces";
import { useState } from "react";
import { Pagination } from "../pagination";

type AddSubjectManagerTableProps = ({
  entity: PageResponse<Subject>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  handleAddSubjects: UseMutateAsyncFunction<void, Error, string[], unknown>;
})

export function AddSubjectManagerTable({ entity, filter, setFilter, page, handleAddSubjects }: AddSubjectManagerTableProps) {
  const [subjectIdToAdd, setSubjectIdToAdd] = useState<string[]>([]);

  function toggleCheckBox(subjectId: string) {
    setSubjectIdToAdd(prev => (
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    ));
  }
  
  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Assuntos disponíveis</h1>
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

          <Button onClick={() => handleAddSubjects(subjectIdToAdd)}>
            <FilePlus className="size-3" />
            Adicionar todos
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
            {entity?.data.map((subject) => {
              return (
                <TableRow key={subject.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={subjectIdToAdd.includes(subject.id)}
                      onChange={() => toggleCheckBox(subject.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="font-medium">{subject.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {subject.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" className="mx-0.5" onClick={() => handleAddSubjects([subject.id])}>
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