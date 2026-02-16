import StudentForm from "@/components/forms/student/StudentForm";
import { NavigationBar } from "@/components/NavigationBar";
import { useHandleEditStudent } from "@/hooks/CRUD/student/useHandleEditStudent";
import { studentQueryOptions } from "@/loader/studentLoader";
import { mapStudentResponseToForm } from "@/mapper/student";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditStudent = () => {
  const { id } = useParams();

  const { data: aluno } = useSuspenseQuery(studentQueryOptions(id ?? ""));
  const { handleEdit } = useHandleEditStudent(id ?? "");
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
          modo="edicao"
          titulo="Editar Cadastro de Aluno"
          defaultValues={mapStudentResponseToForm(aluno)}
          handleSubmitRequest={handleEdit}
        />
      </main>
    </>
  );
};

export default EditStudent;
