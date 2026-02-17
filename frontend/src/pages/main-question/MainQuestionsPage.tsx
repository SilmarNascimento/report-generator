import { Header } from "@/components/header";
import { NavigationBar } from "@/components/NavigationBar";
import { Pagination } from "@/components/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { Button } from "@/components/ui/shadcn/button";
import { FileDown, Pencil, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MainQuestion } from "@/interfaces";
import { Link } from "react-router-dom";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import FiltroListagem from "@/components/shared/FiltroListagem";
import Botao from "@/components/shared/Botao";
import { useGetMainQuestionList } from "@/hooks/CRUD/mainQuestion/useGetMainQuestionList";
import { useDeleteMainQuestionById } from "@/hooks/CRUD/mainQuestion/useDeleteMainQuestionById";

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

  const deleteMainQuestion = useDeleteMainQuestionById();

  function handleCreateNewMainQuestion() {
    navigate("/main-questions/create");
  }

  function handleEditMainQuestion(mainQuestionId: string) {
    navigate(`/main-questions/edit/${mainQuestionId}`);
  }

  async function handleDeleteMainQuestion(question: MainQuestion) {
    await deleteMainQuestion.mutateAsync(question.id);
  }

  function handleCorrectAnswer(question: MainQuestion) {
    const correctIndex = question.alternatives.findIndex(
      (alternative) => alternative.questionAnswer,
    );
    return getAlternativeLetter(correctIndex);
  }

  if (isLoading) {
    return null;
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

  return (
    <>
      <header>
        <Header />
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Questões Principais</h1>
          <Botao perfil="novo" onClick={handleCreateNewMainQuestion} />
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
                  <TableCell></TableCell>
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
                      onClick={() => handleDeleteMainQuestion(question)}
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
    </>
  );
}
