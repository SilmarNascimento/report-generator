import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { NavigationBar } from "@/components/NavigationBar";
import { useGetMockExamById } from "@/hooks/CRUD/mockExam/useGetMockExamById";
import { useGetSubjects } from "@/hooks/CRUD/subject/useGetSubjects";
import { useUpdateMockExamSubjects } from "@/hooks/CRUD/mockExam/subjectManager/useUpdateMockExamSubjects";
import { AddSubjectManagerTable } from "@/components/Subject/AddSubjectManagerTable";
import { RemoveSubjectManagerTable } from "@/components/Subject/RemoveSubjectManagerTable";

export function MockExamSubjectManager() {
  const { mockExamId = "" } = useParams<{ mockExamId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const { data: mockExam, isLoading } = useGetMockExamById(mockExamId);

  const excludedIds = useMemo(
    () => mockExam?.subjects.map((s) => s.id) ?? [],
    [mockExam],
  );

  const { data: subjectPageResponse } = useGetSubjects(
    page,
    10,
    urlFilter,
    excludedIds,
    !isLoading,
  );

  const { addSubjects, removeSubjects } = useUpdateMockExamSubjects(mockExamId);

  useEffect(() => {
    setSearchParams((params) => {
      if (params.get("query") !== debouncedQueryFilter) {
        params.set("page", "1");
        params.set("query", debouncedQueryFilter);
        return new URLSearchParams(params);
      }
      return params;
    });
  }, [debouncedQueryFilter, setSearchParams]);

  return (
    <>
      <NavigationBar />
      {subjectPageResponse && (
        <AddSubjectManagerTable
          entity={subjectPageResponse}
          filter={filter}
          setFilter={setFilter}
          page={page}
          handleAddSubjects={async (ids) => {
            try {
              await addSubjects.mutateAsync(ids);
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}
      {mockExam && (
        <RemoveSubjectManagerTable
          entity={mockExam.subjects}
          handleRemoveSubjects={async (ids) => {
            try {
              await removeSubjects.mutateAsync(ids);
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}
    </>
  );
}
