import useDebounceValue from "../../hooks/useDebounceValue";
import { Button } from "../../components/ui/shadcn/button";
import { EyeIcon, FileDown, Pencil, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { MockExam } from "../../interfaces";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetMockExamList } from "@/hooks/CRUD/mockExam/useGetMockExamList";
import { useDeleteMockExamById } from "@/hooks/CRUD/mockExam/useDeleteMockExambyId";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import Botao from "@/components/Shared/Botao";
import { Pagination } from "@/components/Pagination";

export function MockExams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

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

  const { data: mockExamPageResponse } = useGetMockExamList({
    query: urlFilter,
    page,
    pageSize,
  });

  const deleteMockExam = useDeleteMockExamById();

  function handleCreateNewMockExam() {
    navigate("/mock-exam/create");
  }

  function handleEditMockExam(mockExamId: string) {
    navigate(`/mock-exam/edit/${mockExamId}`);
  }

  async function handleDeleteMockExam(mockExamId: string) {
    await deleteMockExam.mutateAsync(mockExamId);
  }

  function getMockExamCode({ releasedYear, number, className }: MockExam) {
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
          <Botao perfil="novo" onClick={handleCreateNewMockExam} />
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
          </form>

          <Button variant="secondary">
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
                  <TableCell>
                    <span>{mockExam.name}</span>
                  </TableCell>
                  <TableCell>
                    {mockExam.className.map((name: string) => (
                      <span key={name}>{name}</span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <span>{mockExam.releasedYear}</span>
                  </TableCell>
                  <TableCell>
                    <span>{mockExam.number}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/mock-exam/${mockExam.id}/subjects`}
                      className="flex align-middle justify-center"
                    >
                      <span>
                        <Pencil className="size-3" />
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/mock-exams/${mockExam.id}/main-questions`}>
                      <span>
                        {Object.keys(mockExam.mockExamQuestions).length}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/mock-exam/${mockExam.id}/mock-exams-answers`}
                      className="flex align-middle justify-center"
                    >
                      <span>
                        <EyeIcon className="size-4" />
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right flex gap-1">
                    <Button
                      size="icon"
                      className="mx-0.5"
                      variant="muted"
                      onClick={() => handleEditMockExam(mockExam.id)}
                    >
                      <Pencil className="size-3" color="green" />
                    </Button>
                    <Button
                      size="icon"
                      className="mx-0.5"
                      variant="muted"
                      onClick={() => handleDeleteMockExam(mockExam.id)}
                    >
                      <X className="size-3" color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {mockExamPageResponse && (
          <Pagination
            pages={mockExamPageResponse.pages}
            items={mockExamPageResponse.pageItems}
            page={page}
            totalItems={mockExamPageResponse.totalItems}
          />
        )}
      </main>
    </>
  );
}
