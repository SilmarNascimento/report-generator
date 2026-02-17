import { Eye, X } from "lucide-react";
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router-dom";
import { StudentDiagnosisStatus } from "./StudentDiagnosisStatus";
import { Button } from "../ui/shadcn/button";

interface DiagnosisTableProps {
  entity: MockExamDiagnosisResponse[];
  deleteFunction: (studentResponseId: string) => Promise<void>;
}

export function DiagnosisTable({
  entity,
  deleteFunction,
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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
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
                <TableCell></TableCell>
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
                    <Link to={`/mock-exam/response/${studentResponse.id}`}>
                      <Eye className="size-4" />
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    className="mx-0.5"
                    onClick={() => deleteFunction(studentResponse.id)}
                  >
                    <X className="size-3" color="red" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
