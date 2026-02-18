import { useFieldContext } from "./useForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "../ui/input-group";

interface CurrencyInputProps {
    label: string;
    id: string;
    currencyCode: string;
    placeholder?: string;
    error?: string;
    className?: string;
    inputClassName?: string;
}

const CurrencyInput = ({
    label,
    id,
    currencyCode,
    placeholder,
    error,
    className,
    inputClassName,
}: CurrencyInputProps) => {
    const field = useFieldContext<string>();

    return (
        <Field className={`flex flex-col gap-y-1.5 ${className}`}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    placeholder={placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={
                        error
                            ? "border-negative-base focus-visible:border-negative-base focus-visible:ring-negative-base"
                            : inputClassName
                    }
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupText>{currencyCode}</InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default CurrencyInput;
