import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "../../components/header";
import { NavigationBar } from "../../components/navigationBar";
import { Pagination } from "../../components/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { Button } from "../../components/ui/button";
import { EyeIcon, FileDown, Pencil, Plus, Search, X } from "lucide-react";
import { Control, Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { MockExam } from "../../interfaces";
import { Link } from "react-router-dom";
import { successAlert } from "../../utils/toastAlerts";
import { PageResponse } from "../../interfaces";

export function MockExams() {
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

  const { data: mockExamPageResponse, isLoading } = useQuery<PageResponse<MockExam>>({
    queryKey: ['get-mock-exams', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/mock-exam?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })

  console.log(mockExamPageResponse);
  

  const deleteMainQuestion = useMutation({
    mutationFn: async (mockExamId: string) => {
      try {
        await fetch(`http://localhost:8080/mock-exam/${mockExamId}`,
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
        queryKey: ['get-mock-exams'],
      });
      successAlert('Simulado excluído com sucesso!');
    }
  })

  function handleCreateNewMockExam() {
    navigate("/mock-exams/create");
  }
  
  function handleEditMockExam(mockExamId: string) {
    navigate(`/mock-exams/edit/${mockExamId}`);
  }
  
  async function handleDeleteMockExam(mockExamId: string) {
    await deleteMainQuestion.mutateAsync(mockExamId)
  }

  if (isLoading) {
    return null
  }

  function getMockExamCode({ releasedYear, number, className}: MockExam) {
    return `${releasedYear}:S${number}-${className[0]}`;
  }

  return (
    <>
      <header>
        <Header />
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Simulados</h1>
            <Button
              variant='primary'
              onClick={handleCreateNewMockExam}
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
                <span>Título</span>
              </TableHead>
              <TableHead>
                <span>Turma</span>
              </TableHead>
              <TableHead>
                <span>Ano de Emissão</span>
              </TableHead>
              <TableHead>
                <span>Número</span>
              </TableHead>
              <TableHead>
                <span>Assuntos</span>
              </TableHead>
              <TableHead>
                <span>Questões</span>
              </TableHead>
              <TableHead>
                <span>Gabarito</span>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExamPageResponse?.data.map((mockExam) => {
              return (
                <TableRow key={mockExam.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {getMockExamCode(mockExam)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {mockExam.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {mockExam.className.map((name: string) => (
                      <span key={name}>
                        {name}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {mockExam.releasedYear}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>
                      {mockExam.number}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/mock-exams/${mockExam.id}/subjects`} className="flex align-middle justify-center">
                      <span>
                        <Pencil className="size-3" />
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/mock-exams/${mockExam.id}/main-questions`}>
                      <span>
                        {Object.keys(mockExam.mockExamQuestions).length}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link to={`/mock-exams/${mockExam.id}/mock-exam-answers`} className="flex align-middle justify-center">
                      <span>
                        <EyeIcon className="size-4" />
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" className="mx-0.5" onClick={() => handleDeleteMockExam(mockExam.id)}>
                      <X className="size-3" color="red"/>
                    </Button>
                    <Button size="icon" className="mx-0.5" onClick={() => handleEditMockExam(mockExam.id)}>
                      <Pencil className="size-3" color="green"/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        { mockExamPageResponse
          && 
          <Pagination
            pages={mockExamPageResponse.pages}
            items={mockExamPageResponse.pageItems}
            page={page}
            totalItems={mockExamPageResponse.totalItems}
          />
        }
      </main>
    </>
  )
}