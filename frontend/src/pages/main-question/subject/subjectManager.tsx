import { useParams, useSearchParams } from "react-router-dom";
import { MainQuestion } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { NavigationBar } from "@/components/NavigationBar";
import { useFilteredSubjectsForMainQuestion } from "@/hooks/CRUD/mainQuestion/subjectManager/useFilteredSubjects";
import { useGetMainQuestionSubjectManager } from "@/hooks/CRUD/mainQuestion/subjectManager/useGetMainQuestionSubjectManager";
import { useUpdateMainQuestionSubjects } from "@/hooks/CRUD/mainQuestion/subjectManager/useUpdateMainQuestionSubjects";
import { RemoveSubjectManagerTable } from "@/components/Subject/RemoveSubjectManagerTable";
import { AddSubjectManagerTable } from "@/components/Subject/AddSubjectManagerTable";

export function MainQuestionSubjectManager() {
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const subjectIdList = useRef<string[]>();
  const mainQuestion = useRef<MainQuestion>();

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

  useGetMainQuestionSubjectManager(mainQuestionId, mainQuestion, subjectIdList);

  const { data: subjectPageResponse } = useFilteredSubjectsForMainQuestion(
    page,
    pageSize,
    urlFilter,
    subjectIdList,
  );

  const { addSubject, removeSubject } = useUpdateMainQuestionSubjects(
    mainQuestionId,
    mainQuestion,
    subjectIdList,
  );

  async function handleAddSubject(subjectIdList: string[]) {
    await addSubject.mutateAsync(subjectIdList);
  }

  async function handleRemoveSubject(subjectIdList: string[]) {
    await removeSubject.mutateAsync(subjectIdList);
  }

  return (
    <>
      <NavigationBar />
      {subjectPageResponse && (
        <AddSubjectManagerTable
          entity={subjectPageResponse}
          filter={filter}
          setFilter={setFilter}
          page={page}
          handleAddSubjects={handleAddSubject}
        />
      )}
      {mainQuestion.current && (
        <RemoveSubjectManagerTable
          entity={mainQuestion.current.subjects}
          handleRemoveSubjects={handleRemoveSubject}
        />
      )}
    </>
  );
}
