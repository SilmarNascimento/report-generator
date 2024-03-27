import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import useDebounceValue from "../../hooks/useDebounceValue";
import { AdaptedQuestion } from "../../interfaces";

export function AdaptedQuestions() {
  const queryClient = useQueryClient();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const { data: adaptedQuestionsPageResponse, isLoading } = useQuery<AdaptedQuestion[]>({
    queryKey: ['get-main-questions', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}/adapted-question`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })

  const deleteAdaptedQuestion = useMutation({
    mutationFn: async (adaptedQuestionId: string) => {
      await fetch(`http://localhost:8080/main-question/${mainQuestionId}/adapted-question/${adaptedQuestionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-main-questions'],
      });
      toast.success('Questão adaptada excluída com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  })

  function handleCreateAdaptedQuestion() {
    navigate(`/main-questions/${mainQuestionId}/adapted-question`);
  }
  
  function handleEditAdaptedQuestion(mainQuestionId: string) {
    navigate(`/main-questions/${mainQuestionId}/`);
  }
  
  async function handleDeleteAdaptedQuestion({ id: adaptedQuestionId }: AdaptedQuestion) {
    await deleteAdaptedQuestion.mutateAsync(adaptedQuestionId)
  }

  if (isLoading) {
    return null
  }

  return (
    <h1>Adapted Questions</h1>
  )
}