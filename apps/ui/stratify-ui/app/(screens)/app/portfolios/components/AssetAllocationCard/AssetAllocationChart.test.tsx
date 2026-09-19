import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { renderWithContext } from "@/app/tests/utils";
import { mockInvestmentsData } from "../InvestmentsTable/_mocks/mockInvestmentData";
import AssetAllocationChart, {
	type AssetAllocationChartProps,
} from "./AssetAllocationChart";

const defaultProps = {
	data: mockInvestmentsData,
	groupBy: "assetClass",
	isLoading: false,
} satisfies AssetAllocationChartProps;

describe("AssetAllocationChart", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderComponent = (props?: Partial<AssetAllocationChartProps>) => {
		renderWithContext({
			children: (
				<MockSessionProvider>
					<AssetAllocationChart {...defaultProps} {...props} />
				</MockSessionProvider>
			),
		});
	};

	it("should render the chart successfully", async () => {
		renderComponent();

		expect(
			await screen.findByTestId("asset-allocation-chart"),
		).toBeInTheDocument();
		expect(screen.getByTestId("toggle-legend-button")).toBeInTheDocument();
	});

	it("should show the loading state when isLoading is true", async () => {
		renderComponent({ isLoading: true });

		expect(
			await screen.findByTestId("pie-chart-skeleton"),
		).toBeInTheDocument();
	});

	it("should display the legend when the toggle button is clicked", async () => {
		renderComponent();

		const toggleButton = await screen.findByTestId("toggle-legend-button");
		expect(
			screen.queryByTestId("asset-allocation-legend"),
		).not.toBeInTheDocument();

		toggleButton.click();
		expect(
			await screen.findByTestId("asset-allocation-legend"),
		).toBeInTheDocument();
	});

	it("should display different text on the toggle if the legend is visible", async () => {
		renderComponent();

		const toggleButton = await screen.findByTestId("toggle-legend-button");
		expect(toggleButton).toHaveTextContent("View Legend");

		toggleButton.click();

		await waitFor(() => {
			expect(toggleButton).toHaveTextContent("View Pie Chart");
		});
	});
});
