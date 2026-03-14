import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import PortfolioMetrics from "./PortfolioMetrics";
import { screen } from "@testing-library/react";
import { mockMetricsData } from "./_mocks/mockMetricsData";

const defaultHookReturnValues = {
    data: mockMetricsData,
    isLoading: false,
};

const mockUsePortfolioMetrics = vi.fn();

vi.mock("./usePortfolioMetrics", () => ({
    usePortfolioMetrics: () => mockUsePortfolioMetrics(),
}));

describe("PortfolioMetrics", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        renderWithContext({
            children: (
                <TooltipProvider>
                    <MockSessionProvider>
                        <PortfolioMetrics portfolioId={1} />
                    </MockSessionProvider>
                </TooltipProvider>
            ),
        });
    };

    it("should render the metrics with data", () => {
        mockUsePortfolioMetrics.mockReturnValue(defaultHookReturnValues);

        renderComponent();

        expect(screen.getByText("Overall return")).toBeInTheDocument();
        expect(screen.getByText("+5%")).toBeInTheDocument();
        expect(screen.getByText("+5,000 (GBP)")).toBeInTheDocument();
        expect(
            screen.getByTestId("chart-column-increasing"),
        ).toBeInTheDocument();

        expect(screen.getByText("Overall risk")).toBeInTheDocument();
        expect(screen.getByText("Portfolio volatility")).toBeInTheDocument();
        expect(screen.getByText("Sortino ratio")).toBeInTheDocument();
        expect(screen.getByText("Risk level")).toBeInTheDocument();

        expect(screen.getByText("10%")).toBeInTheDocument();
        expect(screen.getByText("1.5")).toBeInTheDocument();
        expect(screen.getByText("Low")).toBeInTheDocument();
    });

    it("should render the loading state when data is loading", () => {
        mockUsePortfolioMetrics.mockReturnValue({
            ...defaultHookReturnValues,
            isLoading: true,
        });

        renderComponent();

        const titleSkeletons = screen.getAllByTestId(
            "portfolio-metric-card-title-skeleton",
        );

        const valueSkeletons = screen.getAllByTestId(
            "portfolio-metric-card-value-skeleton",
        );

        expect(titleSkeletons.length).toBeGreaterThanOrEqual(2);
        expect(valueSkeletons.length).toBeGreaterThanOrEqual(2);
    });

    it("should display placeholder text if data is unavailable", () => {
        mockUsePortfolioMetrics.mockReturnValue({
            ...defaultHookReturnValues,
            data: undefined,
        });

        renderComponent();

        expect(screen.getByText("Overall return")).toBeInTheDocument();
        expect(screen.getByText("Overall risk")).toBeInTheDocument();
        expect(screen.getAllByText("---").length).toBeGreaterThanOrEqual(2);
    });

    it("should display the correct text colour and icon for positive returns", () => {
        mockUsePortfolioMetrics.mockReturnValue(defaultHookReturnValues);

        renderComponent();

        const overallReturnElement = screen.getByTestId("overall-return");

        expect(overallReturnElement).toHaveClass("text-positive-base");
        expect(
            screen.getByTestId("chart-column-increasing"),
        ).toBeInTheDocument();
    });

    it("should display the correct text colour and icon for negative returns", () => {
        mockUsePortfolioMetrics.mockReturnValue({
            ...defaultHookReturnValues,
            data: {
                ...mockMetricsData,
                overallReturn: {
                    absolute: -5000,
                    percentage: -5,
                },
            },
        });

        renderComponent();

        const overallReturnElement = screen.getByTestId("overall-return");

        expect(overallReturnElement).toHaveClass("text-negative-base");
        expect(
            screen.getByTestId("chart-column-decreasing"),
        ).toBeInTheDocument();
    });
});
