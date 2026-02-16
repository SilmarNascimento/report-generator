import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useDebounceValue from "../../../hooks/useDebounceValue";
import { AdaptedQuestion } from "../../../interfaces";
import { successAlert } from "../../../utils/toastAlerts";
import { Header } from "../../../components/header";
import { NavigationBar } from "../../../components/NavigationBar";
import { Button } from "../../../components/ui/shadcn/button";
import { FileDown, Pencil, Plus, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getAlternativeLetter } from "../../../utils/correctAnswerMapping";
import FiltroListagem from "@/components/shared/FiltroListagem";

export function AdaptedQuestions() {
  const queryClient = useQueryClient();
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
        `http://localhost:8080/main-question/${mainQuestionId}/adapted-question`,
      );
      const data = await response.json();

      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const deleteAdaptedQuestion = useMutation({
    mutationFn: async (adaptedQuestionId: string) => {
      await fetch(
        `http://localhost:8080/main-question/${mainQuestionId}/adapted-question/${adaptedQuestionId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-adapted-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-main-questions"],
      });
      successAlert("Questão adaptada excluída com sucesso!");
    },
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

  async function handleDeleteAdaptedQuestion(adaptedQuestionId: string) {
    await deleteAdaptedQuestion.mutateAsync(adaptedQuestionId);
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
          <Button variant="primary" onClick={handleCreateAdaptedQuestion}>
            <Plus className="size-3" />
            Create new
          </Button>
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
                      onClick={() => handleDeleteAdaptedQuestion(question.id)}
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
    </>
  );
}
