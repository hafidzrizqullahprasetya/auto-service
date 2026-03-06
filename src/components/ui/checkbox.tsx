import { CheckIcon, XIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId } from "react";

type PropsType = {
  withIcon?: "check" | "x";
  withBg?: boolean;
  label: string;
  name?: string;
  minimal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  radius?: "default" | "md";
  className?: string;
};

export function Checkbox({
  withIcon,
  label,
  name,
  withBg,
  minimal,
  onChange,
  radius,
  className,
}: PropsType) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none items-center",
          !minimal && "text-body-sm font-medium",
          className
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            onChange={onChange}
            name={name}
            id={id}
            className="peer sr-only"
          />

          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded border-2 border-dark-5 peer-checked:border-dark dark:border-dark-6 peer-checked:[&>*]:block transition-none",
              withBg
                ? "peer-checked:bg-dark [&>*]:text-white"
                : "peer-checked:bg-gray-1 dark:peer-checked:bg-dark-3",
              minimal && "mr-3 border-stroke dark:border-dark-3",
              radius === "md" && "rounded-lg",
            )}
          >
            {!withIcon && (
              <span className="hidden size-2.5 rounded-sm bg-dark dark:bg-white" />
            )}

            {withIcon === "check" && (
              <CheckIcon className="hidden text-dark dark:text-white" />
            )}

            {withIcon === "x" && <XIcon className="hidden text-dark dark:text-white" />}
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}
