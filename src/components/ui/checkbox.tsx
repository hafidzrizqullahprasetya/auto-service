import { CheckIcon, XIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import React, { useId, forwardRef } from "react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  withIcon?: "check" | "x";
  withBg?: boolean;
  label: string;
  minimal?: boolean;
  radius?: "default" | "md";
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      withIcon,
      label,
      name,
      withBg,
      minimal,
      onChange,
      radius,
      className,
      ...props
    },
    ref,
  ) => {
    const id = useId();

    return (
      <div>
        <label
          htmlFor={id}
          className={cn(
            "flex select-none items-center",
            props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            !minimal && "text-body-sm font-medium",
            className
          )}
        >
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              onChange={onChange}
              name={name}
              id={id}
              className="peer sr-only"
              {...props}
            />

            <div
              className={cn(
                "mr-2 flex size-5 items-center justify-center rounded border-2 border-dark-5 peer-checked:border-dark dark:border-dark-6 peer-checked:[&>*]:block transition-none",
                withBg
                  ? "peer-checked:bg-dark [&>*]:text-white"
                  : "peer-checked:bg-gray-1 dark:peer-checked:bg-dark-3",
                minimal && "mr-3 border-stroke dark:border-dark-3",
                radius === "md" && "rounded-lg",
                props.disabled && "cursor-not-allowed bg-gray-2 border-gray-3 dark:bg-dark-3 dark:border-dark-4 opacity-70"
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
  },
);

Checkbox.displayName = "Checkbox";
