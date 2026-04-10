import { getRequestConfig } from "next-intl/server";
import messages from "@/messages/messages";

export default getRequestConfig(async () => {
    // Static for now, we'll change this later
    const locale = "en-GB";

    return {
        locale,
        messages: messages[locale],
    };
});
