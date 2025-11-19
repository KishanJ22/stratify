import { createAuthClient } from "better-auth/react";
import { usernameClient, jwtClient } from "better-auth/client/plugins";

const authErrorCodes = createAuthClient({
    plugins: [usernameClient(), jwtClient()],
}).$ERROR_CODES;

export type ErrorCode = keyof typeof authErrorCodes;

// TODO: replace string with an object with locales (e.g. { en: string, es: string })
type ErrorCodeMapping = Partial<Record<ErrorCode, string>>;

export const getAuthErrorMessage = (code: string) => {
    return errorCodesMap[code as ErrorCode];
};

export const errorCodesMap: ErrorCodeMapping = {
    USER_NOT_FOUND: "User not found",
    FAILED_TO_CREATE_USER: "Failed to create user",
    FAILED_TO_CREATE_SESSION: "Failed to create session",
    FAILED_TO_UPDATE_USER: "Failed to update user",
    FAILED_TO_GET_SESSION: "Failed to get session",
    INVALID_PASSWORD: "Invalid password",
    INVALID_EMAIL: "Invalid email",
    INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
    SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
    INVALID_TOKEN: "Invalid token",
    FAILED_TO_GET_USER_INFO: "Failed to get user details",
    USER_EMAIL_NOT_FOUND: "Email not found",
    EMAIL_NOT_VERIFIED: "Email not verified",
    USER_ALREADY_EXISTS: "User already exists",
    EMAIL_CAN_NOT_BE_UPDATED: "Email cannot be updated",
    SESSION_EXPIRED: "Session expired",
    ACCOUNT_NOT_FOUND: "Account not found",
    USER_ALREADY_HAS_PASSWORD: "User already has password",
} as const;
