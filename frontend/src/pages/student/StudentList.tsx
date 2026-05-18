import { NavigationBar } from "@/components/NavigationBar";
import { Pagination } from "@/components/Pagination";
import Botao from "@/components/Shared/Botao";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import { ModalRenderer } from "@/components/Shared/modal/ModalRenderer";
import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/Checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useGetStudents } from "@/hooks/CRUD/student/useGetStudents";
import useDebounceValue from "@/hooks/useDebounceValue";
import { useExclusaoEmMassa } from "@/hooks/useExclusaoEmMassa";
import { useListagemModal } from "@/hooks/useListagemModal";
import { StudentResponse } from "@/interfaces/Student";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 10;

  const urlFilter = searchParams.get("query") ?? "";
  const [searchTerm, setSearchTerm] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(searchTerm, 1000);

  const { data: studentPage } = useGetStudents(page, pageSize, urlFilter);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const estudantes = studentPage?.data ?? [];
  const isAllSelected =
    estudantes.length > 0 &&
    estudantes.every((s) => selectedStudentIds.includes(s.id));
  const isSomeSelected =
    estudantes.some((s) => selectedStudentIds.includes(s.id)) && !isAllSelected;

  const { modalState, abrirModal, fecharModal, confirmarAcao, isPending } =
    useListagemModal({
      endpoint: "/students",
      invalidateKeys: [["get-students"]],
      entidade: "Estudante",
    });

  const {
    exclusaoEmMassaModalState,
    abrirModalExclusaoEmMassa,
    fecharModalExclusaoEmMassa,
    confirmarExclusaoEmMassa,
    isPendingExclusaoEmMassa,
  } = useExclusaoEmMassa({
    endpoint: "/students",
    invalidateKeys: [["get-students"]],
    entidade: "Estudante",
    onSuccess: () => setSelectedStudentIds([]),
  });

  const modalEmMassaAberto = exclusaoEmMassaModalState.isOpen;

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

  useEffect(() => {
    setSelectedStudentIds([]);
  }, [page]);

  function handleCreateStudent() {
    navigate("/students/create");
  }

  function toggleStudentSelection(studentId: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  }

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedStudentIds((prev) =>
        prev.filter((id) => !estudantes.map((s) => s.id).includes(id)),
      );
    } else {
      setSelectedStudentIds((prev) =>
        Array.from(new Set([...prev, ...estudantes.map((s) => s.id)])),
      );
    }
  }

  function formatClassGroup(student: StudentResponse) {
    const { classGroups } = student;
    return classGroups.map((group) => <span>{group}</span>);
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Alunos</h1>
          <Botao
            variant="novo"
            label="Novo"
            type="button"
            onClick={handleCreateStudent}
          />
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={searchTerm}
              handleSearchChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <Button
            variant="excluirCheio"
            disabled={selectedStudentIds.length === 0}
            onClick={() => abrirModalExclusaoEmMassa(selectedStudentIds)}
          >
            <Trash2 className="size-3" />
            Deletar Selecionados ({selectedStudentIds.length})
          </Button>
        </div>

        {studentPage?.data ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        isAllSelected ||
                        (isSomeSelected ? "indeterminate" : false)
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <span>Nome</span>
                  </TableHead>
                  <TableHead>
                    <span>E-mail</span>
                  </TableHead>
                  <TableHead>
                    <span>CPF</span>
                  </TableHead>
                  <TableHead>
                    <span>Ano de Matricula</span>
                  </TableHead>
                  <TableHead>
                    <span>Turmas</span>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPage?.data.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={() =>
                          toggleStudentSelection(student.id)
                        }
                      />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.cpf}</TableCell>
                    <TableCell>{student.enrollmentYear}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {formatClassGroup(student)}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <Button
                        variant="muted"
                        onClick={() =>
                          navigate(`/students/edit/${student.id}`)
                        }
                      >
                        <Pencil className="size-3 text-green-500" />
                      </Button>
                      <Button
                        variant="muted"
                        onClick={() =>
                          navigate(`/students/view/${student.id}`)
                        }
                      >
                        <Eye className="size-3 text-green-500" />
                      </Button>
                      <Button
                        variant="muted"
                        onClick={() =>
                          abrirModal(
                            {
                              id: student.id,
                              status: "",
                              nomeExibicao: student.name,
                            },
                            "exclusao",
                          )
                        }
                      >
                        <X className="size-3 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {studentPage && (
              <Pagination
                pages={studentPage.pages}
                items={studentPage.pageItems}
                page={page}
                totalItems={studentPage.totalItems}
              />
            )}
          </>
        ) : (
          <div>
            <h1 className="text-center font-medium">Nenhum aluno cadastrado</h1>
          </div>
        )}
      </main>

      <ModalRenderer
        isOpen={modalState.isOpen || modalEmMassaAberto}
        tipo={modalEmMassaAberto ? "exclusaoEmMassa" : modalState.tipo}
        entidade="Estudante"
        item={modalEmMassaAberto ? exclusaoEmMassaModalState.item : modalState.item}
        isLoading={modalEmMassaAberto ? isPendingExclusaoEmMassa : isPending}
        onClose={modalEmMassaAberto ? fecharModalExclusaoEmMassa : fecharModal}
        onConfirm={modalEmMassaAberto ? confirmarExclusaoEmMassa : confirmarAcao}
      />
    </>
  );
};

export default StudentList;
