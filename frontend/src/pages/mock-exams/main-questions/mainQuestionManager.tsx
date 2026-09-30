import { NavigationBar } from "@/components/NavigationBar";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { MainQuestion } from "@/interfaces";
import { useFilteredMainQuestions } from "@/hooks/CRUD/mockExam/mainQuestionManager/useFilteredMainQuestions";
import { useGetMockExamMainQuestionManager } from "@/hooks/CRUD/mockExam/mainQuestionManager/useGetMockExamMainQuestionManager";
import { useUpdateMockExamMainQuestions } from "@/hooks/CRUD/mockExam/mainQuestionManager/useUpdateMockExamMainQuestions";
import Botao from "@/components/Shared/Botao";
import { AddMainQuestionManagerTable } from "@/components/Forms/MockExam/AddMainQuestionManagerTable";
import { SortableMainQuestionsTable } from "@/components/Forms/MockExam/SortableMainQuestionsTable";
import PaginaContainer from "@/components/Shared/PaginaContainer";

const MAX_QUESTIONS = 45;

export function MockExamMainQuestionManager() {
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const urlFilter = searchParams.get("query") ?? "";
  const [filter, setFilter] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(filter, 1000);

  const [examQuestions, setExamQuestions] = useState<MainQuestion[]>([]);

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

  const { data: mockExamData } = useGetMockExamMainQuestionManager(mockExamId);

  useEffect(() => {
    if (mockExamData) {
      const sorted = Object.entries(mockExamData.mockExamQuestions)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, q]) => q);
      setExamQuestions(sorted);
    }
  }, [mockExamData]);

  const examIds = useMemo(
    () => examQuestions.map((q) => q.id),
    [examQuestions],
  );

  const { data: availableQuestionsPage, isFetching } = useFilteredMainQuestions(
    page,
    pageSize,
    urlFilter,
    examIds,
    !!mockExamData,
  );

  const updateMockExamQuestions = useUpdateMockExamMainQuestions(mockExamId);

  function handleAddQuestions(questions: MainQuestion[]) {
    setExamQuestions((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      return [...prev, ...questions.filter((q) => !existingIds.has(q.id))];
    });
  }

  function handleRemoveQuestion(questionId: string) {
    setExamQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }

  function handleReorder(reordered: MainQuestion[]) {
    setExamQuestions(reordered);
  }

  async function handleSave() {
    await updateMockExamQuestions.mutateAsync(examQuestions.map((q) => q.id));

    navigate("/mock-exams");
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <PaginaContainer>
        {availableQuestionsPage && (
          <AddMainQuestionManagerTable
            entity={availableQuestionsPage}
            filter={filter}
            setFilter={setFilter}
            page={page}
            maxReached={examQuestions.length >= MAX_QUESTIONS}
            isFetching={isFetching}
            onAddQuestions={handleAddQuestions}
          />
        )}

        <SortableMainQuestionsTable
          questions={examQuestions}
          isFetching={isFetching}
          onRemove={handleRemoveQuestion}
          onReorder={handleReorder}
        />

        <div className="mt-8 flex items-center justify-end gap-4">
          <Botao
            variant="cancelar"
            label="Voltar"
            onClick={() => navigate("/mock-exams")}
          >
            Voltar
          </Botao>
          <Botao
            variant="confirmar"
            isLoading={updateMockExamQuestions.isPending}
            onClick={handleSave}
          >
            Salvar ({examQuestions.length}/{MAX_QUESTIONS})
          </Botao>
        </div>
      </PaginaContainer>
    </>
  );
}
