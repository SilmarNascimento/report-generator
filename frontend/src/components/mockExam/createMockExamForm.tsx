import { Check, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import { SelectClass } from '../ui/selectClass';
import { successAlert, warningAlert } from '../../utils/toastAlerts';
import { mockExamForm } from './MockExamSchema';

type CreateMockExamForm = z.infer<typeof mockExamForm>;

export function CreateMockExamForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formMethods = useForm<CreateMockExamForm>({
    resolver: zodResolver(mockExamForm),
  })
  const { register, handleSubmit, formState } = formMethods;


  const createMainQuestion = useMutation({
    mutationFn: async ({ name, className, releasedYear, number }: CreateMockExamForm) => {
      const response = await fetch('http://localhost:8080/mock-exam',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            name,
            className: [className],
            releasedYear,
            number
          })
        })

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ['get-mock-exams'],
        });
        successAlert('Simulado salvo com sucesso!');
        navigate("/mock-exams");
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  async function handleCreateMainQuestion(data: CreateMockExamForm) {
    await createMainQuestion.mutateAsync(data)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleCreateMainQuestion)} encType='multipart/form-data' className="w-full space-y-6">
        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="name">Descrição</label>
          <input
            type='text'  
            {...register('name')}
            id="name" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.name ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.name ? formState.errors.name.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">Turma</label>
          <SelectClass />
          <p className={`text-sm ${formState.errors?.className ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.className ? formState.errors.className.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="releasedYear">Ano de Emissão</label>
          <input
            type='text' 
            {...register('releasedYear')}
            id="releasedYear" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.releasedYear ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.releasedYear ? formState.errors.releasedYear.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="number">Número do Simulado</label>
          <input
            type='text' 
            {...register('number')}
            id="number" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.number ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.number ? formState.errors.number.message : '\u00A0'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={formState.isSubmitting || !Object.keys(formState.dirtyFields).length}
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
            Save
          </Button>
          <Button
            onClick={() => navigate("/main-questions")}
          >
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
