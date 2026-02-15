import StudentForm from "@/components/forms/student/StudentForm";
import { studentQueryOptions } from "@/loader/studentLoader";
import { mapStudentResponseToForm } from "@/mapper/student";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const StudentView = () => {
  const { id } = useParams();

  const { data: aluno } = useSuspenseQuery(studentQueryOptions(id ?? ""));
  return (
    <>
      <h1
        className={`my-6 text-xl leading-[1.4] font-bold tracking-[-0.25px] text-[#2C2E34]`}
      >
        Alunos
      </h1>

      <StudentForm
        modo="view"
        titulo="Editar Cadastro de Aluno"
        defaultValues={mapStudentResponseToForm(aluno)}
      />
    </>
  );
};

export default StudentView;
