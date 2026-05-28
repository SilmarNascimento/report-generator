import { NavigationBar } from "@/components/NavigationBar";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { FileDown } from "lucide-react";
import { useGetStudentsResponseList } from "@/hooks/CRUD/student/response/useGetStudentsResponseList";
import { useHandleDeleteStudentResponse } from "@/hooks/CRUD/student/response/useHandleDeleteStudentResponse";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import { DiagnosisTable } from "@/components/Diagnosis/DiagnosisTable";
import { Loader } from "@/components/ui/loader/Loader";
import { Pagination } from "@/components/Pagination";
import Botao from "@/components/Shared/Botao";

export function StudentsResponses() {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const { data: studentsResponsePage, isLoading } = useGetStudentsResponseList(
    page,
    pageSize,
    urlFilter,
  );

  const deleteMutation = useHandleDeleteStudentResponse();

  async function handleDeleteStudentResponse(id: string) {
    await deleteMutation.mutateAsync(id);
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
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
          </form>

          <Botao variant="secondary" icon={<FileDown className="size-3" />}>
            Export
          </Botao>
        </div>

        {isLoading ? (
          <Loader />
        ) : !studentsResponsePage?.data?.length ? (
          <p className="text-center text-muted-foreground py-16">
            Nenhum registro encontrado
          </p>
        ) : (
          <>
            <DiagnosisTable
              entity={studentsResponsePage.data}
              deleteFunction={handleDeleteStudentResponse}
            />
            <Pagination
              pages={studentsResponsePage.pages}
              items={studentsResponsePage.pageItems}
              page={page}
              totalItems={studentsResponsePage.totalItems}
            />
          </>
        )}
      </main>
    </>
  );
}
