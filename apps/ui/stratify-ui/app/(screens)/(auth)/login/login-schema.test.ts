import { describe, expect, it } from "vitest";
import { LoginFormValues, loginSchema } from "./login-schema";

const mockSuccessValues = {
    emailOrUsername: "johndoe",
    password: "Password1!",
    rememberMe: true,
} satisfies LoginFormValues;

describe("loginSchema", () => {
    it("should pass validation with valid data", () => {
        const result = loginSchema.safeParse(mockSuccessValues);

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
    });

    describe("Empty value validation", () => {
        it("AB#151 - should fail validation when the username or email field is empty", () => {
            const result = loginSchema.safeParse({
                ...mockSuccessValues,
                emailOrUsername: "",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Email or username is required",
            );
        });

        it("AB#155 - should fail validation when the password field is empty", () => {
            const result = loginSchema.safeParse({
                ...mockSuccessValues,
                password: "",
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].message).toBe(
                "Password is required",
            );
        });
    });
});
