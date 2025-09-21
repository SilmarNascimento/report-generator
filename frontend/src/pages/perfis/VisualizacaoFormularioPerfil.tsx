import Breadcrumb from "@/components/features/Breadcrumb";
import FormularioPerfil from "@/components/forms/perfil/FormularioPerfil";
import { useParams } from "@tanstack/react-router";
import { Route } from "@/router/perfis/visualizar-perfil/$id";
import { useSuspenseQuery } from "@tanstack/react-query";
import { perfilQueryOptions } from "@/loaders/perfilLoader";
import { mapPerfilResponseToFormulario } from "@/mappers/perfilMapper";

const VisualizacaoFormularioPerfil = () => {
  const { id } = useParams({ from: Route.fullPath });

  const { data: perfil } = useSuspenseQuery(perfilQueryOptions(id));
  const { formData, listaUsuarios } = mapPerfilResponseToFormulario(perfil);

  return (
    <>
      <Breadcrumb />
      <h1 className={`my-6 text-xl font-bold`}>Perfis</h1>

      <FormularioPerfil
        titulo={`${formData.nomePerfil ?? "Visualização de Perfil"}`}
        modo="visualizacao"
        defaultValues={formData}
        listaUsuarios={listaUsuarios}
      />
    </>
  );
};

export default VisualizacaoFormularioPerfil;
