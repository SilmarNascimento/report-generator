import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function checkFileType(file: File) {
  if (file?.name) {
      const fileType = file.name.split(".").pop();
      if (fileType && ["gif", "png", "jpg"].includes(fileType)) return true; 
  }
  return false;
}

const fileSchema = z.any()
    .refine(file => file instanceof File, {
      message: 'A file is required',
    })
    .refine((file) => checkFileType(file), "Only .jpg, .gif, .png formats are supported.");

const subjectSchema = z.object({
  name: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

const alternativeSchema = z.object({
  id: z.string(),
  description: z.string(),
  images: z.array(fileSchema),
  questionAnswer: z.boolean()
});

const adaptedQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  images: z.array(fileSchema),
  alternatives: z.array(alternativeSchema)
});

const mockExamSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.array(z.string()),
  subjects: z.array(subjectSchema),
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
  images: z.array(fileSchema),
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


  const createMainQuestion = useMutation({
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
    await createMainQuestion.mutateAsync({ name })
  }

  return (
    <form onSubmit={handleSubmit(handleCreateSubject)} className="w-full space-y-6">
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