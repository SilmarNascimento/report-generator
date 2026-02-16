import { cn } from "@/lib/utils";

type ErrorTextProps = {
  message?: string;
  hidden?: boolean;
  disabled?: boolean;
  className?: string;
};

export function ErrorText({
  message,
  hidden = false,
  disabled = false,
  className,
}: Readonly<ErrorTextProps>) {
  const hasMessage = Boolean(message);

  if (hidden) return null;

  return (
    <p
      className={cn(
        "min-h-5 text-xs leading-5",
        hasMessage ? "text-destructive" : "invisible",
        { "opacity-80": disabled },
        className,
      )}
      role={hasMessage ? "alert" : undefined}
    >
      {hasMessage ? message : "\u00A0"}
    </p>
  );
}
