import { useAppForm } from "@/app/components/Form/useForm";
import { useAuthClient } from "@/lib/auth/auth";
import { formOptions } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signUpSchema } from "./sign-up-schema";
import { handleSignUp } from "./handle-sign-up";
import { Field, FieldLabel } from "@/app/components/ui/field";
import { Currency, useCurrencyList } from "./useCurrencyList";
import {
    Command,
    CommandInput,
    CommandList,
} from "@/app/components/ui/command";
import { Skeleton } from "@/app/components/ui/skeleton";

const signUpFormOptions = formOptions({
    formId: "sign-up-form",
    defaultValues: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        currency: "",
    },
});

const SignUpForm = () => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isUsernameAlreadyTaken, setIsUsernameAlreadyTaken] = useState(false);
    const [isEmailAlreadyTaken, setIsEmailAlreadyTaken] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        null,
    );
    const [currencySearch, setCurrencySearch] = useState("");
    const [isCurrencyListOpen, setIsCurrencyListOpen] = useState(false);

    const { data, isLoading } = useCurrencyList();

    const authClient = useAuthClient();
    const { push } = useRouter();

    const form = useAppForm({
        validators: {
            onChange: signUpSchema,
            onBlurAsync: async ({ value }) => {
                const errors = signUpSchema.safeParse(value);

                if (!errors.success) {
                    setIsSubmitDisabled(true);
                    return errors;
                }
                setIsSubmitDisabled(false);
            },
        },
        onSubmit: async ({ value }) =>
            await handleSignUp(
                value,
                authClient,
                push,
                setIsUsernameAlreadyTaken,
                setIsEmailAlreadyTaken,
                setIsSubmitDisabled,
                () => form.reset(),
            ),
        onSubmitInvalid: () => {
            toast.error("Sign up failed. Please check the form for errors.");
            setIsSubmitDisabled(true);
        },
        ...signUpFormOptions,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="flex flex-col px-20 gap-y-6"
        >
            <div className="flex flex-row gap-x-8">
                <form.AppField name="firstName">
                    {({ state: { meta }, TextInput }) => (
                        <TextInput
                            id="firstName"
                            label="First name"
                            placeholder="John"
                            error={
                                meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined
                            }
                        />
                    )}
                </form.AppField>
                <form.AppField name="lastName">
                    {({ state: { meta }, TextInput }) => (
                        <TextInput
                            id="lastName"
                            label="Last name"
                            placeholder="Doe"
                            error={
                                meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined
                            }
                        />
                    )}
                </form.AppField>
            </div>
            <div className="flex flex-row gap-x-8">
                <form.AppField
                    name="username"
                    validators={{
                        onChange: () => {
                            // Hide the error when the input changes
                            setIsUsernameAlreadyTaken(false);
                        },
                    }}
                >
                    {({ state: { meta }, TextInput }) => {
                        const validationError = meta.isTouched
                            ? meta.errors?.[0]?.message
                            : undefined;

                        const usernameError = isUsernameAlreadyTaken
                            ? "Username is not available. Please choose another one."
                            : validationError;

                        return (
                            <div
                                className={`flex flex-col w-1/2 ${isUsernameAlreadyTaken ? "gap-y-1" : ""}`}
                            >
                                <TextInput
                                    id="username"
                                    label="Username"
                                    placeholder="johndoe"
                                    error={usernameError}
                                />
                            </div>
                        );
                    }}
                </form.AppField>
                <form.AppField name="currency">
                    {(field) => {
                        const displayValue = selectedCurrency
                            ? `${selectedCurrency.name} (${selectedCurrency.code})`
                            : "";

                        const filteredData = data.filter(
                            (currency) =>
                                currency.name
                                    .toLowerCase()
                                    .includes(currencySearch.toLowerCase()) ||
                                currency.code
                                    .toLowerCase()
                                    .includes(currencySearch.toLowerCase()),
                        );

                        return (
                            <Field className="flex flex-col gap-y-1.5 w-1/2">
                                <FieldLabel htmlFor="currency">
                                    Preferred Currency
                                </FieldLabel>
                                <Command>
                                    <CommandInput
                                        id="currency"
                                        placeholder="Select a currency"
                                        value={
                                            field.state.value
                                                ? displayValue
                                                : currencySearch
                                        }
                                        className="static bg-white border border-secondary-dark rounded-md focus-visible:ring-secondary-dark h-full"
                                        inputClassName="placeholder:text-secondary-light text-secondary-dark"
                                        showIcon={false}
                                        onValueChange={(searchValue) =>
                                            setCurrencySearch(searchValue)
                                        }
                                        onFocus={() =>
                                            setIsCurrencyListOpen(true)
                                        }
                                        showClearButton={
                                            selectedCurrency !== null
                                        }
                                        onClear={() => {
                                            field.handleChange("");
                                            setSelectedCurrency(null);
                                            setCurrencySearch("");
                                        }}
                                    />
                                    <CommandList
                                        className={`absolute w-auto mt-11 p-1 gap-y-1.5 max-h-37.5 bg-white border border-secondary-dark rounded-md ${isCurrencyListOpen ? "" : "hidden"}`}
                                    >
                                        {isLoading ? (
                                            <div className="flex flex-col gap-2">
                                                {Array.from({
                                                    length: 3,
                                                }).map((_, index) => (
                                                    <Skeleton
                                                        key={index}
                                                        className="w-full h-10 rounded-xl bg-secondary-lighter"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-y-1 w-full">
                                                {filteredData.length > 0 ? (
                                                    filteredData.map(
                                                        (currency) => (
                                                            <div
                                                                key={
                                                                    currency.code
                                                                }
                                                                className="flex items-center font-sans text-secondary-dark rounded-md cursor-pointer hover:bg-secondary-lighter"
                                                                onClick={() => {
                                                                    field.handleChange(
                                                                        currency.code,
                                                                    );

                                                                    setSelectedCurrency(
                                                                        currency,
                                                                    );

                                                                    setIsCurrencyListOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                {currency.name}{" "}
                                                                ({currency.code}
                                                                )
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="items-center font-sans text-secondary-dark rounded-md">
                                                        No currencies found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CommandList>
                                </Command>
                            </Field>
                        );
                    }}
                </form.AppField>
            </div>
            <div className="flex flex-col gap-y-6 w-full">
                <form.AppField
                    name="email"
                    validators={{
                        onChange: () => {
                            // Hide the error when the input changes
                            setIsEmailAlreadyTaken(false);
                        },
                    }}
                >
                    {({ state: { meta }, TextInput }) => {
                        const validationError = meta.isTouched
                            ? meta.errors?.[0]?.message
                            : undefined;

                        const emailError = isEmailAlreadyTaken
                            ? "An account with this email already exists. Please use another email."
                            : validationError;

                        return (
                            <TextInput
                                id="email"
                                label="Email address"
                                type="email"
                                placeholder="john.doe@example.com"
                                error={emailError}
                            />
                        );
                    }}
                </form.AppField>
                <form.AppField name="password">
                    {({ state: { meta }, TextInput }) => (
                        <TextInput
                            id="password"
                            label="Password"
                            type="password"
                            error={
                                meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined
                            }
                        />
                    )}
                </form.AppField>
                <form.AppField
                    name="confirmPassword"
                    validators={{
                        // Listen to changes in the password field to re-validate confirmPassword
                        onChangeListenTo: ["password"],
                    }}
                >
                    {({ state: { meta }, TextInput }) => (
                        <TextInput
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            error={
                                meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined
                            }
                        />
                    )}
                </form.AppField>
                <form.AppForm>
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                        ]}
                    >
                        <form.SubmitButton
                            label="Sign Up"
                            isDisabled={
                                !form.state.canSubmit || isSubmitDisabled
                            }
                            isLoading={form.state.isSubmitting}
                        />
                    </form.Subscribe>
                </form.AppForm>
            </div>
        </form>
    );
};

export default SignUpForm;
