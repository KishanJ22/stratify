"use server";

import { cookies } from "next/headers";

//? Remove session bearer token and JWT access token from cookies
export const removeTokensFromCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("bearer-token");
    cookieStore.delete("access-token");
};
