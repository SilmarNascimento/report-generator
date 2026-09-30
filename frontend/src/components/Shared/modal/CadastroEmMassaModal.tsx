import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputDragDropWrapper } from "@/components/Features/form-input/InputDragDropWrapper";
import { spreadsheetFileAccept } from "@/constants/general";
import { ErroLinhaPlanilha } from "@/interfaces/Modal";
import { BaseListagemModal } from "./BaseListagemModal";
import {
  CadastroEmMassaFormType,
  cadastroEmMassaSchema,
} from "./cadastroEmMassaSchema";

type CadastroEmMassaModalProps = {
  isOpen: boolean;
  entidade: string;
  erros: ErroLinhaPlanilha[];
  onConfirm: (arquivo: File) => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function CadastroEmMassaModal({
  isOpen,
  entidade,
  erros,
  onConfirm,
  onClose,
  isLoading,
}: CadastroEmMassaModalProps) {
  const formMethods = useForm<CadastroEmMassaFormType>({
    resolver: zodResolver(cadastroEmMassaSchema),
    defaultValues: { arquivo: undefined },
  });
  const { handleSubmit, watch, formState } = formMethods;

  const hasFile = watch("arquivo") instanceof File;
  const entidadeMinuscula = entidade.toLowerCase();

  const onSubmit = (formData: CadastroEmMassaFormType) => {
    onConfirm(formData.arquivo);
  };

  return (
    <BaseListagemModal
      isOpen={isOpen}
      title={`Cadastro de ${entidade}`}
      size="md"
      confirmLabel={`Cadastrar ${entidadeMinuscula}`}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      confirmDisabled={!hasFile}
      isLoading={isLoading}
    >
      <FormProvider {...formMethods}>
        <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
          <InputDragDropWrapper
            variant="preview"
            name="arquivo"
            errors={formState.errors}
            message={`Arraste a planilha de ${entidadeMinuscula} (.xlsx, .xls, .csv...)`}
            accept={spreadsheetFileAccept}
          />
        </form>
      </FormProvider>

      {erros.length > 0 && <ListaErrosPlanilha erros={erros} />}
    </BaseListagemModal>
  );
}

function ListaErrosPlanilha({ erros }: { erros: ErroLinhaPlanilha[] }) {
  return (
    <section className="mt-4 space-y-2">
      <p className="text-sm font-bold text-destructive">
        Nenhum registro foi cadastrado. Corrija os itens abaixo na planilha e
        envie novamente:
      </p>
      <ul className="max-h-60 space-y-1 overflow-y-auto rounded-md border border-border p-3 text-sm">
        {erros.map((erro, index) => (
          <li key={`${erro.row}-${erro.column}-${index}`}>
            <span className="font-semibold">
              Linha {erro.row} · {erro.column}:
            </span>{" "}
            {erro.message}
            {erro.value && (
              <span className="text-muted-foreground">
                {" "}
                (valor: &quot;{erro.value}&quot;)
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
