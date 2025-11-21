import { Commissioner, Kaisei_Decol, Source_Code_Pro } from "next/font/google";

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

export const getFontClassNames = () => {
    return `${fontSans.className} ${fontSerif.className} ${fontMono.className}`;
};
