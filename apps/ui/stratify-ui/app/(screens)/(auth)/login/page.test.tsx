import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";
import { beforeEach } from "node:test";
import { render, screen } from "@testing-library/react";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

// Mock Image component from next/image
vi.mock("next/image", () => ({
    default: (props: { alt?: string }) => <img alt={props.alt} />,
}));

vi.mock("./LoginForm", () => ({
    default: () => <div>Login form</div>,
}));

describe("Login page", () => {
    const renderPage = () => render(<LoginPage />);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the heading", () => {
        renderPage();

        expect(screen.getByText("Log In")).toBeInTheDocument();
    });

    it("should render the logo displayed in the background", () => {
        renderPage();

        expect(screen.getByAltText("Stratify Logo")).toBeInTheDocument();
    });

    it("AB#150 - should render a link to navigate to the sign-up page", async () => {
        const user = userEvent.setup();

        renderPage();

        const signUpLink = screen.getByText("Sign Up");
        await user.click(signUpLink);

        expect(mockRouterPush).toHaveBeenCalledWith("/sign-up");
    });
});
