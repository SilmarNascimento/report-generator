import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const subjectSchema = z.object({
  name: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

const alternativeSchema = z.object({
  id: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  questionAnswer: z.boolean()
});

const adaptedQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  images: z.array(z.string()),
  alternatives: z.array(alternativeSchema)
});

const mockExamSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.array(z.string()),
  subjects: z.array(subjectSchema),
  images: z.array(z.string()),
  number: z.number().positive(),
});

const handoutSchema = z.object({
  id: z.string(),
  title: z.string()
});

const createMainQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subjects: z.array(subjectSchema),
  level: z.string(),
  images: z.array(z.string()),
  alternatives: z.array(alternativeSchema),
  adaptedQuestions: z.array(adaptedQuestionSchema),
  mockExams: z.array(mockExamSchema),
  handouts: z.array(handoutSchema)
});

type CreateMainQuestionSchema = z.infer<typeof createMainQuestionSchema>

export function CreateMainQuestionForm() {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState } = useForm<CreateMainQuestionSchema>({
    resolver: zodResolver(createMainQuestionSchema),
  })


  const createSubject = useMutation({
    mutationFn: async ({ name }: CreateMainQuestionSchema) => {
      try {
        const response = await fetch('http://localhost:8080/main-question',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ name }),
      })

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ['get-subjects'],
        })
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        console.log("Error: ", errorMessage);
      }
      
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  })

  async function handleCreateSubject({ name }: CreateMainQuestionSchema) {
    await createSubject.mutateAsync({ name })
  }

  return (
    <form onSubmit={handleSubmit(handleCreateSubject)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="title">Subject name</label>
        <input 
          {...register('name')}
          id="name" 
          type="text" 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.name && (
          <p className="text-sm text-red-400">{formState.errors.name.message}</p>
        )}
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