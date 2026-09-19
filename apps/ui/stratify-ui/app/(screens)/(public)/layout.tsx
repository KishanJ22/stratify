import type { Metadata } from "next";
import "../../globals.css";
import { NextIntlClientProvider } from "next-intl";
import ProgressProvider from "@/app/global/ProgressProvider";
import { getFontClassNames } from "@/lib/fonts";
import { PublicEnv } from "@/public-env";
import PublicNavbar from "../../components/(public)/PublicNavbar/PublicNavbar";
import Providers from "../../global/Providers";

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
				<NextIntlClientProvider>
					<PublicEnv />
					<Providers>
						<PublicNavbar />
						<ProgressProvider>{children}</ProgressProvider>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
