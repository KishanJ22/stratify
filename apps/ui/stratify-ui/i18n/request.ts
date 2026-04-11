import { getRequestConfig } from "next-intl/server";
import type { Formats } from "next-intl";
import messages from "@/messages/messages";

export const formats = {
    dateTime: {
        short: {
            year: "numeric",
            month: "short",
            day: "numeric",
        },
        long: {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    },
    number: {
        precise: {
            maximumFractionDigits: 2,
            trailingZeroDisplay: "stripIfInteger",
        },
        percentage: {
            trailingZeroDisplay: "stripIfInteger",
            maximumFractionDigits: 2,
        },
    },
} satisfies Formats;

export default getRequestConfig(async () => {
    // Static for now, we'll change this later
    const locale = "en";

    return {
        locale,
        messages: messages[locale],
        formats,
    };
});
