import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import DashboardPage from "./page";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { mockPortfoliosOverviewData } from "./_mocks/mockPortfoliosOverviewData";

const defaultHookReturnValues = {
    data: mockPortfoliosOverviewData,
    isLoading: false,
    isPortfoliosNotFoundError: false,
    isInvestmentsNotFoundError: false,
};

const mockUsePortfoliosOverview = vi.fn();

vi.mock("./usePortfoliosOverview", () => ({
    usePortfoliosOverview: () => mockUsePortfoliosOverview(),
}));

describe("DashboardPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <DashboardPage />
                </MockSessionProvider>
            ),
        });

    it("should render the page correctly", () => {
        mockUsePortfoliosOverview.mockReturnValue(defaultHookReturnValues);
        renderPage();

        expect(screen.getByText("Dashboard")).toBeInTheDocument();

        const cardTitles = [
            "Total value",
            "Overall change",
            "Goal progression",
        ];

        cardTitles.forEach((title) =>
            expect(screen.getByText(title)).toBeInTheDocument(),
        );
    });

    it("should show loading states correctly", () => {
        mockUsePortfoliosOverview.mockReturnValue({
            ...defaultHookReturnValues,
            isLoading: true,
        });

        renderPage();

        const loadingSkeletons = [
            "total-value-skeleton",
            "overall-change-skeleton",
            "goal-progression-skeleton",
        ];

        loadingSkeletons.forEach((testId) =>
            expect(screen.getByTestId(testId)).toBeInTheDocument(),
        );
    });

    it("should display create portfolio link if the user has no portfolios", () => {
        mockUsePortfoliosOverview.mockReturnValue({
            ...defaultHookReturnValues,
            isPortfoliosNotFoundError: true,
        });

        renderPage();

        expect(screen.getByText("Create a portfolio")).toBeInTheDocument();
    });

    it("should display placeholder data if the user has no investments", async () => {
        mockUsePortfoliosOverview.mockReturnValue({
            ...defaultHookReturnValues,
            isInvestmentsNotFoundError: true,
        });

        renderPage();

        const placeholderElements = await screen.findAllByText("---");
        expect(placeholderElements).toHaveLength(4);
    });
});
