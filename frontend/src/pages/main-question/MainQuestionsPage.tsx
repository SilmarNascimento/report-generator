import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/shadcn/Checkbox";
import { MainQuestion } from "@/interfaces";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import { useGetMainQuestionList } from "@/hooks/CRUD/mainQuestion/useGetMainQuestionList";
import { useEffect, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { NavigationBar } from "@/components/NavigationBar";
import { useListagemModal } from "@/hooks/useListagemModal";
import { useExclusaoEmMassa } from "@/hooks/useExclusaoEmMassa";
import { ModalRenderer } from "@/components/Shared/modal/ModalRenderer";
import { Header } from "@/components/Header";
import Botao from "@/components/Shared/Botao";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import { Button } from "@/components/ui/shadcn/button";
import { Pencil, Trash2, X } from "lucide-react";
import { Pagination } from "@/components/Pagination";

export function MainQuestions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

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

  const { data: mainQuestionPageResponse, isLoading } = useGetMainQuestionList(
    urlFilter,
    page,
    pageSize,
  );

  const [selectedMainQuestionIds, setSelectedMainQuestionIds] = useState<
    string[]
  >([]);

  const questoes = mainQuestionPageResponse?.data ?? [];
  const isAllSelected =
    questoes.length > 0 &&
    questoes.every((q) => selectedMainQuestionIds.includes(q.id));
  const isSomeSelected =
    questoes.some((q) => selectedMainQuestionIds.includes(q.id)) &&
    !isAllSelected;

  const { modalState, abrirModal, fecharModal, confirmarAcao, isPending } =
    useListagemModal({
      endpoint: "/main-question",
      invalidateKeys: [["get-main-questions"]],
      entidade: "Questão Principal",
    });

  const {
    exclusaoEmMassaModalState,
    abrirModalExclusaoEmMassa,
    fecharModalExclusaoEmMassa,
    confirmarExclusaoEmMassa,
    isPendingExclusaoEmMassa,
  } = useExclusaoEmMassa({
    endpoint: "/main-question",
    invalidateKeys: [["get-main-questions"]],
    entidade: "Questão Principal",
    onSuccess: () => setSelectedMainQuestionIds([]),
  });

  const modalEmMassaAberto = exclusaoEmMassaModalState.isOpen;

  useEffect(() => {
    setSelectedMainQuestionIds([]);
  }, [page]);

  function handleCreateNewMainQuestion() {
    navigate("/main-questions/create");
  }

  function handleEditMainQuestion(mainQuestionId: string) {
    navigate(`/main-questions/edit/${mainQuestionId}`);
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  function getMainQuestionCode(question: MainQuestion) {
    const hasHandout = question.handouts.length !== 0;
    const hasMockExams = question.mockExams.length !== 0;
    if (!hasHandout && !hasMockExams) {
      return "Reserva";
    } else if (hasHandout && !hasMockExams) {
      return `${question.handouts[0].releasedYear}:A${question.handouts[0].volume}:${question.questionNumber}`;
    } else if (!hasHandout && hasMockExams) {
      return `${question.mockExams[0].releasedYear}:S${question.mockExams[0].number}:${question.questionNumber}`;
    }
    return "";
  }

  function toggleMainQuestionSelection(questionId: string) {
    setSelectedMainQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  }

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedMainQuestionIds((prev) =>
        prev.filter((id) => !questoes.map((q) => q.id).includes(id)),
      );
    } else {
      setSelectedMainQuestionIds((prev) =>
        Array.from(new Set([...prev, ...questoes.map((q) => q.id)])),
      );
    }
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
          <h1 className="text-xl font-bold">Questões Principais</h1>
          <Botao
            variant="confirmar"
            label="Novo"
            type="button"
            onClick={handleCreateNewMainQuestion}
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
            disabled={selectedMainQuestionIds.length === 0}
            onClick={() => abrirModalExclusaoEmMassa(selectedMainQuestionIds)}
          >
            <Trash2 className="size-3" />
            Deletar Selecionados ({selectedMainQuestionIds.length})
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
                <span>Nível</span>
              </TableHead>
              <TableHead>
                <span>Assuntos</span>
              </TableHead>
              <TableHead>
                <span>Gabarito</span>
              </TableHead>
              <TableHead>
                <span>Questões adaptadas</span>
              </TableHead>
              <TableHead>
                <span>Simulados</span>
              </TableHead>
              <TableHead>
                <span>Apostilas</span>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mainQuestionPageResponse?.data.map((question) => {
              return (
                <TableRow key={question.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMainQuestionIds.includes(question.id)}
                      onCheckedChange={() =>
                        toggleMainQuestionSelection(question.id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {getMainQuestionCode(question)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{question.level}</span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/main-questions/${question.id}/subjects`}>
                      <span>
                        {question.subjects.length
                          ? question.subjects[0].name
                          : "Sem assunto principal"}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span>{handleCorrectAnswer(question)}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/main-questions/${question.id}/adapted-questions`}
                    >
                      <span>{question.adaptedQuestions.length}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/main-question/${question.id}/mock-exams`}>
                      <span>{question.mockExams.length}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/main-question/${question.id}/handouts`}>
                      <span>{question.handouts.length}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right flex gap-1">
                    <Button
                      size="icon"
                      className="mx-0.5"
                      variant="muted"
                      onClick={() => handleEditMainQuestion(question.id)}
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
                            id: question.id,
                            status: "",
                            nomeExibicao: getMainQuestionCode(question),
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
        {mainQuestionPageResponse && (
          <Pagination
            pages={mainQuestionPageResponse.pages}
            items={mainQuestionPageResponse.pageItems}
            page={page}
            totalItems={mainQuestionPageResponse.totalItems}
          />
        )}
      </main>

      <ModalRenderer
        isOpen={modalState.isOpen || modalEmMassaAberto}
        tipo={modalEmMassaAberto ? "exclusaoEmMassa" : modalState.tipo}
        entidade="Questão Principal"
        item={modalEmMassaAberto ? exclusaoEmMassaModalState.item : modalState.item}
        isLoading={modalEmMassaAberto ? isPendingExclusaoEmMassa : isPending}
        onClose={modalEmMassaAberto ? fecharModalExclusaoEmMassa : fecharModal}
        onConfirm={modalEmMassaAberto ? confirmarExclusaoEmMassa : confirmarAcao}
      />
    </>
  );
}
