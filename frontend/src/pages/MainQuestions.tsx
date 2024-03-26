import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "../components/header";
import { NavigationBar } from "../components/navigationBar";
import { Pagination } from "../components/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounceValue from "../hooks/useDebounceValue";
import { Button } from "../components/ui/button";
import { FileDown, Pencil, Plus, Search, X } from "lucide-react";
import { Control, Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MainQuestion, MainQuestionPageResponse } from "../interfaces";

export function MainQuestions() {
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

  const { data: mainQuestionPageResponse, isLoading } = useQuery<MainQuestionPageResponse>({
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
      })
    }
  })

  async function handleDeleteMainQuestion(question: MainQuestion) {
    await deleteMainQuestion.mutateAsync(question)
  }

  if (isLoading) {
    return null
  }

  function handleEditMainQuestion(mainQuestionId: string) {
    navigate(`/main-questions/edit/${mainQuestionId}`);
  }

  function handleCreateNewMainQuestion() {
    navigate("/main-questions/create");
  }

  return (
    <>
      <div>
        <Header />
        <NavigationBar />
      </div>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Subjects</h1>
            <Button
              variant='primary'
              onClick={handleCreateNewMainQuestion}
            >
              <Plus className="size-3" />
              Nova Questão Principal
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
                <span>Enunciado</span>
              </TableHead>
              <TableHead>
                <span>Nível</span>
              </TableHead>
              <TableHead>
                <span>Número de questões alternativas</span>
              </TableHead>
              <TableHead>
                <span>Número de simulados</span>
              </TableHead>
              <TableHead>
                <span>Número de apostilas</span>
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
                        {question.title}
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
                      {question.adaptedQuestions.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                  <span>
                      {question.mockExams.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {question.handouts.length}
                    </span>
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