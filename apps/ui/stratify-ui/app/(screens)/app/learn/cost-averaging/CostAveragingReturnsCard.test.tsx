import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockReturns } from "./_mocks/mockChartData";
import CostAveragingReturnsCard, {
    CostAveragingReturnsCardProps,
} from "./CostAveragingReturnsCard";

const defaultProps = {
    returns: mockReturns,
    isLoading: false,
} satisfies CostAveragingReturnsCardProps;

describe("CostAveragingReturnsCard", () => {
    const renderComponent = (props?: Partial<CostAveragingReturnsCardProps>) =>
        render(<CostAveragingReturnsCard {...defaultProps} {...props} />);

    it("should render the card successfully", () => {
        renderComponent();

        const headings = ["Lump sum", "Cost averaging"];

        headings.forEach((heading) => {
            expect(screen.getByText(heading)).toBeInTheDocument();
        });

        const absoluteReturns = ["+575", "+900"];

        absoluteReturns.forEach((returnValue) => {
            expect(screen.getByText(returnValue)).toBeInTheDocument();
        });

        const percentageReturns = ["+57.5%", "+90%"];

        percentageReturns.forEach((returnValue) => {
            expect(screen.getByText(returnValue)).toBeInTheDocument();
        });
    });

    it("should show the loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(
            screen.getAllByTestId("simulation-return-loading-skeleton"),
        ).toHaveLength(2);
    });
});
