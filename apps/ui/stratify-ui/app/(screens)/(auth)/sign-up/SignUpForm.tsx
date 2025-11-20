import { useAppForm } from "@/app/components/Form/useForm";
import { useAuthClient } from "@/lib/auth/auth";
import { getAuthErrorMessage } from "@/lib/auth/authErrorCodes";
import { storeAuthToken } from "@/lib/auth/store-auth-token";
import { formOptions } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
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
    const [isUsernameAlreadyTaken, setIsUsernameAlreadyTaken] = useState(false);
    const [isEmailAlreadyTaken, setIsEmailAlreadyTaken] = useState(false);

    const resetSubmitState = () => {
        setIsSubmitDisabled(true);
        setIsSubmitProcessing(false);
    };

    const resetAlreadyTakenStates = () => {
        setIsUsernameAlreadyTaken(false);
        setIsEmailAlreadyTaken(false);
    };

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
        onSubmit: async ({ value }) => {
            setIsSubmitProcessing(true);
            resetAlreadyTakenStates();

            const username = await authClient.isUsernameAvailable(
                {
                    username: value.username,
                },
                {
                    onError: async () => {
                        toast.error(
                            "Failed to check username availability. Please try again.",
                        );
                        resetSubmitState();
                    },
                },
            );

            if (username.data?.available) {
                const { error } = await authClient.signUp.email(
                    {
                        email: value.email,
                        name: `${value.firstName} ${value.lastName}`,
                        password: value.password,
                        username: value.username,
                    },
                    {
                        onSuccess: async (ctx) => {
                            const authToken =
                                ctx.response.headers.get("set-auth-token");

                            if (authToken) {
                                await storeAuthToken(authToken);
                            }

                            toast.success("Account created successfully!");
                            push("/");
                        },
                    },
                );

                resetSubmitState();

                if (error?.code) {
                    // TODO: use ErrorCode type once all error codes are mapped
                    const errorCode = error.code as string;

                    const errorMessage = getAuthErrorMessage(errorCode);

                    // Show specific error message in toast if available
                    if (errorMessage) {
                        return toast.error(errorMessage);
                    }

                    //? Workaround as error code is not in the error types returned by the auth client
                    if (errorCode == "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
                        return setIsEmailAlreadyTaken(true);
                    } else {
                        form.reset(); // Reset the form on unexpected error
                        return toast.error("Sign up failed. Please try again.");
                    }
                }
            } else {
                setIsUsernameAlreadyTaken(true);
                setIsSubmitProcessing(false);
            }
        },
        onSubmitInvalid: () => {
            toast.error("Sign up failed. Please check the form for errors.");
            resetSubmitState();
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
                                className={`flex flex-col ${isUsernameAlreadyTaken ? "gap-y-1" : ""}`}
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
