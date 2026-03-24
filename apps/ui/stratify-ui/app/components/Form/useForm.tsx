import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";
import CheckboxInput from "./CheckboxInput";
import DatePickerInput from "./DatepickerInput";
import CurrencyInput from "./CurrencyInput";
import NumberInput from "./NumberInput";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
    createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextInput,
        NumberInput,
        CheckboxInput,
        DatePickerInput,
        CurrencyInput,
    },
    formComponents: {
        SubmitButton,
    },
});
