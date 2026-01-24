import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { MockExam, PageResponse, Subject } from "../../../interfaces";
import { successAlert, warningAlert } from "../../../utils/toastAlerts";
import { AddSubjectManagerTable } from "../../../components/subject/addSubjectManagerTable";
import { RemoveSubjectManagerTable } from "../../../components/subject/removeSubjectManagerTable";
import { useEffect, useRef, useState } from "react";
import useDebounceValue from "../../../hooks/useDebounceValue";
import { NavigationBar } from "../../../components/NavigationBar";

export function MockExamSubjectManager() {
  const queryClient = useQueryClient();
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const subjectIdList = useRef<string[]>();
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

  useQuery<MockExam>({
    queryKey: ["get-mock-exams", mockExamId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamId}`,
      );
      const data: MockExam = await response.json();

      if (data) {
        mockExam.current = data;
        subjectIdList.current = data.subjects.map((subject) => subject.id);
      }

      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });

  const { data: subjectPageResponse } = useQuery<PageResponse<Subject>>({
    queryKey: ["get-subjects", urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/subject/filter?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            subjectsId: subjectIdList.current,
          }),
        },
      );
      const requestData = await response.json();

      return requestData;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
    enabled: !!subjectIdList.current,
  });

  const addSubjectToMockExam = useMutation({
    mutationFn: async (subjectIdListToAdd: string[]) => {
      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamId}/subject`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            subjectsId: subjectIdListToAdd,
          }),
        },
      );

      if (response.status === 200) {
        const updatedMockExam: MockExam = await response.json();
        mockExam.current = updatedMockExam;
        subjectIdList.current = updatedMockExam.subjects.map(
          (subject) => subject.id,
        );
        queryClient.invalidateQueries({
          queryKey: ["get-subjects"],
        });

        subjectIdListToAdd.length === 1
          ? successAlert("Assunto adicionado ao simulado com sucesso!")
          : successAlert("Assuntos adicionados ao simulado com sucesso!");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  const removeSubjectFromMockExam = useMutation({
    mutationFn: async (subjectIdListToRemove: string[]) => {
      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamId}/subject`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
          body: JSON.stringify({
            subjectsId: subjectIdListToRemove,
          }),
        },
      );

      if (response.status === 200) {
        const updatedMainQuestion: MockExam = await response.json();
        mockExam.current = updatedMainQuestion;
        subjectIdList.current = updatedMainQuestion.subjects.map(
          (subject) => subject.id,
        );
        queryClient.invalidateQueries({
          queryKey: ["get-subjects"],
        });

        subjectIdListToRemove.length === 1
          ? successAlert("Assunto removido do simulado com sucesso!")
          : successAlert("Assuntos removidos do simulado com sucesso!");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  async function handleAddSubject(subjectIdList: string[]) {
    await addSubjectToMockExam.mutateAsync(subjectIdList);
  }

  async function handleRemoveSubject(subjectIdList: string[]) {
    await removeSubjectFromMockExam.mutateAsync(subjectIdList);
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
      {mockExam.current && (
        <RemoveSubjectManagerTable
          entity={mockExam.current.subjects}
          handleRemoveSubjects={handleRemoveSubject}
        />
      )}
    </>
  );
}
