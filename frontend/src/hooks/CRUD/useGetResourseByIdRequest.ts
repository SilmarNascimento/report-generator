import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import apiService from "@/service/ApiService";

export function useGetResourceByIdRequest<TResponse>(
  endpoint: string,
  id: string,
  options?: Omit<UseQueryOptions<TResponse>, "queryKey" | "queryFn">,
) {
  return useQuery<TResponse>({
    queryKey: [endpoint, id],
    queryFn: async () => apiService.get<TResponse>(`${endpoint}/${id}`),
    enabled: !!id,
    ...options,
  });
}
