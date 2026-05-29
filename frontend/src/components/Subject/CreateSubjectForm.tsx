import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { SubjectFormOutput, SubjectSchema } from "./SubjectSchema";
import { useHandleCreateSubject } from "@/hooks/CRUD/subject/useHandleCreateSubject";
import Botao from "../Shared/Botao";

export function CreateSubjectForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(SubjectSchema),
  });

  const createSubject = useHandleCreateSubject();

  async function handleCreateSubject({ name, fixedWeight }: SubjectFormOutput) {
    await createSubject.mutateAsync({ name, fixedWeight });
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateSubject)}
      className="w-full space-y-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="title">
          Assunto
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="border border-zinc-800 rounded-lg px-3 py-2.5  w-full text-sm"
        />
        {formState.errors?.name && (
          <p className="text-sm text-red-400">
            {formState.errors.name.message}
          </p>
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
          className="border border-zinc-800 rounded-lg px-3 py-2.5  w-full text-sm"
        />
        {formState.errors?.fixedWeight && (
          <p className="text-sm text-red-400">
            {formState.errors.fixedWeight.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Botao variant="cancelar">Cancelar</Botao>
        </Dialog.Close>
        <Botao
          variant="confirmar"
          disabled={
            formState.isSubmitting || !Object.keys(formState.dirtyFields).length
          }
          type="submit"
        >
          Salvar
        </Botao>
      </div>
    </form>
  );
}
