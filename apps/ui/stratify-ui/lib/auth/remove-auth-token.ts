"use server";

import { cookies } from "next/headers";

export const removeAuthTokenFromCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("bearer-token");
};
