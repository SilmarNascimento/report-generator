import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { successAlert, warningAlert } from '../../utils/toastAlerts';
import { subjectSchema } from './SubjectSchema';
import { Subject } from '../../interfaces';

interface EditSubjectFormProps {
  entity: Subject;
}

export function EditSubjectForm( { entity }: EditSubjectFormProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState } = useForm<Subject>({
    resolver: zodResolver(subjectSchema),
  })


  const editSubject = useMutation({
    mutationFn: async ({ id, name }: Subject) => {
      const response = await fetch(`http://localhost:8080/subject/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ name }),
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-subjects'],
        });
        successAlert('Assunto alterado com sucesso!');
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  async function handleEditSubject({ id, name }: Subject) {
    await editSubject.mutateAsync({ id, name })
  }

  return (
    <form onSubmit={handleSubmit(handleEditSubject)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="title">Subject Id</label>
        <input 
          {...register('id')}
          id="subjectId" 
          type="text"
          value={entity.id}
          readOnly 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.id && <p className="text-sm text-red-400">{formState.errors.id.message}</p> }
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="title">Subject name</label>
        <input 
          {...register('name')}
          id="name" 
          type="text"
          defaultValue={entity.name} 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.name && <p className="text-sm text-red-400">{formState.errors.name.message}</p> }
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          disabled={formState.isSubmitting || !Object.keys(formState.dirtyFields).length}
          className="bg-teal-400 text-teal-950" type="submit"
        >
          {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
          Save
        </Button>
      </div>
    </form>
  )
}