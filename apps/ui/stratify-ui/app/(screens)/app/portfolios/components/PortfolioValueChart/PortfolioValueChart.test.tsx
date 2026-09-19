import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { renderWithContext } from "@/app/tests/utils";
import { mockMetricsData } from "../PortfolioMetrics/_mocks/mockMetricsData";
import PortfolioValueChart from "./PortfolioValueChart";
import type { PortfolioValueHistory } from "./usePortfolioValueHistory";

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

const defaultPortfolioMetricsHookReturnValues = {
	data: mockMetricsData,
	isLoading: false,
};

const mockUsePortfolioMetrics = vi.fn();

vi.mock("../PortfolioMetrics/usePortfolioMetrics", () => ({
	usePortfolioMetrics: () => mockUsePortfolioMetrics(),
}));

describe("PortfolioValueChart", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderComponent = () =>
		renderWithContext({
			children: (
				<MockSessionProvider>
					<TooltipProvider>
						<PortfolioValueChart portfolioId={1} />
					</TooltipProvider>
				</MockSessionProvider>
			),
		});

	it("should render the component successfully", () => {
		mockUsePortfolioValueHistory.mockReturnValue(defaultHookReturnValues);
		mockUsePortfolioMetrics.mockReturnValue(
			defaultPortfolioMetricsHookReturnValues,
		);

		renderComponent();

		const selectedDateRange = screen.getByTestId("date-range-select-value");

		expect(screen.getByText("Portfolio value")).toBeInTheDocument();
		expect(selectedDateRange).toHaveTextContent("Last 30 days");
		expect(screen.getByText("100,000")).toBeInTheDocument();

		expect(screen.getByText("(GBP)")).toBeInTheDocument();
		expect(screen.getByText("in the past thirty days")).toBeInTheDocument();
	});

	it("should render the loading state when data is loading", () => {
		mockUsePortfolioValueHistory.mockReturnValue({
			...defaultHookReturnValues,
			isLoading: true,
		});
		mockUsePortfolioMetrics.mockReturnValue({
			...defaultPortfolioMetricsHookReturnValues,
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
		mockUsePortfolioMetrics.mockReturnValue({
			...defaultPortfolioMetricsHookReturnValues,
			data: {},
		});

		renderComponent();

		expect(screen.getByText("No data available")).toBeInTheDocument();
	});
});
