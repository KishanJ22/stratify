import * as zod from "zod";

export const signUpSchema = zod
    .object({
        firstName: zod.string().min(1, "First name should be set"),
        lastName: zod.string().min(1, "Last name should be set"),
        username: zod.string().min(1, "Username should be set"),
        email: zod.email({ error: "Email should be in the correct format" }),
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