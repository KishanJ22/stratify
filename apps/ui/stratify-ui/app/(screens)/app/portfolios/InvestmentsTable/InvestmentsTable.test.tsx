import { beforeEach, describe, expect, it, vi } from "vitest";
import InvestmentsTable, { Investment } from "./InvestmentsTable";
import { renderWithContext } from "@/app/tests/utils";
import { screen } from "@testing-library/react";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";

const mockInvestmentsData = [
    {
        assetId: 1,
        symbol: "LEON",
        assetCountryId: 224,
        assetCurrency: "USD",
        name: "Leonida Inc.",
        shares: 20,
        type: "STOCK",
        currentValue: 2219.2,
        currentAssetCurrencyValue: 3040,
        currentReturn: 1489.2,
        currentReturnPercentage: 204,
    },
] satisfies Investment[];

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

        const assetRow = [
            "Leonida Inc. (LEON)",
            "20",
            "Stock",
            "2,219.2",
            "+ 1,489.2",
            "+ 204%",
        ];

        assetRow.forEach((cell) => {
            expect(screen.getByText(cell)).toBeInTheDocument();
        });
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

        const tooltipIcon = screen.getByTestId("asset-currency-info-icon");

        expect(tooltipIcon).toBeInTheDocument();
    });
});
