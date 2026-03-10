import { cn } from "@/lib/utils";
import React, { type HTMLInputTypeAttribute, useId, forwardRef } from "react";

export type InputGroupProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  fileStyleVariant?: "style1" | "style2";
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  height?: "sm" | "default";
  defaultValue?: string;
  error?: string;
};

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      className,
      label,
      type = "text",
      placeholder,
      required,
      disabled,
      active,
      handleChange,
      icon,
      leftIcon,
      rightIcon,
      error,
      ...props
    },
    ref,
  ) => {
    const id = useId();

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold text-dark-5 dark:text-dark-6"
          >
            {label}
            {required && <span className="ml-1 select-none text-red">*</span>}
          </label>
        )}

        <div className="relative mt-2.5">
          <input
            id={id}
            ref={ref}
            type={type}
            name={props.name}
            placeholder={placeholder}
            onChange={handleChange || props.onChange}
            value={props.value}
            defaultValue={props.defaultValue}
            className={cn(
              "w-full rounded-lg border-2 border-stroke bg-white outline-none transition-none focus:border-dark disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-dark dark:border-dark-3 dark:bg-dark-2 dark:focus:border-white dark:disabled:bg-dark dark:data-[active=true]:border-white",
              error && "!border-red-500 focus:!border-red-500", // Merah saat error
              type === "file" && props.fileStyleVariant
                ? getFileStyles(props.fileStyleVariant)
                : "px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white",
              (props.iconPosition === "left" || leftIcon) && "pl-12.5",
              (props.iconPosition === "right" || icon || rightIcon) && "pr-12.5",
              props.height === "sm" && "py-2.5",
            )}
            required={required}
            disabled={disabled}
            data-active={active}
            {...props}
          />

          {/* Legacy Icon Support */}
          {icon && !leftIcon && !rightIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                props.iconPosition === "left" ? "left-4.5" : "right-4.5",
              )}
            >
              {icon}
            </div>
          )}

          {/* New Left Icon */}
          {leftIcon && (
            <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-dark-5 dark:text-dark-6">
              {leftIcon}
            </div>
          )}

          {/* New Right Icon */}
          {rightIcon && (
            <div className="absolute right-4.5 top-1/2 -translate-y-1/2 text-dark-5 dark:text-dark-6">
              {rightIcon}
            </div>
          )}
        </div>
        {/* Pesan Error */}
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";

export default InputGroup;

function getFileStyles(variant: "style1" | "style2") {
  switch (variant) {
    case "style1":
      return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white`;
    default:
      return `file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 file:focus:border-primary dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white px-3 py-[9px]`;
  }
}
