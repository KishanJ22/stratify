"use server";
import { cookies } from "next/headers";

//? Get JWT access token from cookies
export const getAccessTokenFromCookies = async () => {
    const cookieStore = await cookies();

    const token = cookieStore.get("access-token");
    return token ? token.value : null;
};
