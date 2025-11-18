import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
    createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextInput,
    },
    formComponents: {
        SubmitButton,
    },
});
