import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSimulationResults } from "./_mocks/mockChartData";
import CompoundingSimulatorChart, {
    CompoundingSimulatorChartProps,
} from "./CompoundingSimulatorChart";
import { render, screen } from "@testing-library/react";

const defaultProps = {
    data: mockSimulationResults,
    isLoading: false,
} satisfies CompoundingSimulatorChartProps;

describe("CompoundingSimulatorChart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<CompoundingSimulatorChartProps>) =>
        render(<CompoundingSimulatorChart {...defaultProps} {...props} />);

    it("should render the chart successfully with data", async () => {
        renderComponent();

        expect(
            await screen.findByTestId("compounding-simulator-chart"),
        ).toBeInTheDocument();
    });

    it("should render the loading skeleton when loading", async () => {
        renderComponent({ isLoading: true });

        expect(
            await screen.findByTestId("compounding-simulator-chart-skeleton"),
        ).toBeInTheDocument();
    });
});
