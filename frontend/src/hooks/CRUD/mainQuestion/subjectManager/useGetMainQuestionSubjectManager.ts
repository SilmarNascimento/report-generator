import { MainQuestion } from "@/interfaces";
import apiService from "@/service/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetMainQuestionSubjectManager(
  mainQuestionId: string | undefined,
  mainQuestionRef: React.MutableRefObject<MainQuestion | undefined>,
  subjectIdListRef: React.MutableRefObject<string[] | undefined>,
) {
  return useQuery({
    queryKey: ["get-main-question", mainQuestionId],
    queryFn: async () => {
      const data = await apiService.get<MainQuestion>(
        `/main-question/${mainQuestionId}`,
      );

      mainQuestionRef.current = data;
      subjectIdListRef.current = data.subjects.map((s) => s.id);

      return data;
    },
    enabled: !!mainQuestionId,
  });
}
