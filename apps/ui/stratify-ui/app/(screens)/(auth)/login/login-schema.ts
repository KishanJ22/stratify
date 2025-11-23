import * as zod from "zod";

export const loginSchema = zod.object({
    emailOrUsername: zod.string().min(1, "Email or username is required"),
    password: zod.string().min(1, "Password is required"),
    rememberMe: zod.boolean(),
});

export type LoginFormValues = zod.infer<typeof loginSchema>;