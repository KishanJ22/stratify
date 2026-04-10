import { describe, expect, it } from "vitest";
import OverallChangeCard, { OverallChangeCardProps } from "./OverallChangeCard";
import { render, screen } from "@testing-library/react";

const defaultProps = {
    overallChange: {
        lastThirtyDays: {
            absolute: 0,
            percentage: 0,
        },
        lastSixMonths: {
            absolute: -2000,
            percentage: -20,
        },
        allTime: {
            absolute: 5000,
            percentage: 50,
        },
    },
    isLoading: false,
    isInvestmentsNotFoundError: false,
    isPortfoliosNotFoundError: false,
} satisfies OverallChangeCardProps;

describe("OverallChangeCard", () => {
    const renderComponent = (props?: Partial<OverallChangeCardProps>) =>
        render(<OverallChangeCard {...defaultProps} {...props} />);

    it("should render the overall change card successfully", () => {
        renderComponent();

        const valueLabels = ["Last 30 days", "Last 6 months", "All time"];

        valueLabels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        const values = ["0%", "-20%", "+50%"];
        values.forEach((value) => {
            expect(screen.getByText(value)).toBeInTheDocument();
        });
    });

    it("should render the loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(
            screen.getByTestId("overall-change-skeleton"),
        ).toBeInTheDocument();
    });

    it("should render placeholder values when the user has no portfolios", () => {
        renderComponent({ isPortfoliosNotFoundError: true });

        const emptyValues = screen.getAllByText("---");
        expect(emptyValues).toHaveLength(3);

        const chartColumns = screen.getAllByTestId("chart-column-not-found");
        expect(chartColumns).toHaveLength(3);
    });

    it("should render placeholder values when the user has no investments", () => {
        renderComponent({ isInvestmentsNotFoundError: true });

        const emptyValues = screen.getAllByText("---");
        expect(emptyValues).toHaveLength(3);

        const chartColumns = screen.getAllByTestId("chart-column-not-found");
        expect(chartColumns).toHaveLength(3);
    });

    it("should render the correct icons based on the value change", () => {
        renderComponent();

        expect(
            screen.getByTestId("chart-column-increasing-positive"),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("chart-column-decreasing-negative"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("chart-column")).toBeInTheDocument();
    });

    it("should render placeholder values when there is a null value", () => {
        renderComponent({
            overallChange: {
                ...defaultProps.overallChange,
                lastThirtyDays: {
                    absolute: null,
                    percentage: null,
                },
            },
        });

        const emptyValues = screen.getAllByText("---");
        expect(emptyValues).toHaveLength(1);

        const chartColumn = screen.getByTestId("chart-column-not-found");
        expect(chartColumn).toBeInTheDocument();
    });
});
