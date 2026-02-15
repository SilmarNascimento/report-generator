import { NavigationBar } from "@/components/NavigationBar";
import { Pagination } from "@/components/pagination";
import FiltroListagem from "@/components/shared/FiltroListagem";
import { Button } from "@/components/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetStudents } from "@/hooks/CRUD/student/useGetStudents";
import { useHandleDeleteStudent } from "@/hooks/CRUD/student/useHandleDeleteStudent";
import useDebounceValue from "@/hooks/useDebounceValue";
import { StudentResponse } from "@/interfaces/Student";
import { FileDown, Pencil, Plus, X } from "lucide-react";
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
    const { classGroup } = student;

    return classGroup.map((group) => <span>{group}</span>);
  }

  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Alunos</h1>
          <Button variant="primary" onClick={handleCreateStudent}>
            <Plus className="size-3" />
            Create new
          </Button>
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
                  <Button onClick={() => deleteStudent(student.id)}>
                    <X className="size-3 text-red-500" />
                  </Button>
                  <Button
                    onClick={() => navigate(`/students/edit/${student.id}`)}
                  >
                    <Pencil className="size-3 text-green-500" />
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
      </main>
    </>
  );
};

export default StudentList;
