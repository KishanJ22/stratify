"use server";
import { cookies } from "next/headers";

//? Store session bearer token in cookies
export const storeAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("bearer-token");

    if (!authToken || authToken.value !== token) {
        cookieStore.set({
            name: "bearer-token",
            value: token,
            httpOnly: true,
        });
    }
};
