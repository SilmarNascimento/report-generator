import { NavigationBar } from "@/components/NavigationBar";
import { Pagination } from "@/components/Pagination";
import Botao from "@/components/Shared/Botao";
import FiltroListagem from "@/components/Shared/FiltroListagem";
import { Button } from "@/components/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useGetStudents } from "@/hooks/CRUD/student/useGetStudents";
import { useHandleDeleteStudent } from "@/hooks/CRUD/student/useHandleDeleteStudent";
import useDebounceValue from "@/hooks/useDebounceValue";
import { StudentResponse } from "@/interfaces/Student";
import { Eye, FileDown, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 10;

  const urlFilter = searchParams.get("query") ?? "";
  const [searchTerm, setSearchTerm] = useState(urlFilter);
  const debouncedQueryFilter = useDebounceValue(searchTerm, 1000);

  const { data: studentPage } = useGetStudents(page, pageSize, urlFilter);
  const { mutateAsync: deleteStudent } = useHandleDeleteStudent();

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

  function handleCreateStudent() {
    navigate("/students/create");
  }

  function formatClassGroup(student: StudentResponse) {
    const { classGroups } = student;

    return classGroups.map((group) => <span>{group}</span>);
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Alunos</h1>
          <Botao perfil="novo" onClick={handleCreateStudent} />
        </div>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <FiltroListagem
              searchTerm={searchTerm}
              handleSearchChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        {studentPage?.data ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>
                    <span>Nome</span>
                  </TableHead>
                  <TableHead>
                    <span>E-mail</span>
                  </TableHead>
                  <TableHead>
                    <span>CPF</span>
                  </TableHead>
                  <TableHead>
                    <span>Ano de Matricula</span>
                  </TableHead>
                  <TableHead>
                    <span>Turmas</span>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPage?.data.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell></TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.cpf}</TableCell>
                    <TableCell>{student.enrollmentYear}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {formatClassGroup(student)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => navigate(`/students/edit/${student.id}`)}
                      >
                        <Pencil className="size-3 text-green-500" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/students/view/${student.id}`)}
                      >
                        <Eye className="size-3 text-green-500" />
                      </Button>
                      <Button onClick={() => deleteStudent(student.id)}>
                        <X className="size-3 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {studentPage && (
              <Pagination
                pages={studentPage.pages}
                items={studentPage.pageItems}
                page={page}
                totalItems={studentPage.totalItems}
              />
            )}
          </>
        ) : (
          <div>
            <h1 className="text-center font-medium">Nenhum aluno cadastrado</h1>
          </div>
        )}
      </main>
    </>
  );
};

export default StudentList;
