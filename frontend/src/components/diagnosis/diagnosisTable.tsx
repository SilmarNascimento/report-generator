import { Eye } from "lucide-react";
import { MockExamResponse } from "../../interfaces/MockExamResponse";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Link } from "react-router-dom";

interface DiagnosisTableProps {
  entity: MockExamResponse[];
}

export function DiagnosisTable({ entity }: DiagnosisTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
              <span>Nome</span>
            </TableHead>
            <TableHead>
              <span>Email</span>
            </TableHead>
            <TableHead>
              <span>Data de entrega</span>
            </TableHead>
            <TableHead>
              <span>Pontuação</span>
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
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">
                      {studentResponse.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300">
                  <span>
                    {studentResponse.email}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-300">
                  {studentResponse.createdAt}
                </TableCell>
                <TableCell className="text-zinc-300">
                  {`${studentResponse.correctAnswers}/45`}
                </TableCell>
                <TableCell className="text-zinc-300">
                  <Link to={`/mock-exam/response/${studentResponse.id}`}>
                    <Eye className="size-3"/>
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}