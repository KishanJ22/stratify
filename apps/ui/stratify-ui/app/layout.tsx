import type { Metadata } from "next";
import "./globals.css";
import Providers from "./global/Providers";
import Navbar from "./components/Navbar/Navbar";
import { Commissioner, Kaisei_Decol, Source_Code_Pro } from "next/font/google";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI",
};

const fontSans = Commissioner({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontSerif = Kaisei_Decol({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

const fontMono = Source_Code_Pro({
    subsets: ["latin"],
    variable: "--font-mono",
});

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const apiProxyUrl = process.env.NEXT_PUBLIC_API_PROXY_URL || "";
    const authProxyUrl = process.env.NEXT_PUBLIC_AUTH_PROXY_URL || "";

    return (
        <html lang="en">
            <head />
            <body
                className={`${fontSans.className} ${fontSerif.className} ${fontMono.className} antialiased`}
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
