import { Check, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAlternativeSchema, editMainQuestionForm, editMainQuestionSchema } from './MainQuestionSchema';
import { AlternativeForm } from '../alternativesForm';
import { useNavigate, useParams } from 'react-router-dom';
import { MainQuestion } from '../../interfaces';
import { DevTool } from '@hookform/devtools'
import { Bounce, toast } from 'react-toastify';
import { CreateAlternative } from '../../interfaces/createAlternative';
import { CreateQuestion } from '../../interfaces/createQuestion';
import { useEffect } from 'react';



type EditMainQuestionForm = z.infer<typeof editMainQuestionForm>
type EditMainQuestionSchema = z.infer<typeof editMainQuestionSchema>

export function EditMainQuestionForm() {
  const queryClient = useQueryClient();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";
  const navigate = useNavigate();

  const formMethods = useForm<EditMainQuestionForm>({
    resolver: zodResolver(editMainQuestionSchema),
  });
  const { register, handleSubmit, formState, setValue, control } = formMethods;


  const { data: mainQuestionFoundResponse, isLoading } = useQuery<MainQuestion>({
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
      setValue('email', mainQuestionFoundResponse.email);
      setValue('level', mainQuestionFoundResponse.level);
      setValue('telephone', telephoneFormatter(mainQuestionFoundResponse.telephone));
      setValue('status', mainQuestionFoundResponse.status);
    }
  }, [mainQuestionFoundResponse, setValue]);




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
        body: JSON.stringify(data),
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
    const id = mainQuestionId ?? "";
    await editMainQuestion.mutateAsync({ id, ...data})
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
            <AlternativeForm key={index} index={index} errors={formState.errors} />
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
      <DevTool control={control}/>
    </FormProvider>
  )
}