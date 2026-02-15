import { ComponentProps } from "react";
import { Button } from "./shadcn/button";
import { Pencil } from "lucide-react";

interface EditButtonProps extends ComponentProps<"button"> {}

export function EditButton(props: EditButtonProps) {
  return (
    <Button {...props} size="icon" className="mx-0.5">
      <Pencil className="size-3" color="green" />
    </Button>
  );
}
