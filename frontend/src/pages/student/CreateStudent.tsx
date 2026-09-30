import StudentForm from "@/components/Forms/student/StudentForm";
import { NavigationBar } from "@/components/NavigationBar";
import { useHandleCreateStudent } from "@/hooks/CRUD/student/useHandleCreateStudent";
import PaginaContainer from "@/components/Shared/PaginaContainer";

const CreateStudent = () => {
  const { handleCreate } = useHandleCreateStudent();
  return (
    <>
      <header>
        <NavigationBar />
      </header>

      <PaginaContainer>
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
      </PaginaContainer>
    </>
  );
};

export default CreateStudent;
