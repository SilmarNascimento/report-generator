import { Eye, X } from "lucide-react";
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { Link } from "react-router-dom";
import { StudentDiagnosisStatus } from "./StudentDiagnosisStatus";
import Botao from "../Shared/Botao";

interface DiagnosisTableProps {
  entity: MockExamDiagnosisResponse[];
  deleteFunction: (studentResponseId: string) => Promise<void>;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
}

export function DiagnosisTable({
  entity,
  deleteFunction,
  selectedIds,
  onToggleSelect,
  onToggleAll,
}: DiagnosisTableProps) {
  function handleDateTime(createdAt: string) {
    const dateAndTime = createdAt.split("T");
    const date = dateAndTime[0].split("-").reverse().join("/");
    const time = dateAndTime[1].split(":").slice(0, 2).join(":");
    return (
      <div className="flex flex-col gap-1">
        <span className="font-normal">{time}</span>
        <span className="font-light">{date}</span>
      </div>
    );
  }

  const pageIds = entity.map((r) => r.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={allPageSelected}
                onChange={() => onToggleAll(pageIds)}
                className="cursor-pointer accent-primary"
              />
            </TableHead>
            <TableHead>
              <span>Simulado</span>
            </TableHead>
            <TableHead>
              <span>Turma</span>
            </TableHead>
            <TableHead>
              <span>Aluno</span>
            </TableHead>
            <TableHead>
              <span>Pontuação</span>
            </TableHead>
            <TableHead>
              <span>Data de entrega</span>
            </TableHead>
            <TableHead>
              <span>Diagnóstico</span>
            </TableHead>
            <TableHead>
              <span>Lista de Respostas</span>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entity.map((studentResponse) => {
            return (
              <TableRow key={studentResponse.id}>
                <TableCell className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(studentResponse.id)}
                    onChange={() => onToggleSelect(studentResponse.id)}
                    className="cursor-pointer accent-primary"
                  />
                </TableCell>
                <TableCell>{studentResponse.examCode}</TableCell>
                <TableCell>{studentResponse.className}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-left">
                      {studentResponse.name}
                    </span>
                    <span className="font-light italic text-left">
                      {studentResponse.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{`${studentResponse.correctAnswers}/45`}</TableCell>
                <TableCell>
                  {handleDateTime(studentResponse.createdAt)}
                </TableCell>
                <TableCell>
                  <StudentDiagnosisStatus studentResponse={studentResponse} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Link to={`/mock-exams/response/${studentResponse.id}`}>
                      <Eye className="size-4" />
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Botao
                    size="icon"
                    className="mx-0.5"
                    variant="muted"
                    onClick={() => deleteFunction(studentResponse.id)}
                  >
                    <X className="size-3" color="red" />
                  </Botao>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
