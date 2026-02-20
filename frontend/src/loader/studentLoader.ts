import { STUDENT_QUERY_KEY } from "@/constants/students";
import { StudentResponse } from "@/interfaces/Student";
import apiService from "@/service/ApiService";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";

const fetchStudent = async (id: string): Promise<StudentResponse> => {
  return apiService.get<StudentResponse>(`/students/${id}`);
};

export const studentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: STUDENT_QUERY_KEY(id),
    queryFn: () => fetchStudent(id),
  });

export const editStudentLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;

    if (!id) throw new Error("ID do aluno é obrigatório.");

    const aluno = await queryClient.ensureQueryData(studentQueryOptions(id));

    return { aluno };
  };

export const viewStudentLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;

    if (!id) throw new Error("ID do aluno é obrigatório.");

    const aluno = await queryClient.ensureQueryData(studentQueryOptions(id));

    return { aluno };
  };
