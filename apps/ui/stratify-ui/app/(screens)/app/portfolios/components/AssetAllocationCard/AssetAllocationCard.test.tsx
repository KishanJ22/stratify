import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import { screen } from "@testing-library/react";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import AssetAllocationCard from "./AssetAllocationCard";
import { mockInvestmentsData } from "../InvestmentsTable/_mocks/mockInvestmentData";

const mockUseInvestmentsList = vi.fn();

vi.mock("./useInvestmentsList", () => ({
    useInvestmentsList: () => mockUseInvestmentsList(),
}));

describe("AssetAllocationCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        renderWithContext({
            children: (
                <TooltipProvider>
                    <MockSessionProvider>
                        <AssetAllocationCard portfolioId={1} />
                    </MockSessionProvider>
                </TooltipProvider>
            ),
        });
    };

    it("should render the card successfully", async () => {
        mockUseInvestmentsList.mockReturnValue({
            data: mockInvestmentsData,
            isLoading: false,
        });

        renderComponent();

        expect(screen.getByText("Asset Allocation")).toBeInTheDocument();
        expect(screen.getByText("Group by:")).toBeInTheDocument();
        expect(screen.getByTestId("group-by-select-value")).toBeInTheDocument();
        expect(
            await screen.findByTestId("asset-allocation-chart"),
        ).toBeInTheDocument();
    });

    it("should disable the group by selector if there are no current investments", async () => {
        mockUseInvestmentsList.mockReturnValue({
            data: [],
            isLoading: false,
        });

        renderComponent();

        expect(
            await screen.findByTestId("group-by-select-disabled"),
        ).toBeInTheDocument();
    });

    it("should disable the group by selector when data is loading", async () => {
        mockUseInvestmentsList.mockReturnValue({
            data: [],
            isLoading: true,
        });

        renderComponent();

        expect(
            await screen.findByTestId("group-by-select-disabled"),
        ).toBeInTheDocument();
    });

    it("should show the loading skeleton when data is loading", async () => {
        mockUseInvestmentsList.mockReturnValue({
            data: [],
            isLoading: true,
        });

        renderComponent();

        expect(
            await screen.findByTestId("pie-chart-skeleton"),
        ).toBeInTheDocument();
    });
});
