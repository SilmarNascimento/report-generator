import { MainQuestion } from "@/interfaces";
import { getAlternativeLetter } from "@/utils/correctAnswerMapping";
import { useSortable } from "@dnd-kit/sortable";
import { TableCell } from "../../ui/Table";
import Botao from "../../Shared/Botao";
import { GripVertical, X } from "lucide-react";

type SortableRowProps = {
  question: MainQuestion;
  index: number;
  disabled: boolean;
  onRemove: (id: string) => void;
};

const INITIAL_QUESTION_NUMBER = 136;

export function SortableRow({
  question,
  index,
  disabled,
  onRemove,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: transform
      ? `translate3d(0px, ${Math.round(transform.y)}px, 0px)`
      : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
    position: isDragging ? ("relative" as const) : undefined,
  };

  function getCorrectAnswer() {
    const idx = question.alternatives.findIndex((a) => a.questionAnswer);
    return getAlternativeLetter(idx);
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-border text-center text-sm hover:bg-muted/50 transition-colors"
    >
      <TableCell></TableCell>
      <TableCell className="text-center font-medium">
        {INITIAL_QUESTION_NUMBER + index}
      </TableCell>
      <TableCell>{getCorrectAnswer()}</TableCell>
      <TableCell>{question.level}</TableCell>
      <TableCell>{question.lerickucas}</TableCell>
      <TableCell>
        {question.mainSubject?.name ?? "—"}
      </TableCell>
      <TableCell>{question.pattern}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Botao
            size="icon"
            variant="muted"
            disabled={disabled}
            onClick={() => onRemove(question.id)}
          >
            <X className="size-3 text-red-500" />
          </Botao>
          <button
            className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            title="Arrastar para reordenar"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </button>
        </div>
      </TableCell>
    </tr>
  );
}
