import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pagination } from "../../components/pagination";
import { useEffect, useState } from "react";
import useDebounceValue from "../../hooks/useDebounceValue";
import { Button } from "../../components/ui/button";
import { FileDown, Search } from "lucide-react";
import { Control, Input } from "../../components/ui/input";
import { PageResponse } from "../../types";
import { MockExamDiagnosisResponse } from "../../types/MockExamResponse";
import { DiagnosisTable } from "../../components/diagnosis/diagnosisTable";
import { NavigationBar } from "../../components/NavigationBar";
import { successAlert } from "@/utils/toastAlerts";
import { Route } from "@/router/diagnosis";
import { Route as MockExamResponseRoute } from "@/router/mock-exams/response/$studentResponseId";

export function StudentsResponses() {
  const queryClient = useQueryClient();

  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { page, pageSize, query } = search;

  const [filter, setFilter] = useState(query);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  useEffect(() => {
    if (debouncedQueryFilter !== query) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: 1,
          query: debouncedQueryFilter,
        }),
      });
    }
  }, [debouncedQueryFilter, query, navigate]);

  const { data: studentsResponsePage, isLoading } = useQuery<
    PageResponse<MockExamDiagnosisResponse>
  >({
    queryKey: ["get-responses", query, page, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/students-response?pageNumber=${page - 1}&pageSize=${pageSize}&query=${query}`
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
          }
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

  const navigateToResponse = (studentResponseId: string) => {
    navigate({
      to: MockExamResponseRoute.to,
      params: { studentResponseId },
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <header>
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
            onViewResponse={navigateToResponse}
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
