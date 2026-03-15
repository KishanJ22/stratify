import { beforeEach, describe, expect, it, vi } from "vitest";
import InvestmentsTable from "./InvestmentsTable";
import { renderWithContext } from "@/app/tests/utils";
import { screen } from "@testing-library/react";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { mockInvestmentsData } from "./_mocks/mockInvestmentData";

const mockUseInvestmentsList = vi.fn();

vi.mock("./useInvestmentsList", () => ({
    useInvestmentsList: () => mockUseInvestmentsList(),
}));

describe("InvestmentsTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        renderWithContext({
            children: (
                <TooltipProvider>
                    <MockSessionProvider>
                        <InvestmentsTable portfolioId={1} />
                    </MockSessionProvider>
                </TooltipProvider>
            ),
        });
    };

    it("should render the table with data", () => {
        mockUseInvestmentsList.mockReturnValue({
            data: mockInvestmentsData,
            isLoading: false,
        });

        renderComponent();

        const tableHeaders = [
            "Asset Name",
            "Shares",
            "Asset Type",
            "Current Value (GBP)",
            "Return (GBP)",
        ];

        tableHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        const firstAssetRow = [
            "Leonida Inc. (LEON)",
            "20",
            "2,219.2",
            "+ 1,489.2",
            "+ 204%",
        ];

        firstAssetRow.forEach((cell) => {
            expect(screen.getByText(cell)).toBeInTheDocument();
        });

        const secondAssetRow = [
            "Apple Inc. (AAPL)",
            "10",
            "1,500",
            "-500",
            "-25%",
        ];

        secondAssetRow.forEach((cell) => {
            expect(screen.getByText(cell)).toBeInTheDocument();
        });

        expect(screen.getAllByText("Stock")).toHaveLength(2);
    });

    it("should render the no results component when there are no investments", () => {
        mockUseInvestmentsList.mockReturnValue({
            data: [],
            isLoading: false,
        });

        renderComponent();

        expect(
            screen.getByText("No investments found for this portfolio."),
        ).toBeInTheDocument();
    });

    it("should render the loading state when data is loading", () => {
        mockUseInvestmentsList.mockReturnValue({
            data: [],
            isLoading: true,
        });

        renderComponent();

        const tableHeaders = [
            "Asset Name",
            "Shares",
            "Asset Type",
            "Current Value (GBP)",
            "Return (GBP)",
        ];

        tableHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        expect(screen.getAllByTestId("skeleton-row")).toHaveLength(5);
    });

    it("should display a tooltip if the currency of an investment is different from the user's currency", () => {
        mockUseInvestmentsList.mockReturnValue({
            data: mockInvestmentsData,
            isLoading: false,
        });

        renderComponent();

        const tooltipIcons = screen.getAllByTestId("asset-currency-info-icon");

        expect(tooltipIcons).toHaveLength(2);
    });
});
