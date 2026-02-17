import { z } from "zod";
import { Button } from "../ui/shadcn/button";
import { adaptedQuestionSchema } from "./adaptedQuestionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { alternativeSchema } from "../alternative/AlternativeSchema";
import { CreateAlternative } from "../../interfaces/Alternative";
import { SelectLevel } from "../ui/selectLevel";
import { AlternativeForm } from "../alternative/alternativesForm";
import { Check, Loader2, X } from "lucide-react";
import { successAlert, warningAlert } from "../../utils/toastAlerts";

type CreateAdaptedQuestionForm = z.infer<typeof adaptedQuestionSchema>;

export function CreateAdaptedQuestionForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mainQuestionId } = useParams<{ mainQuestionId: string }>() ?? "";

  const formMethods = useForm<CreateAdaptedQuestionForm>({
    resolver: zodResolver(adaptedQuestionSchema),
  });
  const { register, handleSubmit, formState } = formMethods;

  const createAdaptedQuestion = useMutation({
    mutationFn: async (data: CreateAdaptedQuestionForm) => {
      const formData = new FormData();
      let titleImage: File[] = [];
      const alternativeImages: File[] = [];

      if (data.images) {
        titleImage = Array.from(data?.images).filter(
          (file): file is File => file !== undefined,
        );
      }

      const alternatives: z.infer<typeof alternativeSchema>[] =
        data.alternatives;
      for (const alternative of alternatives) {
        if (alternative.images) {
          const files = Array.from(alternative.images).filter(
            (file): file is File => file !== undefined,
          );
          alternativeImages.push(...files);
        }
      }

      const totalImages = titleImage.concat(alternativeImages);
      totalImages.forEach((file) => {
        formData.append("images", file);
      });

      const createAlternatives = data.alternatives.map((alternative, index) => {
        const createAlternative: CreateAlternative = {
          description: alternative.description,
          questionAnswer: Number(data.questionAnswer) === index,
        };
        return createAlternative;
      });
      const createAdaptedQuestion = {
        title: data.title,
        level: data.level,
        alternatives: createAlternatives,
      };
      const json = JSON.stringify(createAdaptedQuestion);
      const blob = new Blob([json], {
        type: "application/json",
      });

      formData.append("adaptedQuestionInputDto", blob);

      const response = await fetch(
        `http://localhost:8080/main-question/${mainQuestionId}/adapted-question`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ["get-adapted-questions"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-main-questions"],
        });
        successAlert("Questão adaptada salva com sucesso!");
        navigate(`/main-questions/${mainQuestionId}/adapted-questions`);
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  async function handleCreateAdaptedQuestion(data: CreateAdaptedQuestionForm) {
    await createAdaptedQuestion.mutateAsync(data);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleCreateAdaptedQuestion)}
        encType="multipart/form-data"
        className="w-[90%] m-auto space-y-6"
      >
        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="enunciado">
            Enunciado
          </label>
          <textarea
            {...register("title")}
            id="enunciado"
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p
            className={`text-sm ${formState.errors?.title ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.title
              ? formState.errors.title.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="images">
            Escolha imagens para o enunciado
          </label>
          <input
            {...register("images")}
            id="images"
            type="file"
            multiple
            hidden
            accept="image/*,.pdf"
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p
            className={`text-sm ${formState.errors?.images ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.images
              ? formState.errors.images.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">
            Nível da questão
          </label>
          <SelectLevel />
          <p
            className={`text-sm ${formState.errors?.level ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.level
              ? formState.errors.level.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-lg font-medium">Alternativas</span>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <AlternativeForm
              key={index}
              index={index}
              errors={formState.errors}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={
              formState.isSubmitting ||
              !Object.keys(formState.dirtyFields).length
            }
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            {formState.isSubmitting ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Check className="size-3" />
            )}
            Save
          </Button>
          <Button onClick={() => navigate("/main-questions")}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
