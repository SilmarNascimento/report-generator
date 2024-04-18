import { useNavigate, useParams } from 'react-router-dom';
import { AddSubjectManagerTable } from '../components/subject/addSubjectManagerTable';
import { RemoveSubjectManagerTable } from "../components/subject/removeSubjectManagerTable";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MainQuestion } from '../interfaces';
import { successAlert, warningAlert } from '../utils/toastAlerts';

export function Test() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "bf87b8fd-210f-4d57-b772-6b02265e352d";

  const { data: mainQuestionResponse } = useQuery<MainQuestion>({
    queryKey: ['get-main-questions', mainQuestionId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const addSubjectToMainQuestion = useMutation({
    mutationFn: async (subjectIdList: string[]) => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}/subject`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          subjectsId: subjectIdList
        }),
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        successAlert('Assuntos adicionados à questão principal com sucesso!');
        navigate("/main-questions");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  const removeSubjectToMainQuestion = useMutation({
    mutationFn: async (subjectIdList: string[]) => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}/subject`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({
          subjectsId: subjectIdList
        }),
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        successAlert('Assuntos removidos da questão principal com sucesso!');
        navigate("/main-questions");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  async function handleAddSubject(subjectIdList: string[]) {
    await addSubjectToMainQuestion.mutateAsync(subjectIdList)
  }

  async function handleRemoveSubject(subjectIdList: string[]) {
    await removeSubjectToMainQuestion.mutateAsync(subjectIdList)
  }

  return (
    <>
      <h1>pagina de teste</h1>
      {mainQuestionResponse &&  <AddSubjectManagerTable entity={mainQuestionResponse} handleAddSubjects={handleAddSubject}/>}
      {mainQuestionResponse && <RemoveSubjectManagerTable  entity={mainQuestionResponse} handleRemoveSubjects={handleRemoveSubject}/>}
    </>
  );
}