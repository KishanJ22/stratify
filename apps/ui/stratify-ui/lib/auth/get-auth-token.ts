"use server";
import { cookies } from "next/headers";

//? Get session bearer token from cookies
export const getSessionTokenFromCookies = async () => {
    const cookieStore = await cookies();

    const token = cookieStore.get("bearer-token");
    return token ? token.value : null;
};
