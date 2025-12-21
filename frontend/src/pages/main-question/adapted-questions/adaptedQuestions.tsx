import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useDebounceValue from "../../../hooks/useDebounceValue";
import { AdaptedQuestion } from "../../../types";
import { successAlert } from "../../../utils/toastAlerts";
import { NavigationBar } from "../../../components/NavigationBar";
import { Button } from "../../../components/ui/button";
import { FileDown, Pencil, Plus, Search, X } from "lucide-react";
import { Control, Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import { Route } from "@/router/main-questions/$mainQuestionId/adapted-questions";

export function AdaptedQuestions() {
  const queryClient = useQueryClient();
  const { mainQuestionId } = Route.useParams();
  const { query } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [filter, setFilter] = useState(query ?? "");
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        query: debouncedQueryFilter,
      }),
      replace: true,
    });
  }, [debouncedQueryFilter, navigate]);

  const { data: adaptedQuestionsPageResponse, isLoading } = useQuery<
    AdaptedQuestion[]
  >({
    queryKey: ["get-adapted-questions", query],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/main-question/${mainQuestionId}/adapted-question`
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
        }
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
      (alternative) => alternative.questionAnswer
    );
    return getAlternativeLetter(correctIndex);
  }

  function handleCreateAdaptedQuestion() {
    navigate({
      to: "/main-questions/$mainQuestionId/adapted-questions/create",
      params: { mainQuestionId },
    });
  }

  function handleEditAdaptedQuestion(adaptedQuestionId: string) {
    navigate({
      to: "/main-questions/$mainQuestionId/adapted-questions/edit/$adaptedQuestionId",
      params: { mainQuestionId, adaptedQuestionId },
    });
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
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
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
