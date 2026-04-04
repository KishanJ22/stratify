import { Input } from "@/app/components/ui/input";
import { HTMLInputTypeAttribute } from "react";
import { useFieldContext } from "./useForm";
import { Field, FieldError, FieldLabel } from "../ui/field";

export interface FormInputProps {
    label: string;
    id: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    error?: string;
    className?: string;
    inputClassName?: string;
    dataTestId?: string;
    disabled?: boolean;
    defaultValue?: string;
}

const TextInput = ({
    label,
    id,
    placeholder,
    error,
    className,
    inputClassName = "bg-white",
    dataTestId,
    disabled = false,
    defaultValue,
    type,
}: FormInputProps) => {
    const field = useFieldContext<string>();

    return (
        <Field
            className={`flex flex-col gap-y-1.5 ${className}`}
            data-testid={dataTestId}
        >
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                placeholder={placeholder}
                value={defaultValue ? defaultValue : field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={disabled}
                type={type}
                className={
                    error
                        ? "bg-white border-negative-base focus-visible:border-negative-base focus-visible:ring-negative-base"
                        : inputClassName
                }
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default TextInput;
