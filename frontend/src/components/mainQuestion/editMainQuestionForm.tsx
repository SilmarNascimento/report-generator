import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editMainQuestionSchema } from './MainQuestionSchema';
import { AlternativeForm } from '../alternativesForm';



type MainQuestionSchema = z.infer<typeof editMainQuestionSchema>

interface EditSubjectFormProps {
  entity: MainQuestionSchema;
}

export function EditMainQuestionForm( { entity }: EditSubjectFormProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState, control } = useForm<MainQuestionSchema>({
    resolver: zodResolver(editMainQuestionSchema),
  })


  const editSubject = useMutation({
    mutationFn: async (data: MainQuestionSchema) => {
      try {
        const response = await fetch(`http://localhost:8080/main-question/${data.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(data),
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-subjects'],
        })
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        console.log("Error: ", errorMessage);
      }
      
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  })

  async function handleEditSubject(data: MainQuestionSchema) {
    await editSubject.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(handleEditSubject)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="enunciado">Enunciado</label>
        <input 
          {...register('title')}
          id="enunciado" 
          type="text" 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.title && (
          <p className="text-sm text-red-400">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="images">Imagem do enunciado</label>
        <input 
          {...register('images')}
          id="images" 
          type="file" 
          multiple
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.title && (
          <p className="text-sm text-red-400">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="level">Nível da questão</label>
        <input 
          {...register('level')}
          id="level" 
          type="text" 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.level && (
          <p className="text-sm text-red-400">{formState.errors.level.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Dialog.Title className="text-lg font-bold">
          Alternativas
        </Dialog.Title>
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <AlternativeForm key={index} index={index} control={control} errors={formState.errors} />
        ))}
      </div>



      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button disabled={formState.isSubmitting} className="bg-teal-400 text-teal-950" type="submit">
          {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
          Save
        </Button>
      </div>
    </form>
  )
}