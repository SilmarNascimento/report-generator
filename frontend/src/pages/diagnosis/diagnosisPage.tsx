import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Header } from "../../components/header";
import { NavigationBar } from "../../components/NavigationBar";
import { Pagination } from "../../components/pagination";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { Button } from "../../components/ui/shadcn/button";
import { FileDown, Search } from "lucide-react";
import { Control, Input } from "../../components/ui/shadcn/input";
import { successAlert } from "../../utils/toastAlerts";
import { PageResponse } from "../../interfaces";
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import { DiagnosisTable } from "../../components/diagnosis/diagnosisTable";

export function StudentsResponses() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  //const navigate = useNavigate();

  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

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

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;

  const { data: studentsResponsePage, isLoading } = useQuery<
    PageResponse<MockExamDiagnosisResponse>
  >({
    queryKey: ["get-responses", urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/students-response?pageNumber=${page - 1}&pageSize=${pageSize}&query=${urlFilter}`,
      );
      const data = await response.json();

      return data;
    },
    placeholderData: keepPreviousData,
  });

  const deleteResponse = useMutation({
    mutationFn: async (studentResponseId: string) => {
      try {
        await fetch(
          `http://localhost:8080/students-response/${studentResponseId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "DELETE",
          },
        );
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-responses"],
      });
      successAlert("Resposta do aluno para o simulado excluída com sucesso!");
    },
  });

  async function handleDeleteStudentResponse(studentResponseId: string) {
    await deleteResponse.mutateAsync(studentResponseId);
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      <header>
        <Header />
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Respostas de Simulados</h1>
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Procurar..."
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
              />
            </Input>
          </form>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        {studentsResponsePage && (
          <DiagnosisTable
            entity={studentsResponsePage?.data}
            deleteFunction={handleDeleteStudentResponse}
          />
        )}
        {studentsResponsePage && (
          <Pagination
            pages={studentsResponsePage.pages}
            items={studentsResponsePage.pageItems}
            page={page}
            totalItems={studentsResponsePage.totalItems}
          />
        )}
      </main>
    </>
  );
}
