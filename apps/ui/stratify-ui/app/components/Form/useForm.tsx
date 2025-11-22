import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";
import CheckboxInput from "./CheckboxInput";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
    createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextInput,
        CheckboxInput,
    },
    formComponents: {
        SubmitButton,
    },
});
