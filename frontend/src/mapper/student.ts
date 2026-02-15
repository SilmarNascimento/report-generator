import { StudentFormType } from "@/components/forms/student/studentSchema";
import { classGroupLabelMap } from "@/constants/students";
import { StudentRequest, StudentResponse } from "@/interfaces/Student";

export const mapStudentFormToRequest = (
  data: StudentFormType,
): StudentRequest => {
  return {
    ...data,
    classGroup: data.classGroup.map((item) => item.value),
    activationDate: new Date().toISOString(),
    address: data.address
      ? {
          ...data.address,
          number: data.address.number || undefined,
        }
      : undefined,
  };
};

export const mapStudentResponseToForm = (
  data: StudentResponse,
): StudentFormType => {
  return {
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    enrollmentYear: data.enrollmentYear,
    classGroup: data.classGroup.map((enumValue) => ({
      value: enumValue,
      dropdownLabel: classGroupLabelMap[enumValue],
      displayLabel: classGroupLabelMap[enumValue],
    })),
    photoUrl: data.photoUrl,
    address: data.address
      ? {
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
        }
      : undefined,
  };
};
