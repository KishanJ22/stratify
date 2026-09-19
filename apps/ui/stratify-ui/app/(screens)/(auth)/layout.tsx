import "../../globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import PublicNavbar from "@/app/components/(public)/PublicNavbar/PublicNavbar";
import { Toaster } from "@/app/components/ui/sonner";
import ProgressProvider from "@/app/global/ProgressProvider";
import { getFontClassNames } from "@/lib/fonts";
import { PublicEnv } from "@/public-env";
import Providers from "../../global/Providers";

export const metadata: Metadata = {
	title: "Stratify UI",
	description: "Stratify UI",
};

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	const fontClassNames = getFontClassNames();

	return (
		<html lang="en">
			<head />
			<body className={`${fontClassNames} antialiased`} id="root">
				<NextIntlClientProvider>
					<PublicEnv />
					<Providers>
						<div className="h-screen flex flex-col">
							<PublicNavbar showLoginSignUpButtons={false} />
							<div className="flex-1 overflow-hidden">
								<ProgressProvider>{children}</ProgressProvider>
							</div>
						</div>
						<Toaster richColors />
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
