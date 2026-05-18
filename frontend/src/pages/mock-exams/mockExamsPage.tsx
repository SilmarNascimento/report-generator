import useDebounceValue from "../../hooks/useDebounceValue";
import { Button } from "../../components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/Checkbox";
import { Copy, EyeIcon, Pencil, Trash2, X } from "lucide-react";
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
import { useCopyMockExam } from "@/hooks/CRUD/mockExam/useCopyMockExam";
import { useListagemModal } from "@/hooks/useListagemModal";
import { useExclusaoEmMassa } from "@/hooks/useExclusaoEmMassa";
import { ModalRenderer } from "@/components/Shared/modal/ModalRenderer";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import Botao from "@/components/Shared/Botao";
import { Pagination } from "@/components/Pagination";
import { classGroupLabelMap } from "@/constants/students";

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

  const [selectedMockExamIds, setSelectedMockExamIds] = useState<string[]>([]);

  const simulados = mockExamPageResponse?.data ?? [];
  const isAllSelected =
    simulados.length > 0 &&
    simulados.every((s) => selectedMockExamIds.includes(s.id));
  const isSomeSelected =
    simulados.some((s) => selectedMockExamIds.includes(s.id)) &&
    !isAllSelected;

  const copyMockExam = useCopyMockExam();
  const { modalState, abrirModal, fecharModal, confirmarAcao, isPending } =
    useListagemModal({
      endpoint: "/mock-exam",
      invalidateKeys: [["mock-exams"]],
      entidade: "Simulado",
    });

  const {
    exclusaoEmMassaModalState,
    abrirModalExclusaoEmMassa,
    fecharModalExclusaoEmMassa,
    confirmarExclusaoEmMassa,
    isPendingExclusaoEmMassa,
  } = useExclusaoEmMassa({
    endpoint: "/mock-exam",
    invalidateKeys: [["mock-exams"]],
    entidade: "Simulado",
    onSuccess: () => setSelectedMockExamIds([]),
  });

  const modalEmMassaAberto = exclusaoEmMassaModalState.isOpen;

  useEffect(() => {
    setSelectedMockExamIds([]);
  }, [page]);

  function handleCreateNewMockExam() {
    navigate("/mock-exams/create");
  }

  function handleEditMockExam(mockExamId: string) {
    navigate(`/mock-exams/edit/${mockExamId}`);
  }

  async function handleCopyMockExam(mockExamId: string) {
    await copyMockExam.mutateAsync(mockExamId);
  }

  function getMockExamCode({ releasedYear, number, className }: MockExam) {
    return `${releasedYear}:S${number}-${className[0]}`;
  }

  function toggleMockExamSelection(mockExamId: string) {
    setSelectedMockExamIds((prev) =>
      prev.includes(mockExamId)
        ? prev.filter((id) => id !== mockExamId)
        : [...prev, mockExamId],
    );
  }

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedMockExamIds((prev) =>
        prev.filter((id) => !simulados.map((s) => s.id).includes(id)),
      );
    } else {
      setSelectedMockExamIds((prev) =>
        Array.from(new Set([...prev, ...simulados.map((s) => s.id)])),
      );
    }
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
          <Botao
            variant="novo"
            label="Novo"
            type="button"
            onClick={handleCreateNewMockExam}
          />
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
          </form>

          <Button
            variant="excluirCheio"
            disabled={selectedMockExamIds.length === 0}
            onClick={() => abrirModalExclusaoEmMassa(selectedMockExamIds)}
          >
            <Trash2 className="size-3" />
            Deletar Selecionados ({selectedMockExamIds.length})
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    isAllSelected || (isSomeSelected ? "indeterminate" : false)
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
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
                  <TableCell>
                    <Checkbox
                      checked={selectedMockExamIds.includes(mockExam.id)}
                      onCheckedChange={() =>
                        toggleMockExamSelection(mockExam.id)
                      }
                    />
                  </TableCell>
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
                    {mockExam.className.map((name) => (
                      <span key={name}>{classGroupLabelMap[name]}</span>
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
                      onClick={() => handleCopyMockExam(mockExam.id)}
                    >
                      <Copy className="size-3" color="blue" />
                    </Button>
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
                      onClick={() =>
                        abrirModal(
                          {
                            id: mockExam.id,
                            status: "",
                            nomeExibicao: mockExam.name,
                          },
                          "exclusao",
                        )
                      }
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

      <ModalRenderer
        isOpen={modalState.isOpen || modalEmMassaAberto}
        tipo={modalEmMassaAberto ? "exclusaoEmMassa" : modalState.tipo}
        entidade="Simulado"
        item={modalEmMassaAberto ? exclusaoEmMassaModalState.item : modalState.item}
        isLoading={modalEmMassaAberto ? isPendingExclusaoEmMassa : isPending}
        onClose={modalEmMassaAberto ? fecharModalExclusaoEmMassa : fecharModal}
        onConfirm={modalEmMassaAberto ? confirmarExclusaoEmMassa : confirmarAcao}
      />
    </>
  );
}
