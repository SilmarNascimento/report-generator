import { Check, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom';
import { MockExam } from '../../interfaces';
import { successAlert, warningAlert } from '../../utils/toastAlerts';
import { mockExamSchema } from './MockExamSchema';
import { SelectClass } from '../ui/selectClass';

type EditMockExamForm = z.infer<typeof mockExamSchema>;

export function EditMockExamForm() {
  const queryClient = useQueryClient();
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";
  const navigate = useNavigate();

  const { data: mainQuestionFoundResponse } = useQuery<MockExam>({
    queryKey: ['get-mock-exams', mockExamId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/mock-exam/${mockExamId}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  }); 

  const formMethods = useForm<EditMockExamForm>({
    resolver: zodResolver(mockExamSchema),
    defaultValues: {
      name: mainQuestionFoundResponse?.name,
      //className: mainQuestionFoundResponse?.className[0] ?? "Intensivo",
      releasedYear: mainQuestionFoundResponse?.releasedYear.toString(),
      number: mainQuestionFoundResponse?.number.toString(),
    }
  });
  const { register, handleSubmit, formState } = formMethods;

  const editMainQuestion = useMutation({
    mutationFn: async ({ name, className, releasedYear, number}: EditMockExamForm) => {
      const response = await fetch(`http://localhost:8080/main-question/${mockExamId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
          name,
          className: [className],
          releasedYear,
          number
        }),
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-mock-exams'],
        });
        successAlert('Simulado alterado com sucesso!');
        navigate("/mock-exams");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  async function handleEditMockExam(data: EditMockExamForm) {
    await editMainQuestion.mutateAsync(data)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleEditMockExam)} encType='multipart/form-data' className="w-full space-y-6">
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
            type='number' 
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
            type='number' 
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