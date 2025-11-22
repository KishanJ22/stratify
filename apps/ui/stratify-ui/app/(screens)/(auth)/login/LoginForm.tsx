import { useAppForm } from "@/app/components/Form/useForm";
import { useAuthClient } from "@/lib/auth/auth";
import { formOptions } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loginSchema } from "./login-schema";
import { handleLogin } from "./handle-login";

const loginFormOptions = formOptions({
    formId: "login-form",
    defaultValues: {
        emailOrUsername: "",
        password: "",
        rememberMe: false,
    },
});

const LoginForm = () => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const authClient = useAuthClient();
    const { push } = useRouter();

    const form = useAppForm({
        validators: {
            onChange: loginSchema,
            onBlurAsync: async ({ value }) => {
                const errors = loginSchema.safeParse(value);

                if (!errors.success) {
                    setIsSubmitDisabled(true);
                    return errors;
                }

                setIsSubmitDisabled(false);
            },
        },
        onSubmit: async ({ value }) =>
            await handleLogin(value, authClient, push),
        onSubmitInvalid: () => {
            toast.error("Login failed. Please check the form for errors.");
            setIsSubmitDisabled(true);
        },
        ...loginFormOptions,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="flex flex-col w-full px-20 gap-6"
        >
            <form.AppField name="emailOrUsername">
                {({ state: { meta }, TextInput }) => {
                    const validationError = meta.isTouched
                        ? meta.errors?.[0]?.message
                        : undefined;

                    return (
                        <TextInput
                            id="emailOrUsername"
                            label="Email or Username"
                            placeholder="Enter your email or username"
                            error={validationError}
                        />
                    );
                }}
            </form.AppField>
            <form.AppField name="password">
                {({ state: { meta }, TextInput }) => {
                    const validationError = meta.isTouched
                        ? meta.errors?.[0]?.message
                        : undefined;

                    return (
                        <TextInput
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            error={validationError}
                        />
                    );
                }}
            </form.AppField>
            <form.AppForm>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    <form.SubmitButton
                        label="Log In"
                        isDisabled={!form.state.canSubmit || isSubmitDisabled}
                        isLoading={form.state.isSubmitting}
                    />
                </form.Subscribe>
            </form.AppForm>
        </form>
    );
};

export default LoginForm;
