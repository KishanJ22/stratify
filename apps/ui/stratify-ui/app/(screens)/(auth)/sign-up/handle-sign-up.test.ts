import { expect, describe, beforeEach, vi, it } from "vitest";
import type { SignUpSchema } from "./sign-up-schema";
import { handleSignUp } from "./handle-sign-up";
import { useAuthClient, type AuthClient } from "@/lib/auth/auth";

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

const mockCheckUsernameAvailable = vi.fn();
const mockSignUp = vi.fn();

const mockAuthClient = {
    signUp: {
        email: mockSignUp,
    },
    isUsernameAvailable: mockCheckUsernameAvailable,
} as unknown as AuthClient;

vi.mock("@/lib/auth/auth", () => ({
    useAuthClient: () => mockAuthClient,
}));

const mockSetIsUsernameAlreadyTaken = vi.fn();
const mockSetIsEmailAlreadyTaken = vi.fn();
const mockSetIsSubmitDisabled = vi.fn();
const mockResetForm = vi.fn();

describe("handleSignUp", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const executeSignUp = async (values: SignUpSchema) => {
        await handleSignUp(
            values,
            mockAuthClient,
            mockRouterPush,
            mockSetIsUsernameAlreadyTaken,
            mockSetIsEmailAlreadyTaken,
            mockSetIsSubmitDisabled,
            mockResetForm,
        );
    };

    it("AB#132 - should handle sign up successfully", async () => {
        mockCheckUsernameAvailable.mockResolvedValueOnce({
            data: { available: true },
        });

        mockSignUp.mockResolvedValueOnce({
            data: {
                token: "valid-token",
            },
        });

        const signUpValues = {
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: "supersecretpassword",
            confirmPassword: "supersecretpassword",
        } satisfies SignUpSchema;

        await executeSignUp(signUpValues);

        expect(mockCheckUsernameAvailable).toHaveBeenCalledWith({
            username: signUpValues.username,
        });

        expect(mockSignUp).toHaveBeenCalledWith({
            email: signUpValues.email,
            name: `${signUpValues.firstName} ${signUpValues.lastName}`,
            password: signUpValues.password,
            username: signUpValues.username,
        });

        expect(mockStoreToken).toHaveBeenCalledWith("valid-token");
        expect(mockRouterPush).toHaveBeenCalledWith("/");
    });

    it("AB#140 - should handle a username already being taken", async () => {
        mockCheckUsernameAvailable.mockResolvedValueOnce({
            data: { available: false },
        });

        const signUpValues = {
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: "supersecretpassword",
            confirmPassword: "supersecretpassword",
        } satisfies SignUpSchema;

        await executeSignUp(signUpValues);

        expect(mockCheckUsernameAvailable).toHaveBeenCalledWith({
            username: signUpValues.username,
        });

        expect(mockSignUp).not.toHaveBeenCalled();
        expect(mockSetIsUsernameAlreadyTaken).toHaveBeenCalledWith(true);
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("AB#134 - should handle an email already being taken", async () => {
        mockCheckUsernameAvailable.mockResolvedValueOnce({
            data: { available: true },
        });

        mockSignUp.mockResolvedValueOnce({
            error: { code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" },
        });

        const signUpValues = {
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: "supersecretpassword",
            confirmPassword: "supersecretpassword",
        } satisfies SignUpSchema;

        await executeSignUp(signUpValues);

        expect(mockCheckUsernameAvailable).toHaveBeenCalledWith({
            username: signUpValues.username,
        });

        expect(mockSignUp).toHaveBeenCalledWith({
            email: signUpValues.email,
            name: `${signUpValues.firstName} ${signUpValues.lastName}`,
            password: signUpValues.password,
            username: signUpValues.username,
        });

        expect(mockSetIsEmailAlreadyTaken).toHaveBeenCalledWith(true);
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("should handle sign up failure correctly (error code specified)", async () => {
        mockCheckUsernameAvailable.mockResolvedValueOnce({
            data: { available: true },
        });

        mockSignUp.mockResolvedValueOnce({
            error: { code: "errorCode" },
        });

        mockGetAuthErrorMessage.mockReturnValueOnce("Specific error message.");

        const signUpValues = {
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: "supersecretpassword",
            confirmPassword: "supersecretpassword",
        } satisfies SignUpSchema;

        await executeSignUp(signUpValues);

        expect(mockCheckUsernameAvailable).toHaveBeenCalledWith({
            username: signUpValues.username,
        });

        expect(mockSignUp).toHaveBeenCalledWith({
            email: signUpValues.email,
            name: `${signUpValues.firstName} ${signUpValues.lastName}`,
            password: signUpValues.password,
            username: signUpValues.username,
        });

        expect(mockToastError).toHaveBeenCalledWith("Specific error message.");
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("should handle sign up failure correctly (no error code)", async () => {
        mockCheckUsernameAvailable.mockResolvedValueOnce({
            data: { available: true },
        });

        mockSignUp.mockResolvedValueOnce({
            error: {},
        });

        const signUpValues = {
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: "supersecretpassword",
            confirmPassword: "supersecretpassword",
        } satisfies SignUpSchema;

        await executeSignUp(signUpValues);

        expect(mockCheckUsernameAvailable).toHaveBeenCalledWith({
            username: signUpValues.username,
        });

        expect(mockSignUp).toHaveBeenCalledWith({
            email: signUpValues.email,
            name: `${signUpValues.firstName} ${signUpValues.lastName}`,
            password: signUpValues.password,
            username: signUpValues.username,
        });

        expect(mockToastError).toHaveBeenCalledWith(
            "Sign up failed. Please try again.",
        );
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("should handle username availability check errors correctly", async () => {
        mockCheckUsernameAvailable.mockResolvedValueOnce({
            error: { code: "errorCode" },
        });

        mockGetAuthErrorMessage.mockReturnValueOnce("Specific error message.");

        const signUpValues = {
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: "supersecretpassword",
            confirmPassword: "supersecretpassword",
        } satisfies SignUpSchema;

        await executeSignUp(signUpValues);

        expect(mockCheckUsernameAvailable).toHaveBeenCalledWith({
            username: signUpValues.username,
        });

        expect(mockToastError).toHaveBeenCalledWith("Specific error message.");
        expect(mockRouterPush).not.toHaveBeenCalled();
    });
});
