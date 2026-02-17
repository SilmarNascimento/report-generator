import { StudentFormType } from "@/components/Forms/student/StudentSchema";
import { useHandleCreate } from "../useHandleCreate";
import { StudentRequest } from "@/interfaces/Student";
import { mapStudentFormToRequest } from "@/mapper/student";

export function useHandleCreateStudent() {
  return useHandleCreate<StudentFormType, StudentRequest>({
    endpoint: "/students",
    invalidateKeys: [["/students"]],
    successMessage: "Aluno cadastrado com sucesso!",
    navigateTo: "/students",
    mapFn: mapStudentFormToRequest,
  });
}
