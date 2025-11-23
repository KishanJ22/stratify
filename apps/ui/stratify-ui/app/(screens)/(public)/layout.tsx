import type { Metadata } from "next";
import "../../globals.css";
import Providers from "../../global/Providers";
import Navbar from "../../components/Navbar/Navbar";
import { getFontClassNames } from "@/lib/fonts";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const apiProxyUrl = process.env.NEXT_PUBLIC_API_PROXY_URL || "";
    const authProxyUrl = process.env.NEXT_PUBLIC_AUTH_PROXY_URL || "";
    const fontClassNames = getFontClassNames();

    return (
        <html lang="en">
            <head />
            <body
                className={`${fontClassNames} antialiased`}
                id="root"
            >
                <Providers
                    apiProxyUrl={apiProxyUrl}
                    authProxyUrl={authProxyUrl}
                >
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
