import { useAppForm } from "@/app/components/Form/useForm";
import { storeAuthToken, useAuthClient } from "@/lib/auth";
import { formOptions } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import * as zod from "zod";

const signUpSchema = zod
    .object({
        firstName: zod.string().min(1, "First name should be set"),
        lastName: zod.string().min(1, "Last name should be set"),
        username: zod.string().min(1, "Username should be set"),
        email: zod.email({ error: "Email should be set" }),
        password: zod
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter",
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter",
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain at least one special character",
            ),
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
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isSubmitProcessing, setIsSubmitProcessing] = useState(false);
    const [isUsernameNotAvailable, setIsUsernameNotAvailable] = useState(false);

    const authClient = useAuthClient();

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
        onSubmit: async ({ value }) => {
            setIsSubmitProcessing(true);
            setIsUsernameNotAvailable(false);
            const username = await authClient.isUsernameAvailable({
                username: value.username,
            });

            if (username.data?.available) {
                await authClient.signUp.email(
                    {
                        email: value.email,
                        name: `${value.firstName} ${value.lastName}`,
                        password: value.password,
                        username: value.username,
                        callbackURL: window.location.origin,
                    },
                    {
                        onSuccess: async (ctx) => {
                            const authToken =
                                ctx.response.headers.get("set-auth-token");

                            if (authToken) {
                                await storeAuthToken(authToken);
                            }

                            toast.success("Account created successfully!");
                        },
                        onError: () => {
                            toast.error("Sign up failed. Please try again.");
                            form.reset(); // Reset the form on unexpected error
                        },
                    },
                );

                setIsSubmitProcessing(false);
                setIsSubmitDisabled(false);
            } else {
                setIsUsernameNotAvailable(true);
                setIsSubmitProcessing(false);
            }
        },
        onSubmitInvalid: () => {
            toast.error("Sign up failed. Please check the form for errors.");
            setIsSubmitProcessing(false);
            setIsSubmitDisabled(false);
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
                        <div
                            className={`flex flex-col ${isUsernameNotAvailable ? "gap-y-1" : ""}`}
                        >
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
                            {isUsernameNotAvailable && (
                                <p className="text-negative-base text-sm font-normal font-sans">
                                    Username is not available. Please choose
                                    another one.
                                </p>
                            )}
                        </div>
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
                        isLoading={isSubmitProcessing}
                    />
                </form.AppForm>
            </div>
        </form>
    );
};

export default SignUpForm;
