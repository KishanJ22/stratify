import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LearnPage from "./page";
import userEvent from "@testing-library/user-event";

const mockNextPush = vi.fn();

const mockUseRouter = {
    push: mockNextPush,
};

vi.mock("next/navigation", () => ({
    useRouter: () => mockUseRouter,
}));

const user = userEvent.setup();

describe("LearnPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () => render(<LearnPage />);

    it("should render the learn page successfully", () => {
        renderPage();

        expect(screen.getByText("Learn")).toBeInTheDocument();

        const learnCardTitles = [
            "Compounding",
            "Cost Averaging",
            "Diversification",
            "Trading Simulator",
        ];

        learnCardTitles.forEach((title) =>
            expect(screen.getByText(title)).toBeInTheDocument(),
        );
    });

    it("should navigate to the correct page when opening a learn card", async () => {
        renderPage();

        const compoundingCard = screen.getByText("Compounding");
        const compoundingButton = within(
            compoundingCard.parentElement!,
        ).getByTestId("learn-card-button");

        await user.click(compoundingButton);

        expect(mockNextPush).toHaveBeenCalledWith("/app/learn/compounding");
    });

    it("should not navigate to a page when attempting to open a coming soon card", async () => {
        renderPage();

        const diversificationCard = screen.getByText("Diversification");
        const diversificationButton = within(
            diversificationCard.parentElement!,
        ).getByTestId("learn-card-button-disabled");

        await user.click(diversificationButton);

        expect(mockNextPush).not.toHaveBeenCalled();
    });
});
