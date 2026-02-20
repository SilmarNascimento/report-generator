import StudentForm from "@/components/Forms/student/StudentForm";
import { NavigationBar } from "@/components/NavigationBar";
import { studentQueryOptions } from "@/loader/studentLoader";
import { mapStudentResponseToForm } from "@/mapper/student";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const StudentView = () => {
  const { id } = useParams();

  const { data: aluno } = useSuspenseQuery(studentQueryOptions(id ?? ""));
  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <main className="max-w-6xl mx-auto space-y-5">
        <h1
          className={`my-6 text-xl leading-[1.4] font-bold tracking-[-0.25px] text-[#2C2E34]`}
        >
          Alunos
        </h1>

        <StudentForm
          modo="view"
          titulo="Editar Cadastro de Aluno"
          defaultValues={mapStudentResponseToForm(aluno)}
          responses={aluno.performanceHistory}
        />
      </main>
    </>
  );
};

export default StudentView;
