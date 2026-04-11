import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TopPerformersCard, { TopPerformersCardProps } from "./TopPerformersCard";
import { mockInvestmentsData } from "../../../portfolios/components/InvestmentsTable/_mocks/mockInvestmentData";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { renderWithContext } from "@/app/tests/utils";

const defaultProps = {
    investments: mockInvestmentsData,
    isLoading: false,
    isPortfoliosNotFoundError: false,
    isInvestmentsNotFoundError: false,
} satisfies TopPerformersCardProps;

describe("TopPerformersCard", () => {
    const renderComponent = (props?: Partial<TopPerformersCardProps>) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TooltipProvider>
                        <TopPerformersCard {...defaultProps} {...props} />
                    </TooltipProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the card successfully", () => {
        renderComponent();

        expect(screen.getByText("Top Performers")).toBeInTheDocument();
        expect(
            screen.getByText(
                "View the investments that are performing the best across all of your portfolios.",
            ),
        ).toBeInTheDocument();

        const investmentRow = [
            "Leonida Inc.",
            "Test Portfolio",
            "Stock",
            "2,219.2",
            "+1,489.2",
            "+204%",
        ];

        investmentRow.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });
});
