import { StudentFormType } from "@/components/forms/student/studentSchema";
import { useHandleEdit } from "../useHandleEdit";
import { StudentRequest } from "@/interfaces/Student";
import { mapStudentFormToRequest } from "@/mapper/student";

export function useHandleEditStudent(id: string) {
  return useHandleEdit<StudentFormType, StudentRequest>({
    id,
    endpoint: "/students",
    invalidateKeys: [["/students", id]],
    successMessage: "Cadastro de aluno alterado com sucesso!",
    navigateTo: "/students",
    mapFn: mapStudentFormToRequest,
  });
}
