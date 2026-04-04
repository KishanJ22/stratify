import { describe, vi, beforeEach, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AddAssetToPortfolio, {
    AddAssetToPortfolioProps,
} from "./AddAssetToPortfolio";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { mockAssetHoldings } from "../_mocks/mockAssetHoldings";
import userEvent from "@testing-library/user-event";

const mockSetSelectedPortfolioId = vi.fn();
const mockSetIsAddInvestmentModalOpen = vi.fn();
const mockSetIsAddTradeModalOpen = vi.fn();

const user = userEvent.setup();

const defaultProps = {
    assetHoldings: mockAssetHoldings,
    portfolioList: [
        {
            id: 1,
            name: "Main Portfolio",
        },
        {
            id: 2,
            name: "Secondary Portfolio",
        },
        {
            id: 3,
            name: "Tech Stocks",
        },
    ],
    assetCurrency: "USD",
    isLoading: false,
    selectedPortfolioId: 1,
    setSelectedPortfolioId: mockSetSelectedPortfolioId,
    setIsAddInvestmentModalOpen: mockSetIsAddInvestmentModalOpen,
    setIsAddTradeModalOpen: mockSetIsAddTradeModalOpen,
} satisfies AddAssetToPortfolioProps;

describe("AddAssetToPortfolio", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<AddAssetToPortfolioProps>) =>
        render(
            <MockSessionProvider>
                <AddAssetToPortfolio {...defaultProps} {...props} />
            </MockSessionProvider>,
        );

    it("should render the add asset to portfolio card correctly", () => {
        renderComponent();

        const labels = [
            "Add to a Portfolio",
            "Portfolio",
            "Current value",
            "Shares held",
            "Current return",
        ];

        labels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        const details = [
            "Main Portfolio",
            "1,664.40 (GBP)",
            "2,280 (USD)",
            "15",
            "+ 164.40 (GBP)",
            "+ 10.96%",
        ];

        details.forEach((detail) => {
            expect(screen.getByText(detail)).toBeInTheDocument();
        });
    });

    it("should render loading skeletons when isLoading is true", () => {
        renderComponent({ isLoading: true });

        const skeletons = screen.getByTestId("loading-skeletons");
        expect(skeletons).toBeInTheDocument();
    });

    it("should display the asset not in portfolio message when there are no asset holdings for the portfolio selected", () => {
        renderComponent({
            selectedPortfolioId: 3,
        });

        expect(
            screen.getByText("Asset currently not in portfolio"),
        ).toBeInTheDocument();
    });

    it("should render add trade to portfolio button when asset is already held in the selected portfolio", () => {
        renderComponent();

        const addTradeButton = screen.getByText("Add trade to portfolio");
        expect(addTradeButton).toBeInTheDocument();
    });

    it("should set isAddTradeModalOpen to true when add trade to portfolio button is clicked", async () => {
        renderComponent();

        const addTradeButton = screen.getByText("Add trade to portfolio");
        await user.click(addTradeButton);

        expect(mockSetIsAddTradeModalOpen).toHaveBeenCalledWith(true);
    });

    it("should render add investment to portfolio button when the asset is not currently held in the selected portfolio", () => {
        renderComponent({
            selectedPortfolioId: 3,
        });

        const addInvestmentButton = screen.getByText(
            "Add investment to portfolio",
        );
        expect(addInvestmentButton).toBeInTheDocument();
    });

    it("should set isAddInvestmentModalOpen to true when add investment to portfolio button is clicked", async () => {
        renderComponent({
            selectedPortfolioId: 3,
        });

        const addInvestmentButton = screen.getByText(
            "Add investment to portfolio",
        );
        await user.click(addInvestmentButton);

        expect(mockSetIsAddInvestmentModalOpen).toHaveBeenCalledWith(true);
    });
});
