import Breadcrumb from "@/components/features/Breadcrumb";
import FormularioUsuario from "@/components/forms/usuario/FormularioUsuario";
import { useParams } from "@tanstack/react-router";
import { Route } from "@/router/usuarios/editar-usuario/$id";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usuarioQueryOptions } from "@/loaders/usuarioLoader";
import { useHandleEditUsuario } from "@/hooks/crud/usuario/useHandleEditUsuario";
import { mapResponseToUsuarioFormulario } from "@/mappers/usuarioMapper";
import { perfilListQueryOptions } from "@/loaders/perfilLoader";
import { mapPerfilsToDropdown } from "@/mappers/generalMapper";

const EditarFormularioUsuario = () => {
  const { id } = useParams({ from: Route.fullPath });

  const { data: usuarioResponse } = useSuspenseQuery(usuarioQueryOptions(id));
  const { data: perfilResponse } = useSuspenseQuery(perfilListQueryOptions);

  const { usuarioForm, perfilOption } =
    mapResponseToUsuarioFormulario(usuarioResponse);

  const { handleEdit } = useHandleEditUsuario(id);

  return (
    <>
      <Breadcrumb />
      <h1 className={`my-6 text-xl font-bold`}>Usuários</h1>

      <FormularioUsuario
        titulo="Alterar Usuário"
        modo="edicao"
        defaultValues={usuarioForm}
        perfilDefaultValue={perfilOption.label}
        handleSubmitRequest={handleEdit}
        turmaDropdown={[]}
        anoMatriculaDropdown={[]}
        opcoesPerfil={mapPerfilsToDropdown(perfilResponse)}
      />
    </>
  );
};

export default EditarFormularioUsuario;
