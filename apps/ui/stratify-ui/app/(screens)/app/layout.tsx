import "../../globals.css";
import type { Metadata } from "next";
import Providers from "../../global/Providers";
import { getFontClassNames } from "@/lib/fonts";
import { Toaster } from "@/app/components/ui/sonner";
import { SessionProvider } from "./SessionProvider";
import AppNavbar from "@/app/components/(app)/AppNavbar";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { PublicEnv } from "@/public-env";
import { NextIntlClientProvider } from "next-intl";
import ProgressProvider from "@/app/global/ProgressProvider";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI",
};

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AuthLayoutProps) {
    const fontClassNames = getFontClassNames();

    return (
        <html lang="en">
            <head />
            <body className={`${fontClassNames} antialiased`} id="root">
                <NextIntlClientProvider>
                    <PublicEnv />
                    <Providers>
                        <SessionProvider>
                            <AppNavbar />
                            <TooltipProvider>
                                <ProgressProvider>{children}</ProgressProvider>
                            </TooltipProvider>
                        </SessionProvider>
                        <Toaster richColors />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
