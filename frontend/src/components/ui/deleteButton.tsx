import { ComponentProps } from "react"
import { Button } from "./button"
import { X } from "lucide-react"

interface DeleteButtonProps extends ComponentProps<'button'> {}

export function DeleteButton(props: DeleteButtonProps) {
  return (
    <Button
      {...props}
      size="icon"
      className="mx-0.5"
    >
      <X className="size-3" color="red"/>
    </Button>
  )
}