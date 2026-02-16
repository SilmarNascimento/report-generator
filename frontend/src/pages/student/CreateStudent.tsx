import StudentForm from "@/components/forms/student/StudentForm";
import { useHandleCreateStudent } from "@/hooks/CRUD/student/useHandleCreateStudent";

const CreateStudent = () => {
  const { handleCreate } = useHandleCreateStudent();
  return (
    <main className="max-w-6xl mx-auto space-y-5">
      <h1
        className={`my-6 text-xl leading-[1.4] font-bold tracking-[-0.25px] text-[#2C2E34]`}
      >
        Alunos
      </h1>

      <StudentForm
        modo="criacao"
        titulo="Cadastrar Aluno"
        handleSubmitRequest={handleCreate}
      />
    </main>
  );
};

export default CreateStudent;
