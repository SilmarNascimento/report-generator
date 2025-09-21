import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import FiltroListagem from "@/components/features/FiltroListagem";
import RodapePaginacao from "@/components/features/RodapePaginacao";
import Modal from "@/components/shared/Modal";
import TabelaListagem from "@/components/shared/tabela/TabelaListagem";
import useListagemDados from "@/hooks/useListagemDados";
import useListagemModal from "@/hooks/useListagemModal";

import {
  usuarioCabecalhoTabela,
  usuarioFieldMapping,
} from "@/constants/usuario";
import { mapUsuarioResumidoToUsuarioTransformed } from "@/mappers/usuarioMapper";
import { Route } from "@/router/usuarios";
import { UsuarioResumidoResponse, UsuarioTransformed } from "@/types/usuario";

const ListagemUsuario = () => {
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);

  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const transformData = useCallback(mapUsuarioResumidoToUsuarioTransformed, []);

  const setSearchParams = (newParams) => {
    const merged = { ...searchParams, ...newParams };
    const changed = Object.keys(merged).some(
      (key) => merged[key] !== searchParams[key],
    );
    if (!changed) return;
    navigate({ search: merged });
  };

  const {
    data,
    page,
    totalPages,
    totalItems,
    searchTerm,
    handleSearchChange,
    sortTable,
    atualizarDados,
  } = useListagemDados<UsuarioResumidoResponse, UsuarioTransformed>(
    "/usuario",
    "nomeUsuarioOuNomePerfil",
    usuarioFieldMapping,
    transformData,
    usuarioFieldMapping.nome,
    {
      searchParams,
      setSearchParams,
    },
  );

  const { isModalOpen, definirTitulo, abrirModal, fecharModal, confirmarAcao } =
    useListagemModal({
      endpoint: "/usuario",
      chaveStatus: "status_usuario",
      entidade: "usuário",
      invalidateKeys: [["/usuario"]],
      onAfterChange: atualizarDados,
    });

  const { titulo, mensagem } = definirTitulo();

  return (
    <>
      <h2 className="my-6 text-xl font-bold">Usuários</h2>

      <div className="relative flex min-h-0 flex-1 flex-col rounded-2xl bg-white px-6 py-8">
        <section className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <FiltroListagem
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
        </section>

        <div className="min-h-0 w-full flex-1 overflow-x-auto overflow-y-auto">
          <TabelaListagem
            data={data?.transformed ?? []}
            tableHeaders={[...usuarioCabecalhoTabela]}
            abrirModal={(id, nome, status, tipo) => {
              setIdSelecionado(id);
              abrirModal(id, nome, status, tipo, undefined);
            }}
            onSort={sortTable}
          />
        </div>

        {Array.isArray(data?.transformed) && data.transformed.length > 0 && (
          <div className="mt-4 flex w-full justify-center">
            <RodapePaginacao
              page={page}
              items={25}
              totalItems={totalItems}
              pages={totalPages}
              onPageChange={(pagina) =>
                navigate({
                  search: {
                    ...searchParams,
                    pagina_atual: pagina,
                  },
                })
              }
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={fecharModal}
          title={titulo}
          onConfirm={confirmarAcao}
          idItem={idSelecionado ?? 0}
        >
          {mensagem}
        </Modal>
      )}
    </>
  );
};

export default ListagemUsuario;
