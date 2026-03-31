import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSimulationResults } from "./_mocks/mockChartData";
import { render, screen } from "@testing-library/react";
import CostAveragingSimulatorChart, {
    CostAveragingSimulatorChartProps,
} from "./CostAveragingSimulatorChart";

const defaultProps = {
    data: mockSimulationResults,
    isLoading: false,
} satisfies CostAveragingSimulatorChartProps;

describe("CostAveragingSimulatorChart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (
        props?: Partial<CostAveragingSimulatorChartProps>,
    ) => render(<CostAveragingSimulatorChart {...defaultProps} {...props} />);

    it("should render the chart successfully with data", async () => {
        renderComponent();

        expect(
            await screen.findByTestId("cost-averaging-simulator-chart"),
        ).toBeInTheDocument();
    });

    it("should render the loading skeleton when loading", async () => {
        renderComponent({ isLoading: true });

        expect(
            await screen.findByTestId(
                "cost-averaging-simulator-chart-skeleton",
            ),
        ).toBeInTheDocument();
    });
});
