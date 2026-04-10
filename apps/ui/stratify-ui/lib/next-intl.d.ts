import messages from "@/messages/messages";

declare module "next-intl" {
    interface AppConfig {
        Messages: (typeof messages)["en-GB"];
    }
}
