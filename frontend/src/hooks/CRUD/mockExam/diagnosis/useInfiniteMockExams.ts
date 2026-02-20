import { mockExamService } from "@/service/mockExamService";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteMockExams() {
  return useInfiniteQuery({
    queryKey: ["mock-exams"],
    queryFn: ({ pageParam = 0 }) => mockExamService.getPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.pages - 1
        ? lastPage.currentPage + 1
        : undefined,
    refetchOnWindowFocus: false,
  });
}
