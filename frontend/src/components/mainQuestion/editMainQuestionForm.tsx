import { Check, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAlternativeSchema, editMainQuestionForm, editMainQuestionSchema } from './MainQuestionSchema';
import { AlternativeForm } from '../alternativesForm';
import { useNavigate, useParams } from 'react-router-dom';
import { MainQuestion } from '../../interfaces';
import { DevTool } from '@hookform/devtools'
import { Bounce, toast } from 'react-toastify';
import { CreateAlternative } from '../../interfaces/createAlternative';
import { CreateQuestion } from '../../interfaces/createQuestion';
import { useEffect, useState } from 'react';

type EditMainQuestionForm = z.infer<typeof editMainQuestionForm>
type EditMainQuestionSchema = z.infer<typeof editMainQuestionSchema>

export function EditMainQuestionForm() {
  const [hasChanged, setHasChanged] = useState(false);
  const queryClient = useQueryClient();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  const navigate = useNavigate();

  const formMethods = useForm<EditMainQuestionForm>({
    resolver: zodResolver(editMainQuestionForm),
  });
  const { register, handleSubmit, formState, setValue, control, watch } = formMethods;

  const { data: mainQuestionFoundResponse } = useQuery<MainQuestion>({
    queryKey: ['get-main-questions', mainQuestionId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/main-question/${mainQuestionId}`)
      const data = await response.json()

      console.log(data);
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
      const updatedFormValues = {...watch()}; 

      const alternatives = updatedFormValues.alternatives.map((alternative, index) => {
        const createAlternative: CreateAlternative = {
          description: alternative.description,
          questionAnswer: Number(updatedFormValues.questionAnswer) === index
        }
        return createAlternative
      })
      updatedFormValues.alternatives = alternatives;

      if (mainQuestionFoundResponse) {    
        const keys = Object.keys(updatedFormValues) as (keyof EditMainQuestionForm)[];
        for (let index = 0; index < keys.length; index ++) {
          const inputName = keys[index];
          if (inputName === 'questionAnswer') {
            continue;
          }
          const updatedValue = updatedFormValues[inputName];
          const originalValue = mainQuestionFoundResponse[inputName];

          if (updatedValue === undefined || originalValue === undefined || updatedValue !== originalValue) {
            return true;
          }
        }
      }

      return false;
    }

    setHasChanged(hasChangedValues());
  }, [formState, hasChanged, mainQuestionFoundResponse, watch])

  const editMainQuestion = useMutation({
    mutationFn: async (data: EditMainQuestionSchema) => {
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

      const response = await fetch(`http://localhost:8080/main-question/${data.id}`,
      {
        method: 'PUT',
        body: formData,
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ['get-main-questions'],
        });
        toast.success('Cliente salvo com sucesso!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        navigate("/main-questions");
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        toast.warn( errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  })

  async function handleEditMainQuestion(data: EditMainQuestionForm) {
    console.log(data);
    const id = mainQuestionId ?? "";
    await editMainQuestion.mutateAsync({ id, ...data})
  }

  function handleGoBack() {
    navigate('/main-questions');
  }

  if (formState.errors) {
    console.log(watch());
    
    console.log(formState.errors);
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
          <Button onClick={handleGoBack}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
      <DevTool control={control}/>
    </FormProvider>
  )
}