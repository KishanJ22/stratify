import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.STRATIFY_API_URL;
const AUTH_API_URL = process.env.STRATIFY_AUTH_API_URL;

const proxyRequest = async (request: NextRequest) => {
    const requestPathname = request.nextUrl.pathname;

    if (requestPathname.startsWith("/api/health")) {
        return NextResponse.next();
    }

    const isAuthRequest = requestPathname.startsWith("/api/auth");

    if (!API_URL) {
        console.error("STRATIFY_API_URL is not defined");
        return new NextResponse("Internal Server Error", { status: 500 });
    }

    if (isAuthRequest) {
        if (!AUTH_API_URL) {
            console.error("STRATIFY_AUTH_API_URL is not defined");
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }

    try {
        const { pathname, search } = request.nextUrl;
        const headers = new Headers(request.headers);

        // Determine the target URL based on the request type
        const targetBaseUrl = isAuthRequest ? AUTH_API_URL : API_URL;
        const targetPath = pathname.replace(/^\/api/, "");
        const targetUrl = `${targetBaseUrl}${targetPath}${search}`;

        headers.delete("host");
        headers.delete("connection");
        headers.delete("x-forwarded-host");
        headers.delete("x-forwarded-proto");
        headers.set("x-original-url", request.url);

        return NextResponse.rewrite(targetUrl, {
            request: {
                headers,
            },
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
