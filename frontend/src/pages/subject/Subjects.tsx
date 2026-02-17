import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { Pagination } from "@/components/Pagination";
import Botao from "@/components/Shared/Botao";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import { CreateSubjectForm } from "@/components/Subject/CreateSubjectForm";
import { EditSubjectForm } from "@/components/Subject/EditSubjectForm";
import { Button } from "@/components/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useDeleteSubject } from "@/hooks/CRUD/subject/useDeleteSubject";
import { useGetSubjects } from "@/hooks/CRUD/subject/useGetSubjects";
import useDebounceValue from "@/hooks/useDebounceValue";
import * as Dialog from "@radix-ui/react-dialog";
import { FileDown, Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function Subjects() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;

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

  const {
    data: subjectPageResponse,
    isLoading,
    isFetching,
  } = useGetSubjects(page, pageSize, urlFilter);
  const { mutateAsync: deleteSubject } = useDeleteSubject();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div>
        <Header />
        <NavigationBar />
      </div>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Assuntos</h1>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Botao perfil="novo" />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70 z-0" />
              <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[520px] z-10 bg-muted border-l border-zinc-900">
                <div className="space-y-3">
                  <Dialog.Title className="text-xl font-bold">
                    Novo Assunto
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-zinc-500">
                    Informe o campo a seguir para criar um novo assunto.
                  </Dialog.Description>
                </div>

                <CreateSubjectForm />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {isFetching && (
            <Loader2 className="size-4 animate-spin text-zinc-500" />
          )}
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
              <TableHead>Name</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Id</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjectPageResponse?.data.map((subject) => {
              return (
                <TableRow key={subject.id}>
                  <TableCell></TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{subject.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {subject.fixedWeight
                          ? `${(subject.fixedWeight * 100).toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{subject.id}</TableCell>

                  <TableCell className="text-right">
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <Button size="icon" className="mx-0.5" variant="muted">
                          <Pencil className="size-3" color="green" />
                        </Button>
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
                        <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[520px] z-10 bg-muted border-l border-zinc-900">
                          <div className="space-y-3">
                            <Dialog.Title className="text-xl font-bold">
                              Editar Assunto
                            </Dialog.Title>
                            <Dialog.Description className="text-sm">
                              Altere o campo a seguir para atualizar o assunto.
                            </Dialog.Description>
                          </div>
                          <EditSubjectForm entity={subject} />
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>

                    <Button
                      size="icon"
                      className="mx-0.5"
                      variant="muted"
                      onClick={() => deleteSubject(subject.id)}
                    >
                      <X className="size-3" color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {subjectPageResponse && (
          <Pagination
            pages={subjectPageResponse.pages}
            items={subjectPageResponse.pageItems}
            page={page}
            totalItems={subjectPageResponse.totalItems}
          />
        )}
      </main>
    </>
  );
}
