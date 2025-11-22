import { Input } from "@/app/components/ui/input";
import { HTMLInputTypeAttribute } from "react";
import { useFieldContext } from "./useForm";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface FormInputProps {
    label: string;
    id: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    error?: string;
    className?: string;
}

const TextInput = ({
    label,
    id,
    placeholder,
    type = "text",
    error,
    className,
}: FormInputProps) => {
    const field = useFieldContext<string>();

    return (
        <Field className={`flex flex-col gap-y-1.5 ${className}`}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                type={type}
                id={id}
                placeholder={placeholder}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={
                    error
                        ? "border-negative-base focus-visible:border-negative-base focus-visible:ring-negative-base"
                        : ""
                }
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default TextInput;
