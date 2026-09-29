import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SubjectFormInput, SubjectFormOutput, subjectSchema } from "./subjectSchema";
import Botao from "@/components/Shared/Botao";

type SubjectFormProps = {
  modo: "criacao" | "edicao";
  defaultValues?: SubjectFormInput;
  handleSubmitRequest: (data: SubjectFormOutput) => Promise<void>;
};

export function SubjectForm({ modo, defaultValues, handleSubmitRequest }: SubjectFormProps) {
  const memoizedDefaultValues = useMemo(
    () => defaultValues ?? { name: "", fixedWeight: undefined },
    [defaultValues],
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: memoizedDefaultValues,
  });

  const { errors, isDirty, isSubmitting } = formState;

  return (
    <form onSubmit={handleSubmit(handleSubmitRequest)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="name">
          Assunto
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
        />
        {errors?.name && (
          <p className="text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="fixedWeight">
          Peso
        </label>
        <input
          {...register("fixedWeight")}
          id="fixedWeight"
          type="text"
          className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
        />
        {errors?.fixedWeight && (
          <p className="text-sm text-red-400">{errors.fixedWeight.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Botao variant="cancelar">Cancelar</Botao>
        </Dialog.Close>
        <Botao
          variant="confirmar"
          disabled={isSubmitting || !isDirty}
          type="submit"
        >
          {modo === "criacao" ? "Salvar" : "Editar"}
        </Botao>
      </div>
    </form>
  );
}
