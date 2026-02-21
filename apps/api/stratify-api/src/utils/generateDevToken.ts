import { SignJWT } from "jose";

interface GenerateDevTokenOptions {
    userId: string;
    name?: string;
    currency?: string;
}

export const generateDevToken = async ({
    userId,
    name = "Dev User",
    currency = "GBP",
}: GenerateDevTokenOptions) => {
    const payload = {
        id: userId,
        name,
        username: name,
        displayUsername: name,
        email: `${name.toLowerCase().replace(/\s/g, "")}@test.com`,
        currency,
    };

    const secret = new TextEncoder().encode("secret");

    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

    return `Bearer Dev-${jwt}`;
};
