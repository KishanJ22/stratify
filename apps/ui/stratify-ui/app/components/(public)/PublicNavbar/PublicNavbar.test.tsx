import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockNextLink } from "@/app/tests/_mocks/mockNextLink";
import Navbar from "./PublicNavbar";

// Mock Image component from next/image
vi.mock("next/image", () => ({
    default: (props: { alt?: string }) => <img alt={props.alt} />,
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

        const navLinks = ["Home", "Features", "Login", "Sign Up"];

        navLinks.forEach((link) => {
            expect(screen.getByText(link)).toBeInTheDocument();
        });
    });

    it("AB#126 - should navigate to the Features page when the Features nav link is clicked", () => {
        renderComponent();

        const featuresLink = screen.getByText("Features");
        expect(featuresLink).toBeInTheDocument();

        user.click(featuresLink);
        expect(featuresLink).toHaveAttribute("href", "/features");
    });

    it("AB#126 - should navigate to the login page when the Login button is clicked", async () => {
        renderComponent();

        const loginButton = screen.getByText("Login");
        expect(loginButton).toBeInTheDocument();

        await user.click(loginButton);
        expect(loginButton.closest("a")).toHaveAttribute("href", "/login");
    });

    it("should navigate to the sign-up page when the Sign Up button is clicked", async () => {
        renderComponent();

        const signUpButton = screen.getByText("Sign Up");
        expect(signUpButton).toBeInTheDocument();

        await user.click(signUpButton);
        expect(signUpButton.closest("a")).toHaveAttribute("href", "/sign-up");
    });
});
