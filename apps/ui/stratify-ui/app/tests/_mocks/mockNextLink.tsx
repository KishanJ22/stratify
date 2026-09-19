import { vi } from "vitest";

vi.mock("next/link", () => ({
	default: (props: { href: string; children: React.ReactNode }) => (
		<a href={props.href}>{props.children}</a>
	),
}));
