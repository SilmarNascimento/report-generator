import { FieldErrors, FieldPath } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ErrorText } from "../ErrorText";
import { FormTypes } from "@/interfaces/general";
import { obterValorAninhadoComArray } from "@/utils/errorParser";
import { Label } from "@/components/ui/shadcn/Label";
import { DragDropFileUploader } from "@/components/ui/drag-drop/DragDropFile";
import { DragDropPreviewFileUploader } from "@/components/ui/drag-drop/DragDropPreviewFile";

type BaseProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  errors?: FieldErrors<T>;
  label?: string;
  labelClassName?: string;
  noErrorMsg?: boolean;
}>;

type FileVariant = {
  variant: "file";
};

type PreviewVariant = {
  variant: "preview";
  message: string;
  url?: string;
  alwaysShowDropZone?: boolean;
  fullHeight?: boolean;
  accept?: string;
};

type InputDragDropWrapperProps<T extends FormTypes> = BaseProps<T> &
  (FileVariant | PreviewVariant);

export function InputDragDropWrapper<T extends FormTypes>(
  props: InputDragDropWrapperProps<T>,
) {
  const { name, errors, label, labelClassName, noErrorMsg = false } = props;

  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";

  return (
    <>
      {label && (
        <Label
          className={cn(
            "text-sm leading-normal font-medium text-foreground",
            "mb-2 flex items-center gap-2",
            labelClassName,
          )}
        >
          {label}
        </Label>
      )}
      {props.variant === "file" ? (
        <DragDropFileUploader formVariable={String(name)} />
      ) : (
        <DragDropPreviewFileUploader
          formVariable={String(name)}
          message={props.message}
          url={props.url}
          alwaysShowDropZone={props.alwaysShowDropZone}
          fullHeight={props.fullHeight}
          accept={props.accept}
        />
      )}
      <ErrorText message={errorMessage} hidden={noErrorMsg} />
    </>
  );
}
