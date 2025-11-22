import { useRouter } from "next/navigation";
import { LoginFormValues } from "./login-schema";
import { storeAuthToken } from "@/lib/auth/store-auth-token";
import { getAuthErrorMessage } from "@/lib/auth/authErrorCodes";
import type { AuthClient } from "@/lib/auth/auth";
import { toast } from "sonner";

export const handleLogin = async (
    value: LoginFormValues,
    authClient: AuthClient,
    push: ReturnType<typeof useRouter>["push"],
) => {
    const isEmail = value.emailOrUsername.includes("@");

    try {
        const { data, error } = isEmail
            ? await authClient.signIn.email({
                  email: value.emailOrUsername,
                  password: value.password,
                  rememberMe: value.rememberMe,
              })
            : await authClient.signIn.username({
                  username: value.emailOrUsername,
                  password: value.password,
                  rememberMe: value.rememberMe,
              });

        if (data?.token) {
            await storeAuthToken(data.token);
            // TODO: redirect to /app/dashboard once built
            push("/");
        }

        if (error?.code) {
            const errorMessage = getAuthErrorMessage(error.code);

            return errorMessage
                ? toast.error(errorMessage)
                : toast.error("Login failed. Please try again.");
        } else {
            return toast.error("Login failed. Please try again.");
        }
    } catch (error) {
        return toast.error("An unexpected error occurred. Please try again.");
    }
};
