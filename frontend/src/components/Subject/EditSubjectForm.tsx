import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { SubjectFormOutput, SubjectSchema } from "./SubjectSchema";
import { Subject } from "@/interfaces";
import { useHandleEditSubject } from "@/hooks/CRUD/subject/useHandleEditSubject";
import Botao from "../Shared/Botao";

interface EditSubjectFormProps {
  entity: Subject;
}

export function EditSubjectForm({ entity }: EditSubjectFormProps) {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      name: entity.name,
      fixedWeight: entity.fixedWeight * 100,
    },
  });

  const editSubject = useHandleEditSubject();

  const handleEditSubject = async (data: SubjectFormOutput) => {
    await editSubject.mutateAsync({
      subjectId: entity.id,
      ...data,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleEditSubject)}
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
          defaultValue={entity.name}
          className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
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
          className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
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
