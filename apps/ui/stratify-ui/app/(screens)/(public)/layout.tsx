import type { Metadata } from "next";
import "../../globals.css";
import Providers from "../../global/Providers";
import PublicNavbar from "../../components/(public)/PublicNavbar/PublicNavbar";
import { getFontClassNames } from "@/lib/fonts";
import { PublicEnv } from "@/public-env";

export const metadata: Metadata = {
    title: "Stratify UI",
    description: "Stratify UI",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const fontClassNames = getFontClassNames();

    return (
        <html lang="en">
            <head />
            <body className={`${fontClassNames} antialiased`} id="root">
                <PublicEnv />
                <Providers>
                    <PublicNavbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
