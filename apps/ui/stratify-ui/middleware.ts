import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "./lib/auth/get-access-token";

//? Add URLs for deployed environments here
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const API_URL = process.env.STRATIFY_API_URL;
const AUTH_API_URL = process.env.STRATIFY_AUTH_API_URL;

const proxyRequest = async (request: NextRequest) => {
    const requestPathname = request.nextUrl.pathname;

    // Allow calls to health endpoint without proxying
    if (requestPathname.startsWith("/api/health")) {
        return NextResponse.next();
    }

    // Check if API_URL is defined
    if (!API_URL) {
        console.error("STRATIFY_API_URL is not defined");
        return new NextResponse("Internal Server Error", { status: 500 });
    }

    // If the request is for an auth endpoint, check if AUTH_API_URL is defined
    const isAuthRequest = requestPathname.startsWith("/api/auth");

    if (isAuthRequest) {
        if (!AUTH_API_URL) {
            console.error("STRATIFY_AUTH_API_URL is not defined");
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }

    try {
        const { pathname, search } = request.nextUrl;

        // Get origin and check if it's allowed for CORS
        const origin = request.headers.get("origin") || "";
        const isAllowedOrigin = allowedOrigins.includes(origin);

        const headers = new Headers(request.headers);

        // Determine the target URL based on the request type
        const targetBaseUrl = isAuthRequest ? AUTH_API_URL : API_URL;
        // Change proxy path to actual API path
        const targetPath = pathname.replace(/^\/api/, "");
        const targetUrl = `${targetBaseUrl}${targetPath}${search}`;

        // Add CORS header for allowed origin to prevent CORS issues
        const responseHeaders = {
            ...(isAllowedOrigin && {
                "Access-Control-Allow-Origin": origin,
            }),
        };

        if (!isAuthRequest) {
            const token = await getAccessTokenFromCookies();

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        }

        return NextResponse.rewrite(targetUrl, {
            request: {
                headers,
            },
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api")) {
        return proxyRequest(request);
    }

    return NextResponse.next();
}
