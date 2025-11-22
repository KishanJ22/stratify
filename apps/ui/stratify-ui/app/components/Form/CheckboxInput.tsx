import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { useFieldContext } from "./useForm";

interface CheckboxInputProps {
    label: string;
    id: string;
    error?: string;
}

const CheckboxInput = ({ label, id, error }: CheckboxInputProps) => {
    const field = useFieldContext<boolean>();

    return (
        <Field orientation="horizontal">
            <Checkbox
                id={id}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
                onBlur={field.handleBlur}
                className={
                    error
                        ? "border-negative-base focus-visible:border-negative-base focus-visible:ring-negative-base"
                        : ""
                }
            />
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default CheckboxInput;
