import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SignUpPage from "./page";
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

vi.mock("./SignUpForm", () => ({
    default: () => <div>Sign-up form</div>,
}));

const user = userEvent.setup();

describe("Sign up page", () => {
    const renderPage = () => render(<SignUpPage />);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the heading", () => {
        renderPage();

        expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    });

    it("should render the logo displayed in the background", () => {
        renderPage();

        expect(screen.getByAltText("Stratify Logo")).toBeInTheDocument();
    });

    it("AB#143 - should render a link to navigate to the login page", async () => {
        renderPage();

        const loginLink = screen.getByText("Log In");
        await user.click(loginLink);

        expect(mockRouterPush).toHaveBeenCalledWith("/login");
    });
});
