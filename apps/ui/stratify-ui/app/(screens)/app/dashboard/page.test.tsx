import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import DashboardPage from "./page";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { mockPortfoliosOverviewData } from "./_mocks/mockPortfoliosOverviewData";
import { TooltipProvider } from "@/app/components/ui/tooltip";

const defaultUseOverviewReturnValues = {
    data: mockPortfoliosOverviewData,
    isLoading: false,
    isPortfoliosNotFoundError: false,
    isInvestmentsNotFoundError: false,
};

const mockUsePortfoliosOverview = vi.fn();

vi.mock("./usePortfoliosOverview", () => ({
    usePortfoliosOverview: () => mockUsePortfoliosOverview(),
}));

const defaultUseGoalReturnValues = {
    data: {
        targetAmount: 10000,
    },
    isLoading: false,
    isGoalNotFoundError: false,
};

const mockUseGoal = vi.fn();

vi.mock("./components/GoalProgressionCard/useGoal", () => ({
    useGoal: () => mockUseGoal(),
}));

describe("DashboardPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TooltipProvider>
                        <DashboardPage />
                    </TooltipProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the page correctly", () => {
        mockUsePortfoliosOverview.mockReturnValue(
            defaultUseOverviewReturnValues,
        );
        mockUseGoal.mockReturnValue(defaultUseGoalReturnValues);

        renderPage();

        expect(screen.getByText("Dashboard")).toBeInTheDocument();

        const cardTitles = [
            "Total Value",
            "Overall Change",
            "Goal Progression",
            "Top Performers",
            "Asset Diversification",
        ];

        cardTitles.forEach((title) =>
            expect(screen.getByText(title)).toBeInTheDocument(),
        );
    });

    it("should show loading states correctly", () => {
        mockUsePortfoliosOverview.mockReturnValue({
            ...defaultUseOverviewReturnValues,
            isLoading: true,
        });
        mockUseGoal.mockReturnValue({
            ...defaultUseGoalReturnValues,
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
            ...defaultUseOverviewReturnValues,
            isPortfoliosNotFoundError: true,
        });
        mockUseGoal.mockReturnValue(defaultUseGoalReturnValues);

        renderPage();

        expect(screen.getByText("Create a portfolio")).toBeInTheDocument();
    });
});
