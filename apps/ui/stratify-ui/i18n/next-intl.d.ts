import { formats } from "@/i18n/request";
import messages from "@/messages/messages";

declare module "next-intl" {
	interface AppConfig {
		Formats: typeof formats;
		Messages: typeof messages.en;
	}
}
