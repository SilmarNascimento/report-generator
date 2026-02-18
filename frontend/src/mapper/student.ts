import { StudentFormType } from "@/components/Forms/student/StudentSchema";
import { classGroupLabelMap } from "@/constants/students";
import { StudentRequest, StudentResponse } from "@/interfaces/Student";

export const mapStudentFormToRequest = (
  data: StudentFormType,
): StudentRequest => {
  const addressValues = data.address ? Object.values(data.address) : [];
  const hasAddressData = addressValues.some(
    (value) => value !== "" && value !== undefined && value !== null,
  );

  return {
    ...data,
    classGroups: data.classGroups.map((item) => item.value),
    activationDate: new Date().toISOString(),
    address: hasAddressData
      ? {
          ...data.address,
          number:
            data.address?.number !== undefined && data.address?.number !== null
              ? Number(data.address.number)
              : undefined,
          complement: data.address?.complement || undefined,
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
    classGroups: data.classGroups.map((enumValue) => ({
      value: enumValue,
      dropdownLabel: classGroupLabelMap[enumValue],
      displayLabel: classGroupLabelMap[enumValue],
    })),
    photoUrl: data.photoUrl,
    address: data.address
      ? {
          street: data.address.street,
          number: Number(data.address.number),
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
        }
      : undefined,
  };
};
