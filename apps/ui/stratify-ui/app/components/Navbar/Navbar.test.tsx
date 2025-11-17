import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "./Navbar";
import { mockNextLink } from "@/app/tests/_mocks/mockNextLink";

// Mock Image component from next/image
vi.mock("next/image", () => ({
    default: (props: { alt?: string }) => <img alt={props.alt} />,
}));

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

mockNextLink();

const user = userEvent.setup();

describe("Navbar component", () => {
    const renderComponent = () => render(<Navbar />);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("AB#125 - should render the Navbar correctly", () => {
        renderComponent();

        expect(screen.getByAltText("Stratify Logo")).toBeInTheDocument();
        expect(screen.getByText("Stratify")).toBeInTheDocument();

        const navLinks = [
            "Home",
            "Portfolio",
            "Markets",
            "Learn",
            "Login",
            "Sign Up",
        ];

        navLinks.forEach((link) => {
            expect(screen.getByText(link)).toBeInTheDocument();
        });
    });

    it("AB#126 - should navigate to the learn page when the Learn nav link is clicked", () => {
        renderComponent();

        const learnLink = screen.getByText("Learn");
        expect(learnLink).toBeInTheDocument();

        user.click(learnLink);
        expect(learnLink).toHaveAttribute("href", "/learn");
    });

    it("AB#126 - should navigate to the login page when the Login button is clicked", async () => {
        renderComponent();

        const loginButton = screen.getByText("Login");
        expect(loginButton).toBeInTheDocument();

        await user.click(loginButton);
        expect(mockRouterPush).toHaveBeenCalledWith("/login");
    });
});
