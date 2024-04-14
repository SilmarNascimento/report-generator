import { FileDown, Search, X } from "lucide-react";
import { Control, Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { MockExam, MainQuestion, PageResponse, Subject } from "../../interfaces";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useDebounceValue from "../../hooks/useDebounceValue";
import { Pagination } from "../pagination";

type RemoveSubjectManagerTableProps = ({
  entity: MockExam;
  handleRemoveSubjects: (mockExamId: string, subjectsId: string[]) => Promise<void>;
} | {
  entity: MainQuestion;
  handleRemoveSubjects: (mainQuestionId: string, subjectsId: string[]) => Promise<void>;
});

export function AddSubjectManagerTable({ entity, handleRemoveSubjects }: RemoveSubjectManagerTableProps) {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  
  const previousSubjectsIdList = entity.subjects.map((subject: Subject) => subject.id);
  const [subjectIdToAdd, setSubjectIdToAdd] = useState<string[]>([]);
  const [subjectIdToDelete, setSubjectIdToDelete] = useState<string[]>([]);
  const [subjectIdList, setSubjectIdList] = useState<string[]>(previousSubjectsIdList);


  const urlFilter = searchParams.get('query') ?? '';
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  useEffect(() => {
    setSearchParams(params => {
      if (params.get('query') !== debouncedQueryFilter) {
        params.set('page', '1');
        params.set('query', debouncedQueryFilter);
        return new URLSearchParams(params);
      }
      return params;
    });
  }, [debouncedQueryFilter, setSearchParams]);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

  const { data: subjectPageResponse } = useQuery<PageResponse<Subject>>({
    queryKey: ['get-subjects', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/subject?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  function toggleCheckBox(subjectId: string) {
    subjectIdToAdd.find((id) => id === subjectId)
      ? setSubjectIdToAdd(subjectIdToAdd.filter((id) => id !== subjectId))
      : setSubjectIdToAdd(prev => ([...prev, subjectId]));
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
            {subjectPageResponse?.data.map((subject) => {
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
                    <Button size="icon" className="mx-0.5" onClick={() => handleRemoveSubjects(entity.id, subjectIdToAdd)}>
                      <X className="size-3" color="red"/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {subjectPageResponse && <Pagination pages={subjectPageResponse.pages} items={subjectPageResponse.pageItems} page={page} totalItems={subjectPageResponse.totalItems}/>}
      </div>
    </>
  );
}