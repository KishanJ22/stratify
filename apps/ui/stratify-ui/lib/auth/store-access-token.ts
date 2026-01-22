"use server";
import { cookies } from "next/headers";

//? Store JWT access token in cookies
export const storeAccessToken = async (token: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token");

    if (!accessToken || accessToken.value !== token) {
        cookieStore.set({
            name: "access-token",
            value: token,
            httpOnly: true,
        });
    }
};
