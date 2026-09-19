import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import CheckboxInput from "./CheckboxInput";
import CurrencyInput from "./CurrencyInput";
import DatePickerInput from "./DatepickerInput";
import NumberInput from "./NumberInput";
import SubmitButton from "./SubmitButton";
import TextInput from "./TextInput";

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
