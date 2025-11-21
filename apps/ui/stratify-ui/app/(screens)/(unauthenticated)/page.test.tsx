import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingPage from "./page";
import userEvent from "@testing-library/user-event";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

const user = userEvent.setup();

describe("Landing page", () => {
    const renderPage = () => render(<LandingPage />);

    it("AB#127 - should display the headline", () => {
        renderPage();

        expect(
            screen.getByText("All of your investments."),
        ).toBeInTheDocument();

        expect(screen.getByText("One place.")).toBeInTheDocument();
    });

    it("should display the call to action buttons", () => {
        renderPage();

        expect(screen.getByText("Get Started")).toBeInTheDocument();
        expect(screen.getByText("Learn More")).toBeInTheDocument();
    });

    it("AB#128 - Sign up should direct to the sign up page", async () => {
        renderPage();

        const signUpButton = screen.getByText("Get Started");
        expect(signUpButton).toBeInTheDocument();

        await user.click(signUpButton);
        expect(mockRouterPush).toHaveBeenCalledWith("/sign-up");
    });

    it("AB#129 - should display the key features", () => {
        renderPage();

        const keyFeatureTitles = [
            "Real-time Portfolio Tracking",
            "Trading Simulator",
            "Stratify Learn",
        ];

        keyFeatureTitles.forEach((title) => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });

        const keyFeatureDescriptions = [
            "Monitor and analyse all of your stock and cryptocurrency holdings in one place with live updates and intuitive performance metrics.",
            "Practice trading in realistic market scenarios without risking real money. Learn by doing, build confidence through personal feedback.",
            "Discover core concepts and real-world scenarios that help build practical investing skills through interactive and bite-sized lessons.",
        ];

        keyFeatureDescriptions.forEach((description) => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });
});
