import { describe, expect, it } from "vitest";
import TotalValueCard, { TotalValueCardProps } from "./TotalValueCard";
import { renderWithContext } from "@/app/tests/utils";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { screen } from "@testing-library/react";

const defaultProps = {
    isLoading: false,
    totalValue: 100000,
    isPortfoliosNotFoundError: false,
    isInvestmentsNotFoundError: false,
} satisfies TotalValueCardProps;

describe("TotalValueCard", () => {
    const renderComponent = (props?: Partial<TotalValueCardProps>) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TotalValueCard {...defaultProps} {...props} />
                </MockSessionProvider>
            ),
        });

    it("should render the total value card successfully", () => {
        renderComponent();

        expect(screen.getByText("Total Value")).toBeInTheDocument();
        expect(screen.getByText("100,000 (GBP)")).toBeInTheDocument();
    });

    it("should show the loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(screen.getByTestId("total-value-skeleton")).toBeInTheDocument();
    });

    it("should show the create portfolio link when the user has no portfolios", async () => {
        renderComponent({ isPortfoliosNotFoundError: true });

        expect(screen.getByText("Create a portfolio")).toBeInTheDocument();
    });

    it("should show the add investment link when the user has portfolios but no investments", () => {
        renderComponent({ isInvestmentsNotFoundError: true });

        expect(screen.getByText("Add an investment")).toBeInTheDocument();
    });
});
