import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "../../../components/header";
import { NavigationBar } from "../../../components/navigationBar";
import { Pagination } from "../../../components/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounceValue from "../../../hooks/useDebounceValue";
import { Button } from "../../../components/ui/button";
import { FileDown, Pencil, Plus, Search, X } from "lucide-react";
import { Control, Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MainQuestion } from "../../../interfaces";
import { Link } from "react-router-dom";
import { successAlert } from "../../../utils/toastAlerts";
import { getAlternativeLetter } from "../../../utils/correctAnswerMapping";
import { PageResponse } from "../../../interfaces";

export function MainQuestionsFromMockExam() {
  const queryClient = useQueryClient();
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

  const { data: mainQuestionPageResponse, isLoading } = useQuery<PageResponse<MainQuestion>>({
    queryKey: ['get-main-questions', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })

  const deleteMainQuestion = useMutation({
    mutationFn: async ({ id: mainQuestionId }: MainQuestion) => {
      try {
        await fetch(`http://localhost:8080/main-question/${mainQuestionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        })
      
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-main-questions'],
      });
      successAlert('Questão principal excluída com sucesso!');
    }
  })

  function handleCreateNewMainQuestion() {
    navigate("/main-questions/create");
  }
  
  function handleEditMainQuestion(mainQuestionId: string) {
    navigate(`/main-questions/edit/${mainQuestionId}`);
  }
  
  async function handleDeleteMainQuestion(question: MainQuestion) {
    await deleteMainQuestion.mutateAsync(question)
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(alternative => alternative.questionAnswer);
    return getAlternativeLetter(correctIndex);
  }

  if (isLoading) {
    return null
  }

  function getMainQuestionCode(question: MainQuestion) {
    const hasHandout = question.handouts.length !== 0;
    const hasMockExams = question.mockExams.length !== 0;
    if (!hasHandout && !hasMockExams) {
      return "Reserva";
    } else if (hasHandout && !hasMockExams) {
      return `${question.handouts[0].releasedYear}:A${question.handouts[0].volume}:${question.questionNumber}`;
    } else if (!hasHandout && hasMockExams) {
      return `${question.mockExams[0].releasedYear}:S${question.mockExams[0].number}:${question.questionNumber}`;
    }
    return ""
  }

  return (
    <>
      <header>
        <Header />
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Questões Principais</h1>
            <Button
              variant='primary'
              onClick={handleCreateNewMainQuestion}
            >
              <Plus className="size-3" />
              Create new
            </Button>
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
              <TableHead>
                <span>Código</span>
              </TableHead>
              <TableHead>
                <span>Nível</span>
              </TableHead>
              <TableHead>
                <span>Gabarito</span>
              </TableHead>
              <TableHead>
                <span>Questões adaptadas</span>
              </TableHead>
              <TableHead>
                <span>Simulados</span>
              </TableHead>
              <TableHead>
                <span>Apostilas</span>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mainQuestionPageResponse?.data.map((question) => {
              return (
                <TableRow key={question.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {getMainQuestionCode(question)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {question.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {handleCorrectAnswer(question)}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/main-questions/${question.id}/adapted-questions`}>
                      <span>
                        {question.adaptedQuestions.length}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/main-question/${question.id}/mock-exams`}>
                      <span>
                        {question.mockExams.length}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/main-question/${question.id}/handouts`}>
                      <span>
                        {question.handouts.length}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" className="mx-0.5" onClick={() => handleDeleteMainQuestion(question)}>
                      <X className="size-3" color="red"/>
                    </Button>
                    <Button size="icon" className="mx-0.5" onClick={() => handleEditMainQuestion(question.id)}>
                      <Pencil className="size-3" color="green"/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        { mainQuestionPageResponse
          && 
          <Pagination
            pages={mainQuestionPageResponse.pages}
            items={mainQuestionPageResponse.pageItems}
            page={page}
            totalItems={mainQuestionPageResponse.totalItems}
          />
        }
      </main>
    </>
  )
}