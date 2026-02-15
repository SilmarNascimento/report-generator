import { useForm } from "react-hook-form";
import { StudentFormType, studentSchema } from "./studentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import SessaoBotoesFormulario from "@/components/shared/SessaoBotoesFormulario";
import { InputTextWrapper } from "@/components/features/form-input/InputTextWrapper";
import { InputSelectDropdownWrapper } from "@/components/features/form-input/InputSelectDropdownWrapper";
import { InputNumberWrapper } from "@/components/features/form-input/InputNumberWrapper";
import { InputMultiSelectWrapper } from "@/components/features/form-input/InputMultiSelectWrapper";
import { classGroupBadgeOptions } from "@/constants/students";
import { brStatesOptions } from "@/constants/general";
import { DiagnosisList } from "@/components/features/DiagnosisList";
import { YearlyResponse } from "@/interfaces/Student";

type StudentFormProps = {
  titulo: string;
  modo: "criacao" | "edicao" | "view";
  defaultValues?: StudentFormType;
  responses?: YearlyResponse[];
  handleSubmitRequest?: (data: StudentFormType) => Promise<void>;
};

const StudentForm = ({
  titulo,
  modo,
  defaultValues,
  handleSubmitRequest,
  responses,
}: StudentFormProps) => {
  const isReadOnly = modo === "view";

  const memoizedDefaultValues = useMemo(() => {
    return defaultValues
      ? studentSchema.parse(defaultValues)
      : {
          name: "",
          email: "",
          cpf: "",
          enrollmentYear: undefined,
          classGroup: undefined,
          activationDate: "",
          photoUrl: "",
          address: {
            street: "",
            number: undefined,
            complement: "",
            neighborhood: "",
            city: "",
            state: undefined,
            zipCode: "",
          },
        };
  }, [defaultValues]);

  const { control, handleSubmit, formState } = useForm<StudentFormType>({
    resolver: zodResolver(studentSchema),
    defaultValues: memoizedDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { errors, isDirty } = formState;

  return (
    <form
      onSubmit={
        handleSubmitRequest
          ? handleSubmit(handleSubmitRequest)
          : (event) => event.preventDefault()
      }
      className="flex min-h-[calc(100vh-360px)] flex-col justify-between gap-[22px] rounded-2xl px-6 py-8"
    >
      <section className="">
        <div>
          <h1
            className={`mb-4 text-lg leading-[1.4] font-bold tracking-[-0.25px] text-[#2C2E34]`}
          >
            {titulo}
          </h1>
        </div>

        <section className="flex flex-col gap-2">
          <div className="flex w-full flex-col xl:max-w-85">
            <InputTextWrapper
              name="name"
              control={control}
              errors={errors}
              label="Descrição do motivo*"
              placeholder="Digite o motivo de bloqueio"
              isReadOnly={isReadOnly}
            />
          </div>

          <div className="flex w-full flex-col xl:max-w-85">
            <InputTextWrapper
              name="email"
              control={control}
              errors={errors}
              label="Descrição do motivo*"
              placeholder="Digite o motivo de bloqueio"
              isReadOnly={isReadOnly}
            />
          </div>

          <div className="flex w-full flex-col xl:max-w-85">
            <InputTextWrapper
              name="cpf"
              control={control}
              errors={errors}
              label="Descrição do motivo*"
              placeholder="Digite o motivo de bloqueio"
              format="cpf"
              isReadOnly={isReadOnly}
            />
          </div>

          <div className="flex w-full flex-col xl:max-w-85">
            <InputNumberWrapper
              name="enrollmentYear"
              control={control}
              errors={errors}
              label="Descrição do motivo*"
              placeholder="Digite o motivo de bloqueio"
              isReadOnly={isReadOnly}
            />
          </div>

          <div className="flex w-full flex-col xl:max-w-85">
            <InputMultiSelectWrapper
              name="classGroup"
              control={control}
              label="Órgãos"
              placeholder="Todos"
              options={classGroupBadgeOptions}
              showBadges
            />
          </div>

          <div className="flex w-full flex-col xl:max-w-85">
            <InputTextWrapper
              name="photoUrl"
              control={control}
              errors={errors}
              label="Descrição do motivo*"
              placeholder="Digite o motivo de bloqueio"
              format="cpf"
              isReadOnly={isReadOnly}
            />
          </div>

          <div>
            <div className="flex flex-row gap-6">
              <div className="flex w-full flex-col xl:max-w-85">
                <InputTextWrapper
                  name="address.street"
                  control={control}
                  errors={errors}
                  label="Rua"
                  placeholder="Digite o nome da rua"
                  format="cpf"
                  isReadOnly={isReadOnly}
                />
              </div>

              <div className="flex w-full flex-col xl:max-w-85">
                <InputNumberWrapper
                  name="address.number"
                  control={control}
                  errors={errors}
                  label="Número"
                  placeholder="Digite o número"
                  isReadOnly={isReadOnly}
                  allowNegative={false}
                />
              </div>
            </div>

            <div className="flex w-full flex-col xl:max-w-85">
              <InputTextWrapper
                name="address.complement"
                control={control}
                errors={errors}
                label="Complemento"
                placeholder="Digite o complemento"
                isReadOnly={isReadOnly}
              />
            </div>

            <div className="flex w-full flex-col xl:max-w-85">
              <InputTextWrapper
                name="address.neighborhood"
                control={control}
                errors={errors}
                label="Bairro"
                placeholder="Digite o bairro"
                isReadOnly={isReadOnly}
              />
            </div>

            <div className="flex w-full flex-col xl:max-w-85">
              <InputTextWrapper
                name="address.city"
                control={control}
                errors={errors}
                label="Cidade"
                placeholder="Digite a cidade"
                isReadOnly={isReadOnly}
              />
            </div>

            <div className="flex w-full flex-col xl:max-w-85">
              <InputSelectDropdownWrapper
                name="address.state"
                control={control}
                errors={errors}
                label="Estado"
                placeholder="Digite o estado"
                options={brStatesOptions}
                isReadOnly={isReadOnly}
              />
            </div>

            <div className="flex w-full flex-col xl:max-w-85">
              <InputTextWrapper
                name="address.zipCode"
                control={control}
                errors={errors}
                label="CEP"
                placeholder="Digite o CEP"
                isReadOnly={isReadOnly}
              />
            </div>
          </div>
        </section>
      </section>

      {modo === "view" && responses && (
        <section>
          <DiagnosisList responses={responses} />
        </section>
      )}

      <SessaoBotoesFormulario
        modo={modo}
        listagemEndpoint="/students"
        isDirty={isDirty}
      />
    </form>
  );
};

export default StudentForm;
