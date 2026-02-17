import { Check, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import * as Dialog from "@radix-ui/react-dialog";
import { SubjectFormOutput, subjectSchema } from "./subjectSchema";
import { useHandleCreateSubject } from "@/hooks/CRUD/subject/useHandleCreateSubject";

export function CreateSubjectForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(subjectSchema),
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
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          disabled={
            formState.isSubmitting || !Object.keys(formState.dirtyFields).length
          }
          className="bg-teal-400 text-teal-950"
          type="submit"
        >
          {formState.isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Save
        </Button>
      </div>
    </form>
  );
}
