import { vi } from "vitest";

export const mockNextLink = () => {
    return vi.mock("next/link", () => ({
        default: (props: { href: string; children: React.ReactNode }) => (
            <a href={props.href}>{props.children}</a>
        ),
    }));
};
