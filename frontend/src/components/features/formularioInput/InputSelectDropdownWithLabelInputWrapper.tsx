import { DropdownType, FormTypes } from "@/types/general";
import { Control, FieldErrors, FieldPath } from "react-hook-form";
import EntidadeLabel from "../EntidadeLabel";
import { InputSelectDropdownWrapper } from "./InputSelectDropdownWrapper";

type InputBadgeDropdownWrapperProps<
  T extends FormTypes,
  OpcoesType extends DropdownType,
> = {
  name: FieldPath<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  label: string;
  modo: "criacao" | "edicao" | "visualizacao" | "filtro";
  placeholder?: string;
  queryValue: string;
  onQueryChange: (query: string) => void;
  options: OpcoesType[];
  onChange?: (value: OpcoesType) => void;
  defaultValue?: string;
  disabled?: boolean;
};

export function InputSelectDropdownWithLabelWrapper<
  T extends FormTypes,
  OpcoesType extends DropdownType,
>({
  name,
  control,
  errors,
  label,
  modo,
  placeholder,
  queryValue,
  onQueryChange,
  onChange,
  options,
  defaultValue,
  disabled = false,
}: Readonly<InputBadgeDropdownWrapperProps<T, OpcoesType>>) {
  return modo !== "criacao" ? (
    <EntidadeLabel entidade={label} nomeEntidade={defaultValue} />
  ) : (
    <InputSelectDropdownWrapper<T, OpcoesType>
      name={name}
      control={control}
      errors={errors}
      label={`${label} *`}
      placeholder={placeholder}
      queryValue={queryValue}
      onQueryChange={onQueryChange}
      options={options}
      defaultValue={defaultValue}
      handleChange={onChange}
      disabled={disabled}
    />
  );
}
