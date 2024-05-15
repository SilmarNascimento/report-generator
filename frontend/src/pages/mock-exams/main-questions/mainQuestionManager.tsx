import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavigationBar } from "../../../components/navigationBar";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useDebounceValue from "../../../hooks/useDebounceValue";
import { MainQuestion, MockExam } from "../../../interfaces";
import { successAlert, warningAlert } from "../../../utils/toastAlerts";
import { PageResponse } from "../../../interfaces";
import { RemoveMainQuestionManagerTable } from "../../../components/mainQuestion/removeMainQuestionManagerTable";
import { AddMainQuestionManagerTable } from "../../../components/mainQuestion/addMainQuestionManagerTable";

export function MockExamMainQuestionManager() {
  const queryClient = useQueryClient();
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;
  const urlFilter = searchParams.get('query') ?? '';
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const mainQuestionIdList = useRef<string[]>();
  const mockExam = useRef<MockExam>();

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


  useQuery<MockExam>({
    queryKey: ['get-mock-exams', mockExamId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/mock-exam/${mockExamId}`)
      const data: MockExam = await response.json();

      if (data) {
        mockExam.current = data;
        mainQuestionIdList.current = Object.values(data.mockExamQuestions)
          .map((question: MainQuestion) => question.id);
      }

      return data
    },
    placeholderData: keepPreviousData,
  });

  const { data: mainQuestionPageResponse } = useQuery<PageResponse<MainQuestion>>({
    queryKey: ['get-main-questions', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/filter?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            mainQuestionsId: mainQuestionIdList.current
          })
        }
      )
      const requestData = await response.json();
      
      return requestData
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    enabled: !!mainQuestionIdList.current
  });

  const addMainQuestionToMockExam = useMutation({
    mutationFn: async (mainQuestionIdListToAdd: string[]) => {
      const response = await fetch(`http://localhost:8080/mock-exam/${mockExamId}/main-question`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          mainQuestionsId: mainQuestionIdListToAdd
        }),
      })

      if (response.status === 200) {
        const updatedMockExam: MockExam = await response.json();
        mockExam.current = updatedMockExam;
        mainQuestionIdList.current = Object.values(updatedMockExam.mockExamQuestions)
          .map((question: MainQuestion) => question.id);
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        
        mainQuestionIdListToAdd.length === 1
          ? successAlert('Questão principal adicionada ao simulado com sucesso!')
          : successAlert('Questões principais adicionadas ao simulado com sucesso!');
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }

      if (response.status === 409) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  });

  const removeMainQuestionFromMockExam = useMutation({
    mutationFn: async (mainQuestionIdListToRemove: string[]) => {
      const response = await fetch(`http://localhost:8080/mock-exam/${mockExamId}/main-question`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({
          mainQuestionsId: mainQuestionIdListToRemove
        }),
      })

      if (response.status === 200) {
        const updatedMockExam: MockExam = await response.json();
        mockExam.current = updatedMockExam;
        mainQuestionIdList.current = Object.values(updatedMockExam.mockExamQuestions)
          .map((question: MainQuestion) => question.id);
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        
        mainQuestionIdListToRemove.length === 1
          ? successAlert('Questão principal removida do simulado com sucesso!')
          : successAlert('Questões principais removidas do simulado com sucesso!');
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  });

  async function handleAddMainQuestion(subjectIdList: string[]) {
    await addMainQuestionToMockExam.mutateAsync(subjectIdList);
  }

  async function handleRemoveMainQuestion(subjectIdList: string[]) {
    await removeMainQuestionFromMockExam.mutateAsync(subjectIdList)
  }

  return (
    <>
      <NavigationBar />
      {mainQuestionPageResponse &&
        <AddMainQuestionManagerTable 
          entity={mainQuestionPageResponse}
          filter={filter}
          setFilter={setFilter}
          page={page}
          handleAddMainQuestion={handleAddMainQuestion}
        />}
      {mockExam.current && 
        <RemoveMainQuestionManagerTable
          entity={Object.values(mockExam.current.mockExamQuestions)}
          handleRemoveMainQuestions={handleRemoveMainQuestion}
        />}
    </>
  )
}