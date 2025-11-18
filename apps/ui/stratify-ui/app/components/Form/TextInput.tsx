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
}

const TextInput = ({
    label,
    id,
    placeholder,
    type = "text",
    error,
}: FormInputProps) => {
    const field = useFieldContext<string>();

    return (
        <Field className="flex flex-col gap-y-1.5">
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                type={type}
                id={id}
                placeholder={placeholder}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default TextInput;
