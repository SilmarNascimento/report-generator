import { studentResponseService } from "@/service/studentResponseService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export function useGetStudentsResponseList(
  page: number,
  pageSize: number,
  query: string,
) {
  return useQuery({
    queryKey: ["get-responses", page, pageSize, query],
    queryFn: () =>
      studentResponseService.getPage({
        pageNumber: page - 1,
        pageSize,
        query,
      }),
    placeholderData: keepPreviousData,
  });
}
