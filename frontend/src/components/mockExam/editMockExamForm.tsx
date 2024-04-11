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
import { useEffect, useState } from 'react';
import { DevTool } from '@hookform/devtools';

type EditMockExamForm = z.infer<typeof mockExamSchema>;

export function EditMockExamForm() {
  const [hasChanged, setHasChanged] = useState(false);
  const queryClient = useQueryClient();
  const { mockExamId } = useParams<{ mockExamId: string }>() ?? "";
  const navigate = useNavigate();

  const { data: mockExamResponse } = useQuery<MockExam>({
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
    resolver: zodResolver(mockExamSchema)
  });
  const { register, handleSubmit, formState, setValue, watch, control } = formMethods;

  useEffect(() => {
    if (mockExamResponse) {
      setValue("name", mockExamResponse.name);
      setValue("className", mockExamResponse.className[0]);
      setValue("releasedYear", mockExamResponse.releasedYear.toString());
      setValue("number", mockExamResponse.number.toString());
    }
  }, [mockExamResponse, setValue]);

  useEffect(() => {
    function hasChangedValues(): boolean {
      const classNameFormValues = watch("className");

      if (classNameFormValues !== mockExamResponse?.className[0] || !!Object.keys(formState.dirtyFields).length) {
        return true;
      }

      return false;
    }

    setHasChanged(hasChangedValues());
  }, [formState, hasChanged, mockExamResponse, watch])

  const editMainQuestion = useMutation({
    mutationFn: async ({ name, className, releasedYear, number}: EditMockExamForm) => {
      const response = await fetch(`http://localhost:8080/mock-exam/${mockExamId}`,
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className={`text-sm ${formState.errors?.number ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.number ? formState.errors.number.message : '\u00A0'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={formState.isSubmitting || !hasChanged}
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
      <DevTool control={control} />
    </FormProvider>
  )
}