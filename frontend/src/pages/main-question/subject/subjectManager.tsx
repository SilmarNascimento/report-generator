import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { MainQuestion, PageResponse, Subject } from '../../../interfaces';
import { successAlert, warningAlert } from '../../../utils/toastAlerts';
import { AddSubjectManagerTable } from '../../../components/subject/addSubjectManagerTable';
import { RemoveSubjectManagerTable } from '../../../components/subject/removeSubjectManagerTable';
import { useEffect, useRef, useState } from 'react';
import useDebounceValue from '../../../hooks/useDebounceValue';


export function MainQuestionSubjectManager() {
  const queryClient = useQueryClient();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;
  const urlFilter = searchParams.get('query') ?? '';
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const subjectIdList = useRef<string[]>();
  const mainQuestion = useRef<MainQuestion>();


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


  useQuery<MainQuestion>({
    queryKey: ['get-main-questions', mainQuestionId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}`);
      const data: MainQuestion = await response.json();

      if (data) {
        mainQuestion.current = data;
        subjectIdList.current = data.subjects.map((subject) => subject.id);
      }

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const { data: subjectPageResponse } = useQuery<PageResponse<Subject>>({
    queryKey: ['get-subjects', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/subject/filter?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            subjectsId: subjectIdList.current
          })
        }
      )
      const requestData = await response.json();
      
      return requestData
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    enabled: !!subjectIdList.current
  });

  const addSubjectToMainQuestion = useMutation({
    mutationFn: async (subjectIdListToAdd: string[]) => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}/subject`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          subjectsId: subjectIdListToAdd
        }),
      })

      if (response.status === 200) {
        const updatedMainQuestion: MainQuestion = await response.json();
        mainQuestion.current = updatedMainQuestion;
        subjectIdList.current = updatedMainQuestion.subjects.map((subject) => subject.id);
        queryClient.invalidateQueries({
          queryKey: ['get-subjects'],
        });
        
        successAlert('Assuntos adicionados à questão principal com sucesso!');
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  const removeSubjectToMainQuestion = useMutation({
    mutationFn: async (subjectIdListToRemove: string[]) => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}/subject`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({
          subjectsId: subjectIdListToRemove
        }),
      })

      if (response.status === 200) {
        const updatedMainQuestion: MainQuestion = await response.json();
        mainQuestion.current = updatedMainQuestion;
        subjectIdList.current = updatedMainQuestion.subjects.map((subject) => subject.id);
        queryClient.invalidateQueries({
          queryKey: ['get-subjects'],
        });
        
        successAlert('Assuntos removidos da questão principal com sucesso!');
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  async function handleAddSubject(subjectIdList: string[]) {
    await addSubjectToMainQuestion.mutateAsync(subjectIdList);
  }

  async function handleRemoveSubject(subjectIdList: string[]) {
    await removeSubjectToMainQuestion.mutateAsync(subjectIdList)
  }

  return (
    <>
      <h1>pagina de teste</h1>
      {subjectPageResponse &&
        <AddSubjectManagerTable
          entity={subjectPageResponse}
          filter={filter}
          setFilter={setFilter}
          page={page}
          handleAddSubjects={handleAddSubject}
        />}
      {mainQuestion.current &&
        <RemoveSubjectManagerTable
          entity={mainQuestion.current.subjects}
          handleRemoveSubjects={handleRemoveSubject}
        />}
    </>
  );
}