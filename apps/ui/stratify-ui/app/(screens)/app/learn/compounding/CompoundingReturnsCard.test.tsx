import { describe, expect, it } from "vitest";
import CompoundingReturnsCard, {
    CompoundingReturnsCardProps,
} from "./CompoundingReturnsCard";
import { render, screen } from "@testing-library/react";
import { mockReturns } from "./_mocks/mockChartData";

const defaultProps = {
    returns: mockReturns,
    isLoading: false,
} satisfies CompoundingReturnsCardProps;

describe("CompoundingReturnsCard", () => {
    const renderComponent = (props?: Partial<CompoundingReturnsCardProps>) =>
        render(<CompoundingReturnsCard {...defaultProps} {...props} />);

    it("should render the card successfully", () => {
        renderComponent();

        const headings = [
            "No compounding",
            "Compounding",
            "Compounding with dividends",
        ];

        headings.forEach((heading) => {
            expect(screen.getByText(heading)).toBeInTheDocument();
        });

        const absoluteReturns = ["0", "+575", "+900"];

        absoluteReturns.forEach((returnValue) => {
            expect(screen.getByText(returnValue)).toBeInTheDocument();
        });

        const percentageReturns = ["0%", "+57.5%", "+90%"];

        percentageReturns.forEach((returnValue) => {
            expect(screen.getByText(returnValue)).toBeInTheDocument();
        });
    });

    it("should show the loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(
            screen.getAllByTestId("simulation-return-loading-skeleton"),
        ).toHaveLength(3);
    });
});
