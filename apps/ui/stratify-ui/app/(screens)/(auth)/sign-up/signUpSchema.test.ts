import { describe, it } from "vitest";
import { signUpSchema } from "./signUpSchema";
import { expect } from "vitest";

const mockSuccessValues = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    username: "johndoe",
    password: "Password1!",
    confirmPassword: "Password1!",
};

describe("signUpSchema", () => {
    it("should pass validation with valid data", () => {
        const result = signUpSchema.safeParse(mockSuccessValues);

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("AB#147 - should fail validation when the email is invalid", () => {
        const result = signUpSchema.safeParse({
            ...mockSuccessValues,
            email: "invalid-email",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Email should be in the correct format",
        );
    });

    describe("Empty value validation", () => {
        it("AB#133 - should fail validation when the first name is empty", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                firstName: "",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "First name should be set",
            );
        });

        it("AB#133 - should fail validation when the last name is empty", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                lastName: "",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Last name should be set",
            );
        });

        it("AB#133 - should fail validation when the username is empty", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                username: "",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Username should be set",
            );
        });
    });

    describe("Password validation", () => {
        it("AB#136 - should fail validation when the password is too short", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                password: "weak",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toContain(
                "Password must be at least 8 characters long",
            );
        });

        it("AB#137 - should fail validation when the password doesn't include an uppercase letter", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                password: "password1!",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Password must contain at least one uppercase letter",
            );
        });

        it("AB#148 - should fail validation when the password doesn't include a lowercase letter", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                password: "PASSWORD1",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Password must contain at least one lowercase letter",
            );
        });

        it("AB#138 - should fail validation when the password doesn't include a number", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                password: "Password!",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Password must contain at least one number",
            );
        });

        it("AB#139 - should fail validation when the password doesn't include a special character", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                password: "Password1",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Password must contain at least one special character",
            );
        });

        it("AB#135 - should fail validation when passwords do not match", () => {
            const result = signUpSchema.safeParse({
                ...mockSuccessValues,
                confirmPassword: "DifferentPassword1!",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Passwords do not match",
            );
        });
    });
});
