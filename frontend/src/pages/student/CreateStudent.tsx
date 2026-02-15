import StudentForm from "@/components/forms/student/StudentForm";
import { useHandleCreateStudent } from "@/hooks/CRUD/student/useHandleCreateStudent";

const CreateStudent = () => {
  const { handleCreate } = useHandleCreateStudent();
  return (
    <>
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
    </>
  );
};

export default CreateStudent;
