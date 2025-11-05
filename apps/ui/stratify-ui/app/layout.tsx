import type { Metadata } from "next";
import "./globals.css";
import Providers from "./global/Providers";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI Application",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const apiProxyUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const authProxyUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "";

    return (
        <html lang="en">
            <head />
            <body className="antialiased font-sans" id="root">
                <Providers
                    apiProxyUrl={apiProxyUrl}
                    authProxyUrl={authProxyUrl}
                >
                    {children}
                </Providers>
            </body>
        </html>
    );
}
