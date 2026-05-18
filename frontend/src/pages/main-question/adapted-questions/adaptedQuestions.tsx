import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useListagemModal } from "@/hooks/useListagemModal";
import { ModalRenderer } from "@/components/Shared/modal/ModalRenderer";
import useDebounceValue from "@/hooks/useDebounceValue";
import { AdaptedQuestion } from "@/interfaces";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/shadcn/button";
import { FileDown, Pencil, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import Botao from "@/components/Shared/Botao";

export function AdaptedQuestions() {
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  useEffect(() => {
    setSearchParams((params) => {
      if (params.get("query") !== debouncedQueryFilter) {
        params.set("query", debouncedQueryFilter);
        return new URLSearchParams(params);
      }
      return params;
    });
  }, [debouncedQueryFilter, setSearchParams]);

  const { data: adaptedQuestionsPageResponse, isLoading } = useQuery<
    AdaptedQuestion[]
  >({
    queryKey: ["get-adapted-questions", urlFilter],
    queryFn: async () => {
      const response = await fetch(
        `/main-question/${mainQuestionId}/adapted-question`,
      );
      const data = await response.json();

      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const { modalState, abrirModal, fecharModal, confirmarAcao, isPending } =
    useListagemModal({
      endpoint: `/main-question/${mainQuestionId}/adapted-question`,
      invalidateKeys: [["get-adapted-questions"], ["get-main-questions"]],
      entidade: "Questão Adaptada",
    });

  function handleCorrectAnswer(question: AdaptedQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleCreateAdaptedQuestion() {
    navigate(`/main-questions/${mainQuestionId}/adapted-questions/create`);
  }

  function handleEditAdaptedQuestion(adaptedQuestionId: string) {
    navigate(
      `/main-questions/${mainQuestionId}/adapted-questions/edit/${adaptedQuestionId}`,
    );
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
          <h1 className="text-xl font-bold">Questões Adaptadas 2022:S6:136</h1>
          <Botao
            variant="novo"
            label="Novo"
            type="button"
            onClick={handleCreateAdaptedQuestion}
          />
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={filter}
              handleSearchChange={(event) => setFilter(event.target.value)}
            />
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
                <span>Enunciado</span>
              </TableHead>
              <TableHead>
                <span>Nível</span>
              </TableHead>
              <TableHead>
                <span>Gabarito</span>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adaptedQuestionsPageResponse?.map((question) => {
              return (
                <TableRow key={question.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{question.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>{question.level}</span>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <span>{handleCorrectAnswer(question)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      className="mx-0.5"
                      onClick={() =>
                        abrirModal(
                          {
                            id: question.id,
                            status: "",
                            nomeExibicao: question.title,
                          },
                          "exclusao",
                        )
                      }
                    >
                      <X className="size-3" color="red" />
                    </Button>
                    <Button
                      size="icon"
                      className="mx-0.5"
                      onClick={() => handleEditAdaptedQuestion(question.id)}
                    >
                      <Pencil className="size-3" color="green" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </main>

      <ModalRenderer
        isOpen={modalState.isOpen}
        tipo={modalState.tipo}
        entidade="Questão Adaptada"
        item={modalState.item}
        isLoading={isPending}
        onClose={fecharModal}
        onConfirm={confirmarAcao}
      />
    </>
  );
}
