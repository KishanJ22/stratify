import { renderWithContext } from "@/app/tests/utils";
import { describe, expect, it, beforeEach, vi } from "vitest";
import PortfolioValueChart from "./PortfolioValueChart";
import { screen } from "@testing-library/react";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { PortfolioValueHistory } from "./usePortfolioValueHistory";
import { TooltipProvider } from "@/app/components/ui/tooltip";

const mockPortfolioValueHistoryData = [
    {
        date: new Date(new Date().setDate(new Date().getDate() - 2))
            .toISOString()
            .split("T")[0],
        portfolioValue: 10000,
    },
    {
        date: new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .split("T")[0],
        portfolioValue: 10500,
    },
    {
        date: new Date().toISOString().split("T")[0],
        portfolioValue: 11000,
    },
] satisfies PortfolioValueHistory[];

const defaultHookReturnValues = {
    data: mockPortfolioValueHistoryData,
    isLoading: false,
};

const mockUsePortfolioValueHistory = vi.fn();

vi.mock("./usePortfolioValueHistory", () => ({
    usePortfolioValueHistory: () => mockUsePortfolioValueHistory(),
}));

describe("PortfolioValueChart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (portfolioId = 1) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TooltipProvider>
                        <PortfolioValueChart portfolioId={portfolioId} />
                    </TooltipProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the component successfully", () => {
        mockUsePortfolioValueHistory.mockReturnValue(defaultHookReturnValues);

        renderComponent();

        const selectedDateRange = screen.getByTestId("date-range-select-value");

        expect(screen.getByText("Portfolio value")).toBeInTheDocument();
        expect(selectedDateRange).toHaveTextContent("Last 30 days");
        expect(screen.getByText("11,000")).toBeInTheDocument();

        expect(screen.getByText("(GBP)")).toBeInTheDocument();

        expect(screen.getByText("+10.00%")).toBeInTheDocument();
        expect(screen.getByText("in the past thirty days")).toBeInTheDocument();
    });

    it("should render the loading state when data is loading", () => {
        mockUsePortfolioValueHistory.mockReturnValue({
            ...defaultHookReturnValues,
            isLoading: true,
        });

        renderComponent();

        expect(
            screen.getByTestId("portfolio-value-chart-skeleton"),
        ).toBeInTheDocument();
    });

    it("should render the placeholder chart when no data is available", () => {
        mockUsePortfolioValueHistory.mockReturnValue({
            ...defaultHookReturnValues,
            data: [],
        });

        renderComponent();

        expect(screen.getByText("No data available")).toBeInTheDocument();
    });
});
