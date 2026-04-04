import type { Metadata } from "next";
import "../../globals.css";
import Providers from "../../global/Providers";
import { getFontClassNames } from "@/lib/fonts";
import { Toaster } from "@/app/components/ui/sonner";
import { SessionProvider } from "./SessionProvider";
import AppNavbar from "@/app/components/(app)/AppNavbar";
import { TooltipProvider } from "@/app/components/ui/tooltip";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI",
};

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AuthLayoutProps) {
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
                    <SessionProvider>
                        <div className="h-screen flex flex-col">
                            <AppNavbar />
                            <TooltipProvider>
                                <div className="flex-1 overflow-hidden">
                                    {children}
                                </div>
                            </TooltipProvider>
                        </div>
                    </SessionProvider>
                    <Toaster richColors />
                </Providers>
            </body>
        </html>
    );
}
