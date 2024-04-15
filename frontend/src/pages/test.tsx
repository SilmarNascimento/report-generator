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
    mutationFn: async (subjectList: string[]) => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}/subject`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          subjectsId: subjectList
        }),
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        successAlert('Questão principal alterada com sucesso!');
        navigate("/main-questions");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  return (
    <>
      <AddSubjectManagerTable entity={mainQuestionResponse} handleAddSubjects={addSubjectToMainQuestion}/>
      <RemoveSubjectManagerTable  entity={mainQuestionResponse} handleRemoveSubjects={}/>
    </>
  );
}