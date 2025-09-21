import useDebounceValue from "@/hooks/useDebounceValue";
import Breadcrumb from "@/components/features/Breadcrumb";
import FormularioUsuario from "@/components/forms/usuario/FormularioUsuario";
import { useParams } from "@tanstack/react-router";
import { Route } from "@/router/usuarios/editar-usuario/$id";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usuarioQueryOptions } from "@/loaders/usuarioLoader";
import { orgaosQueryOptions } from "@/loaders/servicoHabilitadoLoader";
import { useHandleEditUsuario } from "@/hooks/crud/usuario/useHandleEditUsuario";
import { mapResponseToUsuarioFormulario } from "@/mappers/usuarioMapper";
import { useOrgaosRequest } from "@/hooks/crud/useOrgaosRequest";
import { useState } from "react";
import { perfilListQueryOptions } from "@/loaders/perfilLoader";
import {
  mapOrgaosToDropdown,
  mapPerfilsToDropdown,
} from "@/mappers/generalMapper";

const EditarFormularioUsuario = () => {
  const { id } = useParams({ from: Route.fullPath });

  const { data: usuarioResponse } = useSuspenseQuery(usuarioQueryOptions(id));
  const { data: orgaosResponse } = useSuspenseQuery(orgaosQueryOptions);
  const { data: perfilResponse } = useSuspenseQuery(perfilListQueryOptions);

  const [queryOrgao, setQueryOrgao] = useState<string>("");
  const debouncedQueryOrgao = useDebounceValue(queryOrgao, 300);

  const { usuarioForm, perfilOption } =
    mapResponseToUsuarioFormulario(usuarioResponse);
  const { data: orgaos = orgaosResponse } =
    useOrgaosRequest(debouncedQueryOrgao);
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
        orgaosDropdown={mapOrgaosToDropdown(orgaos)}
        queryOrgao={queryOrgao}
        setQueryOrgao={setQueryOrgao}
        opcoesPerfil={mapPerfilsToDropdown(perfilResponse)}
      />
    </>
  );
};

export default EditarFormularioUsuario;
