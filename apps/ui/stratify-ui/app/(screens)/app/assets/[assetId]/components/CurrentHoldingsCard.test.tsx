import { describe, vi, beforeEach, expect, it } from "vitest";
import CurrentHoldingsCard, {
    CurrentHoldingsCardProps,
} from "./CurrentHoldingsCard";
import { render, screen } from "@testing-library/react";
import { AssetHolding } from "../hooks/useAssetHoldings";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";

const mockAssetHoldings = [
    {
        shares: 15,
        currentValue: 1664.4,
        currentValueAssetCurrency: 2280,
        averagePricePerShare: 100,
        averagePricePerShareAssetCurrency: 110,
        currentReturn: 164.4,
        currentReturnPercentage: 10.96,
        totalBuyAmount: 1500,
        totalBuyAmountAssetCurrency: 1650,
        portfolioId: 1,
    },
    {
        shares: 10,
        currentValue: 600,
        currentValueAssetCurrency: null,
        averagePricePerShare: 50,
        averagePricePerShareAssetCurrency: null,
        currentReturn: 100,
        currentReturnPercentage: 20,
        totalBuyAmount: 500,
        totalBuyAmountAssetCurrency: 500,
        portfolioId: 2,
    },
] satisfies AssetHolding[];

const defaultProps = {
    assetHoldings: mockAssetHoldings,
    assetCurrency: "USD",
    isLoading: false,
    isHoldingsNotFoundError: false,
} satisfies CurrentHoldingsCardProps;

describe("CurrentHoldingsCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<CurrentHoldingsCardProps>) =>
        render(
            <MockSessionProvider>
                <CurrentHoldingsCard {...defaultProps} {...props} />
            </MockSessionProvider>,
        );

    it("should render the current holdings card correctly", () => {
        renderComponent();

        const labels = [
            "Current Holdings",
            "Portfolios held in",
            "Amount bought",
            "Shares held",
            "Average price per share",
            "Current value",
            "Overall return",
        ];

        labels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        const holdingDetails = [
            "2",
            "2,000 (GBP)",
            "2,150 (USD)",
            "25",
            "150 (GBP)",
            "110 (USD)",
            "2,264.40 (GBP)",
            "2,280 (USD)",
            "+264.40 (GBP)",
            "+13.22%",
        ];

        holdingDetails.forEach((detail) => {
            expect(screen.getByText(detail)).toBeInTheDocument();
        });
    });

    it("should render loading skeletons when isLoading is true", () => {
        renderComponent({ isLoading: true });

        const skeletons = screen.getByTestId("loading-skeletons");
        expect(skeletons).toBeInTheDocument();
    });

    it("should render the no holdings message when isHoldingsNotFoundError is true", () => {
        renderComponent({ isHoldingsNotFoundError: true });

        expect(
            screen.getByText("Asset currently not held in any portfolios"),
        ).toBeInTheDocument();
    });

    it("should render the no holdings message when assetHoldings is empty", () => {
        renderComponent({ assetHoldings: [] });

        expect(
            screen.getByText("Asset currently not held in any portfolios"),
        ).toBeInTheDocument();
    });

    it("should not render asset currency values when the asset currency is the same as the user's default currency", () => {
        renderComponent({
            assetHoldings: [
                {
                    shares: 10,
                    currentValue: 600,
                    currentValueAssetCurrency: null,
                    averagePricePerShare: 50,
                    averagePricePerShareAssetCurrency: null,
                    currentReturn: 100,
                    currentReturnPercentage: 20,
                    totalBuyAmount: 500,
                    totalBuyAmountAssetCurrency: 500,
                    portfolioId: 2,
                },
            ],
            assetCurrency: "GBP",
        });

        expect(screen.queryByText("USD")).not.toBeInTheDocument();
    });
});
