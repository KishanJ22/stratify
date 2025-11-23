import { toast } from "sonner";
import type { AuthClient } from "@/lib/auth/auth";
import { SignUpSchema } from "./sign-up-schema";
import { useRouter } from "next/navigation";
import { storeAuthToken } from "@/lib/auth/store-auth-token";
import { getAuthErrorMessage } from "@/lib/auth/authErrorCodes";
import { Dispatch, SetStateAction } from "react";

export const handleSignUp = async (
    value: SignUpSchema,
    authClient: AuthClient,
    push: ReturnType<typeof useRouter>["push"],
    setIsUsernameAlreadyTaken: Dispatch<SetStateAction<boolean>>,
    setIsEmailAlreadyTaken: Dispatch<SetStateAction<boolean>>,
    setIsSubmitDisabled: Dispatch<SetStateAction<boolean>>,
    resetForm: () => void,
) => {
    setIsUsernameAlreadyTaken(false);
    setIsEmailAlreadyTaken(false);
    setIsSubmitDisabled(true);

    try {
        const {
            data: isUsernameAvailableRes,
            error: isUsernameAvailableError,
        } = await authClient.isUsernameAvailable({
            username: value.username,
        });

        if (isUsernameAvailableError) {
            const errorMessage = getAuthErrorMessage(
                isUsernameAvailableError.code as string,
            );

            setIsSubmitDisabled(true);

            return errorMessage
                ? toast.error(errorMessage)
                : toast.error("Sign up failed. Please try again.");
        }

        if (!isUsernameAvailableRes?.available) {
            return setIsUsernameAlreadyTaken(true);
        }

        const { data: signUpData, error: signUpError } =
            await authClient.signUp.email({
                email: value.email,
                name: `${value.firstName} ${value.lastName}`,
                password: value.password,
                username: value.username,
            });

        if (signUpData?.token) {
            const authToken = signUpData.token;

            if (authToken) {
                await storeAuthToken(authToken);
            }

            // TODO: redirect to /app/dashboard once built
            return push("/");
        }

        //! Handle error here instead of in an onError callback to access the error code properly
        if (signUpError) {
            // TODO: use ErrorCode type once all error codes are mapped
            const errorCode = signUpError?.code as string;
            const errorMessage = getAuthErrorMessage(errorCode);

            // Show specific error message in toast if available
            if (errorMessage) {
                return toast.error(errorMessage);
            }

            //? Workaround as error code is not in the error types returned by the auth client
            if (errorCode == "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
                return setIsEmailAlreadyTaken(true);
            } else {
                resetForm(); // Reset the form on unexpected error
                return toast.error("Sign up failed. Please try again.");
            }
        }
    } catch (error) {
        toast.error("Sign up failed. Please try again.");
        return setIsSubmitDisabled(false);
    }
};
