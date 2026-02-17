import { NavigationBar } from "@/components/NavigationBar";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { MockExam } from "@/interfaces";
import { RemoveMainQuestionManagerTable } from "@/components/mainQuestion/removeMainQuestionManagerTable";
import { AddMainQuestionManagerTable } from "@/components/mainQuestion/addMainQuestionManagerTable";
import { useMockExamMainQuestionMutations } from "@/hooks/CRUD/mockExam/mainQuestionManager/useUpdateMockExamQuestions";
import { useGetMockExamMainQuestionManager } from "@/hooks/CRUD/mockExam/mainQuestionManager/useGetMockExamMainQuestionManager";
import { useFilteredMainQuestions } from "@/hooks/CRUD/mockExam/mainQuestionManager/useFilteredMainQuestions";

export function MockExamMainQuestionManager() {
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const mainQuestionIdList = useRef<string[]>();
  const mockExam = useRef<MockExam>();

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

  useGetMockExamMainQuestionManager(mockExamId, mockExam, mainQuestionIdList);

  const { data: mainQuestionPageResponse } = useFilteredMainQuestions(
    page,
    pageSize,
    urlFilter,
    mainQuestionIdList,
  );

  const { addMainQUestion, removeMainQuestion } =
    useMockExamMainQuestionMutations(mockExamId, mockExam, mainQuestionIdList);

  async function handleAddMainQuestion(subjectIdList: string[]) {
    await addMainQUestion.mutateAsync(subjectIdList);
  }

  async function handleRemoveMainQuestion(subjectIdList: string[]) {
    await removeMainQuestion.mutateAsync(subjectIdList);
  }

  return (
    <>
      <NavigationBar />
      {mainQuestionPageResponse && (
        <AddMainQuestionManagerTable
          entity={mainQuestionPageResponse}
          filter={filter}
          setFilter={setFilter}
          page={page}
          handleAddMainQuestion={handleAddMainQuestion}
        />
      )}
      {mockExam.current && (
        <RemoveMainQuestionManagerTable
          entity={Object.values(mockExam.current.mockExamQuestions)}
          handleRemoveMainQuestions={handleRemoveMainQuestion}
        />
      )}
    </>
  );
}
