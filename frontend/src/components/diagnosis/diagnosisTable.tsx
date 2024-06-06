import { Eye } from "lucide-react";
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Link } from "react-router-dom";

interface DiagnosisTableProps {
  entity: MockExamDiagnosisResponse[];
}

export function DiagnosisTable({ entity }: DiagnosisTableProps) {
  function handleDateTime(createdAt: string) {
    const dateAndTime = createdAt.split("T");
    const date = dateAndTime[0].split("-").reverse().join("/");
    const time = dateAndTime[1].split(":").slice(0,2).join(":");
    return (
      <div className="flex flex-col gap-1">
        <span className="font-normal text-zinc-300">
          {time}
        </span>
        <span className="font-light text-zinc-300/70">
          {date}
        </span>
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
                <TableCell className="text-zinc-300">
                  {studentResponse.examCode}
                </TableCell>
                <TableCell className="text-zinc-300">
                  {studentResponse.className}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-zinc-300 text-left">
                      {studentResponse.name}
                    </span>
                    <span className="font-light italic text-zinc-300/70 text-left">
                      {studentResponse.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300">
                  {`${studentResponse.correctAnswers}/45`}
                </TableCell>
                <TableCell className="text-zinc-300">
                  {handleDateTime(studentResponse.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Link to={`/mock-exam/response/${studentResponse.id}`}>
                      <Eye className="size-4"/>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}