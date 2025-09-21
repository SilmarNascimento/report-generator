import FormularioUsuario from "@/components/forms/usuario/FormularioUsuario";
import Breadcrumb from "@/components/features/Breadcrumb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Route } from "@/router/usuarios/visualizar-usuario/$id";
import { usuarioQueryOptions } from "@/loaders/usuarioLoader";
import { mapResponseToUsuarioFormulario } from "@/mappers/usuarioMapper";
import { useParams } from "@tanstack/react-router";

const VisualizacaoFormularioUsuario = () => {
  const { id } = useParams({ from: Route.fullPath });

  const { data: usuarioResponse } = useSuspenseQuery(usuarioQueryOptions(id));
  const { usuarioForm, perfilOption } =
    mapResponseToUsuarioFormulario(usuarioResponse);

  return (
    <div className={`text-xl`}>
      {" "}
      <Breadcrumb />
      <h1 className="my-6 text-xl font-bold">Usuários</h1>
      <FormularioUsuario
        titulo={`${usuarioForm.nomeUsuario ?? "Visualização do Usuário"}`}
        modo="visualizacao"
        defaultValues={usuarioForm}
        perfilDefaultValue={perfilOption.label}
      />
    </div>
  );
};

export default VisualizacaoFormularioUsuario;
