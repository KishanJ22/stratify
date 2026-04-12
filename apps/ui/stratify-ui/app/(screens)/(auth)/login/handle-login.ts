import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storeAuthToken } from "@/lib/auth/store-auth-token";
import { getAuthErrorMessage } from "@/lib/auth/authErrorCodes";
import type { LoginFormValues } from "./login-schema";
import type { AuthClient } from "@/lib/auth/auth";
import { Dispatch, SetStateAction } from "react";

export const handleLogin = async (
    value: LoginFormValues,
    authClient: AuthClient,
    push: ReturnType<typeof useRouter>["push"],
    setIsPending: Dispatch<SetStateAction<boolean>>,
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
            setIsPending(false);
            await storeAuthToken(data.token);
            return push("/app/dashboard");
        }

        if (error?.code) {
            const errorMessage = getAuthErrorMessage(error.code);
            setIsPending(false);
            return errorMessage
                ? toast.error(errorMessage)
                : toast.error("Login failed. Please try again.");
        } else {
            setIsPending(false);
            return toast.error("Login failed. Please try again.");
        }
    } catch (error) {
        setIsPending(false);
        return toast.error("Login failed. Please try again.");
    }
};
