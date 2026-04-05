import "../../globals.css";
import type { Metadata } from "next";
import Providers from "../../global/Providers";
import { getFontClassNames } from "@/lib/fonts";
import { Toaster } from "@/app/components/ui/sonner";
import PublicNavbar from "@/app/components/(public)/PublicNavbar/PublicNavbar";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI",
};

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const apiProxyUrl = process.env.NEXT_PUBLIC_API_PROXY_URL || "";
    const authProxyUrl = process.env.NEXT_PUBLIC_AUTH_PROXY_URL || "";
    const fontClassNames = getFontClassNames();

    return (
        <html lang="en">
            <head />
            <body className={`${fontClassNames} antialiased`} id="root">
                <Providers
                    apiProxyUrl={apiProxyUrl}
                    authProxyUrl={authProxyUrl}
                >
                    <div className="h-screen flex flex-col">
                        <PublicNavbar showLoginSignUpButtons={false} />
                        <div className="flex-1 overflow-hidden">{children}</div>
                    </div>
                    <Toaster richColors />
                </Providers>
            </body>
        </html>
    );
}
