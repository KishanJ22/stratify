import { useAppForm } from "@/app/components/Form/useForm";
import { formOptions } from "@tanstack/react-form";
import { useState } from "react";
import * as zod from "zod";

const signUpSchema = zod
    .object({
        firstName: zod.string().min(1, "First name should be set"),
        lastName: zod.string().min(1, "Last name should be set"),
        username: zod.string().min(1, "Username should be set"),
        email: zod.email({ error: "Email should be set" }),
        password: zod
            .string()
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: zod.string(),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

const signUpFormOptions = formOptions({
    formId: "sign-up-form",
    defaultValues: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
});

const SignUpForm = () => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

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
        onSubmit: ({ value }) => {
            console.log("Form submitted successfully with values:", value);
        },
        onSubmitInvalid: ({ value, formApi }) => {
            console.log("Form submission failed. Invalid values:", value);
            console.log("Errors:", formApi.getAllErrors());
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
            <div className="flex flex-col gap-y-6 w-full">
                <form.AppField name="username">
                    {({ state: { meta }, TextInput }) => (
                        <TextInput
                            id="username"
                            label="Username"
                            placeholder="johndoe"
                            error={
                                meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined
                            }
                        />
                    )}
                </form.AppField>
                <form.AppField name="email">
                    {({ state: { meta }, TextInput }) => (
                        <TextInput
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="john.doe@example.com"
                            error={
                                meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined
                            }
                        />
                    )}
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
                <form.AppField name="confirmPassword">
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
                    <form.SubmitButton
                        label="Sign Up"
                        isDisabled={isSubmitDisabled}
                    />
                </form.AppForm>
            </div>
        </form>
    );
};

export default SignUpForm;
