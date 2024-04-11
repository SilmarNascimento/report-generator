import { Check, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAlternativeSchema, mainQuestionSchema } from './MainQuestionSchema';
import { AlternativeForm } from '../alternative/alternativesForm';
import { useNavigate, useParams } from 'react-router-dom';
import { MainQuestion } from '../../interfaces';
import { DevTool } from '@hookform/devtools'
import { CreateAlternative } from '../../interfaces/createAlternative';
import { CreateQuestion } from '../../interfaces/createQuestion';
import { useEffect, useState } from 'react';
import { successAlert, warningAlert } from '../../utils/toastAlerts';

type EditMainQuestionForm = z.infer<typeof mainQuestionSchema>;

export function EditMainQuestionForm() {
  const [hasChanged, setHasChanged] = useState(false);
  const queryClient = useQueryClient();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  const navigate = useNavigate();

  const formMethods = useForm<EditMainQuestionForm>({
    resolver: zodResolver(mainQuestionSchema),
  });
  const { register, handleSubmit, formState, setValue, control, watch } = formMethods;

  const { data: mainQuestionFoundResponse } = useQuery<MainQuestion>({
    queryKey: ['get-main-questions', mainQuestionId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });  

  useEffect(() => {
    if (mainQuestionFoundResponse) {
      setValue('title', mainQuestionFoundResponse.title);
      setValue('level', mainQuestionFoundResponse.level);
      mainQuestionFoundResponse.alternatives.forEach((alternative, index) => {
        setValue(`alternatives.${index}.description`, alternative.description);
        if (alternative.questionAnswer) {
          setValue('questionAnswer', index.toString());
        }
      });
    }
  }, [mainQuestionFoundResponse, setValue]);

  useEffect(() => {
    function hasChangedValues(): boolean {
      const questionAnswerFormValues = watch("questionAnswer");

      const questionAnswerIndex = mainQuestionFoundResponse?.alternatives
        .findIndex(alternative => alternative.questionAnswer) ?? '';
      
      if (questionAnswerFormValues !== questionAnswerIndex.toString() || !!Object.keys(formState.dirtyFields).length) {
        return true;
      }

      return false;
    }

    setHasChanged(hasChangedValues());
  }, [formState, hasChanged, mainQuestionFoundResponse, watch])

  const editMainQuestion = useMutation({
    mutationFn: async (data: EditMainQuestionForm) => {
      const formData = new FormData();
      let titleImage: File[] = [];
      const alternativeImages: File[] = [];

      if (data.images) {
        titleImage = Array.from(data?.images)
          .filter((file): file is File => file !== undefined);
      }

      const alternatives: z.infer<typeof createAlternativeSchema>[] = data.alternatives;
      for (const alternative of alternatives) {
        if (alternative.images) {
          const files = Array.from(alternative.images).filter((file): file is File => file !== undefined);
          alternativeImages.push(...files);
        }
      }

      const totalImages = titleImage.concat(alternativeImages);
      totalImages.forEach((file) => {
        formData.append('images', file);
      });

      const createAlternatives = data.alternatives.map((alternative, index) => {
        const createAlternative: CreateAlternative = {
          description: alternative.description,
          questionAnswer: Number(data.questionAnswer) === index
        }
        return createAlternative
      })
      const createMainQuestion: CreateQuestion = {
        title: data.title,
        level: data.level,
        alternatives: createAlternatives
      };
      const json = JSON.stringify(createMainQuestion);
      const blob = new Blob([json], {
        type: 'application/json'
      });

      formData.append("mainQuestionInputDto", blob);

      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}`,
      {
        method: 'PUT',
        body: formData,
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        successAlert('Questão principal alterada com sucesso!');
        navigate("/main-questions");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })

  async function handleEditMainQuestion(data: EditMainQuestionForm) {
    await editMainQuestion.mutateAsync(data)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleEditMainQuestion)} className="w-full space-y-6" encType='multipart/form-data'>
        <div className="space-y-2">
          <label className="text-sm font-medium block" htmlFor="enunciado">Enunciado</label>
          <input 
            {...register('title')}
            id="enunciado" 
            type="text" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.title ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.title ? formState.errors.title.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block" htmlFor="images">Imagem do enunciado</label>
          <input 
            {...register('images')}
            id="images" 
            type="file" 
            multiple
            hidden
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.images ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.images ? formState.errors.images.message : '\u00A0'}
          </p>
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
          <span className="text-lg font-medium">
            Alternativas
          </span>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <AlternativeForm key={index} index={index} errors={formState.errors} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={formState.isSubmitting  || !hasChanged}
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
            Save
          </Button>
          <Button onClick={() => navigate("/main-questions")}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
      <DevTool control={control}/>
    </FormProvider>
  )
}