import { expect, describe, beforeEach, vi, it } from "vitest";
import { LoginFormValues } from "./login-schema";
import { handleLogin } from "./handle-login";
import { AuthClient } from "@/lib/auth/auth";

const mockToastError = vi.fn();

vi.mock("sonner", () => ({
    toast: {
        error: (msg: string) => mockToastError(msg),
    },
}));

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

const mockStoreToken = vi.fn();

vi.mock("@/lib/auth/store-auth-token", () => ({
    storeAuthToken: (token: string) => mockStoreToken(token),
}));

const mockGetAuthErrorMessage = vi.fn();

vi.mock("@/lib/auth/authErrorCodes", () => ({
    getAuthErrorMessage: (code: string) => mockGetAuthErrorMessage(code),
}));

const mockLoginWithUsername = vi.fn();
const mockLoginWithEmail = vi.fn();

const mockAuthClient = {
    signIn: {
        username: mockLoginWithUsername,
        email: mockLoginWithEmail,
    },
} as unknown as AuthClient;

vi.mock("@/lib/auth/auth", () => ({
    useAuthClient: () => mockAuthClient,
}));

describe("handleLogin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const executeLogin = async (values: LoginFormValues) => {
        await handleLogin(values, mockAuthClient, mockRouterPush);
    };

    it("AB#153 - should handle login with username successfully", async () => {
        mockLoginWithUsername.mockResolvedValueOnce({
            data: {
                token: "valid-token",
            },
        });

        const loginWithUsernameValues = {
            emailOrUsername: "johndoe",
            password: "supersecretpassword",
            rememberMe: true,
        } satisfies LoginFormValues;

        await executeLogin(loginWithUsernameValues);

        expect(mockLoginWithUsername).toHaveBeenCalledWith({
            username: loginWithUsernameValues.emailOrUsername,
            password: loginWithUsernameValues.password,
            rememberMe: loginWithUsernameValues.rememberMe,
        });

        expect(mockStoreToken).toHaveBeenCalledWith("valid-token");
        expect(mockRouterPush).toHaveBeenCalledWith("/app/dashboard");
    });

    it("AB#152 - should handle login with email successfully", async () => {
        mockLoginWithEmail.mockResolvedValueOnce({
            data: {
                token: "valid-token",
            },
        });

        const loginWithEmailValues = {
            emailOrUsername: "johndoe@example.com",
            password: "supersecretpassword",
            rememberMe: false,
        } satisfies LoginFormValues;

        await executeLogin(loginWithEmailValues);

        expect(mockLoginWithEmail).toHaveBeenCalledWith({
            email: loginWithEmailValues.emailOrUsername,
            password: loginWithEmailValues.password,
            rememberMe: loginWithEmailValues.rememberMe,
        });

        expect(mockStoreToken).toHaveBeenCalledWith("valid-token");
        expect(mockRouterPush).toHaveBeenCalledWith("/app/dashboard");
    });

    it("should handle login failure correctly (error code specified)", async () => {
        mockLoginWithUsername.mockResolvedValueOnce({
            error: {
                code: "InvalidCredentials",
            },
        });

        mockGetAuthErrorMessage.mockReturnValueOnce(
            "Invalid username or password.",
        );

        const loginValues = {
            emailOrUsername: "johndoe",
            password: "wrongpassword",
            rememberMe: false,
        } satisfies LoginFormValues;

        await executeLogin(loginValues);

        expect(mockLoginWithUsername).toHaveBeenCalledWith({
            username: loginValues.emailOrUsername,
            password: loginValues.password,
            rememberMe: loginValues.rememberMe,
        });

        expect(mockToastError).toHaveBeenCalledWith(
            "Invalid username or password.",
        );
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("should handle login failure correctly (no error code)", async () => {
        mockLoginWithUsername.mockResolvedValueOnce({
            error: {},
        });

        const loginValues = {
            emailOrUsername: "johndoe",
            password: "wrongpassword",
            rememberMe: false,
        } satisfies LoginFormValues;

        await executeLogin(loginValues);

        expect(mockLoginWithUsername).toHaveBeenCalledWith({
            username: loginValues.emailOrUsername,
            password: loginValues.password,
            rememberMe: loginValues.rememberMe,
        });

        expect(mockToastError).toHaveBeenCalledWith(
            "Login failed. Please try again.",
        );
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors correctly", async () => {
        mockLoginWithUsername.mockRejectedValueOnce(new Error("Network error"));

        const loginValues = {
            emailOrUsername: "johndoe",
            password: "supersecretpassword",
            rememberMe: true,
        } satisfies LoginFormValues;

        await executeLogin(loginValues);

        expect(mockLoginWithUsername).toHaveBeenCalledWith({
            username: loginValues.emailOrUsername,
            password: loginValues.password,
            rememberMe: loginValues.rememberMe,
        });

        expect(mockToastError).toHaveBeenCalledWith(
            "Login failed. Please try again.",
        );

        expect(mockRouterPush).not.toHaveBeenCalled();
    });
});
