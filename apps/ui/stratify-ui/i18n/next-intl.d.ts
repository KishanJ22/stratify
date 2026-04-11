import messages from "@/messages/messages";
import { formats } from "@/i18n/request";

declare module "next-intl" {
    interface AppConfig {
        Formats: typeof formats;
        Messages: typeof messages.en;
    }
}
