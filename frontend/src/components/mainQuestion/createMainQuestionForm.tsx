import { Check, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlternativeForm } from '../alternativesForm';
import { alternativeSchema, createMainQuestionSchema } from './MainQuestionSchema';
import { CreateQuestion } from '../../interfaces/createQuestion';
import { CreateAlternative } from '../../interfaces/createAlternative';
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Select } from '../ui/selectForm';

type CreateMainQuestionSchema = z.infer<typeof createMainQuestionSchema>

export function CreateMainQuestionForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formMethods = useForm<CreateMainQuestionSchema>({
    resolver: zodResolver(createMainQuestionSchema),
  })
  const { register, handleSubmit, formState, control } = formMethods;


  const createMainQuestion = useMutation({
    mutationFn: async (data: CreateMainQuestionSchema) => {
      const formData = new FormData();

      const titleImage = data.images;
      const alternativeImages = data.alternatives
        .flatMap((alternative: z.infer<typeof alternativeSchema>) => alternative.images);
      const totalImages = titleImage.concat(alternativeImages);
      totalImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      const createAlternatives = data.alternatives.map((alternative) => {
        const createAlternative: CreateAlternative = {
          description: alternative.description,
          questionAnswer: alternative.questionAnswer
        }
        return createAlternative
      })

      const createMainQuestion: CreateQuestion = {
        title: data.title,
        level: data.level,
        alternatives: createAlternatives
      };
      
      formData.append("mainQuestionInputDto", JSON.stringify(createMainQuestion));

      const response = await fetch('http://localhost:8080/main-question',
        {
          method: 'POST',
          body: formData,
        })

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ['get-subjects'],
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

      if (response.status === 400) {
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

  async function handleCreateSubject(data: CreateMainQuestionSchema) {
    await createMainQuestion.mutateAsync(data)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleCreateSubject)} className="w-[90%] m-auto space-y-6">
        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="enunciado">Enunciado</label>
          <textarea 
            {...register('title')}
            id="enunciado" 
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.title ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.title ? formState.errors.title.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="images">Imagem do enunciado</label>
          <input 
            {...register('images')}
            id="images" 
            type="file" 
            multiple
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p className={`text-sm ${formState.errors?.images ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.images ? formState.errors.images.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">Nível da questão</label>
          <Select />
          <p className={`text-sm ${formState.errors?.level ? 'text-red-400' : 'text-transparent'}`}>
            {formState.errors?.level ? formState.errors.level.message : '\u00A0'}
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-lg font-medium">
            Alternativas
          </span>
        </div>
        <div>
          {[...Array(5)].map((_, index) => (
            <AlternativeForm key={index} index={index} control={control} errors={formState.errors} />
          ))}
        </div>



        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => navigate("/main-questions")}
          >
            <X className="size-3" />
            Cancel
          </Button>
          <Button
            disabled={formState.isSubmitting}
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}