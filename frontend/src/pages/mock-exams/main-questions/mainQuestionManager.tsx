import { NavigationBar } from "@/components/NavigationBar";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useDebounceValue from "@/hooks/useDebounceValue";
import { MainQuestion } from "@/interfaces";
import { useFilteredMainQuestions } from "@/hooks/CRUD/mockExam/mainQuestionManager/useFilteredMainQuestions";
import { useGetMockExamMainQuestionManager } from "@/hooks/CRUD/mockExam/mainQuestionManager/useGetMockExamMainQuestionManager";
import { useUpdateMockExamMainQuestions } from "@/hooks/CRUD/mockExam/mainQuestionManager/useUpdateMockExamMainQuestions";
import { AddMainQuestionManagerTable } from "@/components/MainQuestion/AddMainQuestionManagerTable";
import { SortableMainQuestionsTable } from "@/components/MainQuestion/SortableMainQuestionsTable";
import Botao from "@/components/Shared/Botao";

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
  const [manualAvailable, setManualAvailable] = useState<MainQuestion[]>([]);

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

  const { data: availableQuestionsPage } = useFilteredMainQuestions(
    page,
    pageSize,
    urlFilter,
    mockExamId,
  );

  const filteredAvailableQuestions = useMemo(() => {
    if (!availableQuestionsPage) return undefined;

    const examIds = new Set(examQuestions.map((q) => q.id));

    const backendFiltered = availableQuestionsPage.data.filter(
      (q) => !examIds.has(q.id),
    );

    const backendIds = new Set(backendFiltered.map((q) => q.id));
    const additions = manualAvailable.filter(
      (q) => !examIds.has(q.id) && !backendIds.has(q.id),
    );

    return {
      ...availableQuestionsPage,
      data: [...additions, ...backendFiltered],
    };
  }, [availableQuestionsPage, examQuestions, manualAvailable]);

  const updateMockExamQuestions = useUpdateMockExamMainQuestions(mockExamId);

  function handleAddQuestions(questions: MainQuestion[]) {
    const addedIds = new Set(questions.map((q) => q.id));

    setManualAvailable((prev) => prev.filter((q) => !addedIds.has(q.id)));

    setExamQuestions((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));

      return [...prev, ...questions.filter((q) => !existingIds.has(q.id))];
    });
  }

  function handleRemoveQuestion(questionId: string) {
    const removed = examQuestions.find((q) => q.id === questionId);

    if (removed) {
      setExamQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setManualAvailable((prev) => [removed, ...prev]);
    }
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
      <div>
        <NavigationBar />
      </div>

      {filteredAvailableQuestions && (
        <AddMainQuestionManagerTable
          entity={filteredAvailableQuestions}
          filter={filter}
          setFilter={setFilter}
          page={page}
          maxReached={examQuestions.length >= MAX_QUESTIONS}
          onAddQuestions={handleAddQuestions}
        />
      )}

      <SortableMainQuestionsTable
        questions={examQuestions}
        onRemove={handleRemoveQuestion}
        onReorder={handleReorder}
      />

      <div className="max-w-6xl mx-auto flex items-center justify-between mt-8 pb-10">
        <Botao
          variant="cancelar"
          label="Voltar"
          onClick={() => navigate("/mock-exams")}
        >
          Voltar para simulados
        </Botao>
        <Botao
          variant="confirmar"
          isLoading={updateMockExamQuestions.isPending}
          onClick={handleSave}
        >
          Salvar ({examQuestions.length}/{MAX_QUESTIONS})
        </Botao>
      </div>
    </>
  );
}
