import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "./page";

describe("Landing page", () => {
    const renderPage = () => render(<LandingPage />);

    it("should render page correctly", () => {
        renderPage();

        expect(
            screen.getByText("Real-time Portfolio Tracking"),
        ).toBeInTheDocument();
        expect(screen.getByText("Trading Simulator")).toBeInTheDocument();
        expect(screen.getByText("Stratify Learn")).toBeInTheDocument();
    });
});
