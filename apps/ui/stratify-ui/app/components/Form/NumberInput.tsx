import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { FormInputProps } from "./TextInput";
import { useFieldContext } from "./useForm";

const NumberInput = ({
    label,
    id,
    placeholder,
    error,
    className,
    inputClassName = "bg-white",
    dataTestId,
    disabled = false,
    defaultValue,
}: FormInputProps) => {
    const field = useFieldContext<number>();

    return (
        <Field
            className={`flex flex-col gap-y-1.5 ${className}`}
            data-testid={dataTestId}
        >
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                type="number"
                placeholder={placeholder}
                value={defaultValue ? defaultValue : field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                disabled={disabled}
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

export default NumberInput;
