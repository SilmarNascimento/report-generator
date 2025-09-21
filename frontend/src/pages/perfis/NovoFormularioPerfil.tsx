import Breadcrumb from "@/components/features/Breadcrumb";
import FormularioPerfil from "@/components/forms/perfil/FormularioPerfil";
import { useHandleCreatePerfil } from "@/hooks/crud/perfil/useHandleCreatePerfil";

const NovoFormularioPerfil = () => {
  const { handleCreate } = useHandleCreatePerfil();

  return (
    <>
      <Breadcrumb />
      <h1 className={`my-6 text-xl font-bold`}>Perfis</h1>

      <FormularioPerfil
        titulo="Novo Perfil"
        modo="criacao"
        handleSubmitRequest={handleCreate}
      />
    </>
  );
};

export default NovoFormularioPerfil;
