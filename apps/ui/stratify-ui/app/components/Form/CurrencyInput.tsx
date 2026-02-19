import { useFieldContext } from "./useForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "../ui/input-group";
import { Skeleton } from "../ui/skeleton";

interface CurrencyInputProps {
    label: string;
    id: string;
    currencyCode: string;
    placeholder?: string;
    error?: string;
    className?: string;
    inputClassName?: string;
    isLoading?: boolean;
}

const CurrencyInput = ({
    label,
    id,
    currencyCode,
    placeholder,
    error,
    className,
    inputClassName,
    isLoading,
}: CurrencyInputProps) => {
    const field = useFieldContext<string>();

    return (
        <Field className={`flex flex-col gap-y-1.5 ${className}`}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
                {isLoading ? (
                    <Skeleton className="h-6 w-full mx-2 bg-secondary-light rounded-md" />
                ) : (
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
                )}
                <InputGroupAddon align="inline-end">
                    <InputGroupText>{currencyCode}</InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default CurrencyInput;
