import { NavigationBar } from "@/components/NavigationBar";
import { Pagination } from "@/components/Pagination";
import Botao from "@/components/Shared/Botao";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import {
  ModalRenderer,
  ModalRendererProps,
} from "@/components/Shared/modal/ModalRenderer";
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
import { Loader } from "@/components/ui/loader/Loader";
import { Eye, FileSpreadsheet, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginaContainer from "@/components/Shared/PaginaContainer";
import CabecalhoListagem from "@/components/Shared/CabecalhoListagem";
import { useImportStudents } from "@/hooks/CRUD/student/useImportStudents";

const StudentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 10;

  const urlFilter = searchParams.get("query") ?? "";
  const [searchTerm, setSearchTerm] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(searchTerm, 1000);

  const { data: studentPage, isLoading } = useGetStudents(
    page,
    pageSize,
    urlFilter,
  );

  const alunos = studentPage?.data ?? [];
  const isAllSelected =
    alunos.length > 0 && alunos.every((s) => selectedStudentIds.includes(s.id));
  const isSomeSelected =
    alunos.some((s) => selectedStudentIds.includes(s.id)) && !isAllSelected;

  const { modalState, abrirModal, fecharModal, confirmarAcao, isPending } =
    useListagemModal({
      endpoint: "/students",
      invalidateKeys: [["get-students"]],
      entidade: "Aluno",
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
    entidade: "Aluno",
    onSuccess: () => setSelectedStudentIds([]),
  });

  const {
    cadastroEmMassaModalState,
    abrirModalCadastroEmMassa,
    fecharModalCadastroEmMassa,
    confirmarCadastroEmMassa,
    isPendingCadastroEmMassa,
  } = useImportStudents();

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

  function obterModalAtivo(): ModalRendererProps {
    if (cadastroEmMassaModalState.isOpen) {
      return {
        ...cadastroEmMassaModalState,
        entidade: "Alunos",
        isLoading: isPendingCadastroEmMassa,
        onClose: fecharModalCadastroEmMassa,
        onConfirm: confirmarCadastroEmMassa,
      };
    }

    if (exclusaoEmMassaModalState.isOpen) {
      return {
        ...exclusaoEmMassaModalState,
        entidade: "Alunos",
        isLoading: isPendingExclusaoEmMassa,
        onClose: fecharModalExclusaoEmMassa,
        onConfirm: confirmarExclusaoEmMassa,
      };
    }

    return {
      ...modalState,
      entidade: "Aluno",
      isLoading: isPending,
      onClose: fecharModal,
      onConfirm: confirmarAcao,
    };
  }

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
        prev.filter((id) => !alunos.map((s) => s.id).includes(id)),
      );
    } else {
      setSelectedStudentIds((prev) =>
        Array.from(new Set([...prev, ...alunos.map((s) => s.id)])),
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

      <PaginaContainer>
        <CabecalhoListagem titulo="Alunos">
          <Botao
            variant="secondary"
            type="button"
            icon={<FileSpreadsheet className="size-4" />}
            onClick={abrirModalCadastroEmMassa}
          >
            Cadastro de alunos
          </Botao>
          <Botao
            variant="novo"
            label="Novo"
            type="button"
            onClick={handleCreateStudent}
          />
        </CabecalhoListagem>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={searchTerm}
              handleSearchChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          {!!selectedStudentIds.length && (
            <Botao
              variant="excluirCheio"
              disabled={selectedStudentIds.length === 0}
              onClick={() => abrirModalExclusaoEmMassa(selectedStudentIds)}
            >
              Deletar Selecionados ({selectedStudentIds.length})
            </Botao>
          )}
        </div>

        {isLoading ? (
          <Loader />
        ) : !studentPage?.data?.length ? (
          <p className="text-center text-muted-foreground py-16">
            Nenhum registro encontrado
          </p>
        ) : (
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
                {studentPage.data.map((student) => (
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
                      <Botao
                        variant="muted"
                        onClick={() => navigate(`/students/edit/${student.id}`)}
                      >
                        <Pencil className="size-3 text-green-500" />
                      </Botao>
                      <Botao
                        variant="muted"
                        onClick={() => navigate(`/students/view/${student.id}`)}
                      >
                        <Eye className="size-3 text-green-500" />
                      </Botao>
                      <Botao
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
                      </Botao>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              pages={studentPage.pages}
              items={studentPage.pageItems}
              page={page}
              totalItems={studentPage.totalItems}
            />
          </>
        )}
      </PaginaContainer>

      <ModalRenderer {...obterModalAtivo()} />
    </>
  );
};

export default StudentList;
