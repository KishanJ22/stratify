import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockInvestmentsData } from "../../../portfolios/components/InvestmentsTable/_mocks/mockInvestmentData";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { TopPerformersCardProps } from "./TopPerformersCard";
import TopPerformersTable from "./TopPerformersTable";

const defaultProps = {
    investments: mockInvestmentsData,
    isLoading: false,
} satisfies TopPerformersCardProps;

describe("TopPerformersTable", () => {
    const renderComponent = (props?: Partial<TopPerformersCardProps>) =>
        render(
            <MockSessionProvider>
                <TooltipProvider>
                    <TopPerformersTable {...defaultProps} {...props} />
                </TooltipProvider>
            </MockSessionProvider>,
        );

    it("should render the table successfully", () => {
        renderComponent();

        const columnHeaders = ["Name", "Type", "Value (GBP)", "Return (GBP)"];

        columnHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        const investmentRow = [
            "Leonida Inc.",
            "Test Portfolio",
            "Stock",
            "2,219.2",
            "+ 1,489.2",
            "+ 204%",
        ];

        investmentRow.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it("should render the loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(screen.getAllByTestId("skeleton-row")).toHaveLength(5);
    });

    it("should render placeholder data when there are no investments", () => {
        renderComponent({ investments: [] });

        expect(screen.getAllByText("No investments found")).toHaveLength(5);
    });

    it("should filter out investments with negative returns", () => {
        renderComponent();

        expect(screen.queryByText("Apple Inc.")).not.toBeInTheDocument();
    });

    it("should render placeholder data when all investments have negative returns", () => {
        renderComponent({ investments: [mockInvestmentsData[1]] });

        expect(screen.getAllByText("No investments found")).toHaveLength(5);
    });

    it("should display a link to view the portfolio an investment is in", () => {
        renderComponent();

        expect(screen.getByText("View Portfolio")).toBeInTheDocument();

        const portfolioLink = screen.getByText("View Portfolio").closest("a");

        expect(portfolioLink).toHaveAttribute(
            "href",
            "/app/portfolios?portfolioId=1",
        );
    });
});
