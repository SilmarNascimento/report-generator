import { useParams } from "@tanstack/react-router";
import Breadcrumb from "@/components/features/Breadcrumb";
import FormularioPerfil from "@/components/forms/perfil/FormularioPerfil";
import { useSuspenseQuery } from "@tanstack/react-query";
import { perfilQueryOptions } from "@/loaders/perfilLoader";
import { useHandleEditPerfil } from "@/hooks/crud/perfil/useHandleEditPerfil";
import { Route } from "@/router/perfis/editar-perfil/$id";
import { mapPerfilResponseToFormulario } from "@/mappers/perfilMapper";

const EditarFormularioPerfil = () => {
  const { id } = useParams({ from: Route.fullPath });

  const { data: perfil } = useSuspenseQuery(perfilQueryOptions(id));
  const { formData } = mapPerfilResponseToFormulario(perfil);
  const { handleEdit } = useHandleEditPerfil(id);

  return (
    <>
      <Breadcrumb />
      <h1 className={`my-6 text-xl font-bold`}>Perfis</h1>

      <FormularioPerfil
        titulo="Alterar Perfil"
        modo="edicao"
        handleSubmitRequest={handleEdit}
        defaultValues={formData}
      />
    </>
  );
};

export default EditarFormularioPerfil;
