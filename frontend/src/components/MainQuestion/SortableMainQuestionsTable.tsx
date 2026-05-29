import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MainQuestion } from "@/interfaces";
import { Table, TableBody, TableHead, TableHeader } from "../ui/Table";
import { SortableRow } from "./SortableRow";

type SortableMainQuestionsTableProps = {
  questions: MainQuestion[];
  onRemove: (questionId: string) => void;
  onReorder: (reordered: MainQuestion[]) => void;
};

export function SortableMainQuestionsTable({
  questions,
  onRemove,
  onReorder,
}: SortableMainQuestionsTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      onReorder(arrayMove(questions, oldIndex, newIndex));
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 mt-8 overflow-x-hidden">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">
          Questões do simulado ({questions.length}/45)
        </h1>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <tr className="bg-muted/50">
                <TableHead>Nº</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Gabarito</TableHead>
                <TableHead>Área da Matemática</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Lerikucas</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Questões adaptadas</TableHead>
                <TableHead></TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {questions.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-16 text-center text-muted-foreground text-sm"
                  >
                    Nenhuma questão adicionada ao simulado
                  </td>
                </tr>
              ) : (
                questions.map((question, index) => (
                  <SortableRow
                    key={question.id}
                    question={question}
                    index={index}
                    onRemove={onRemove}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
