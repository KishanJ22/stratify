import { describe, expect, beforeEach, vi, it } from "vitest";
import AssetPage from "./page";
import { renderWithContext } from "@/app/tests/utils";
import { mockStockAssetDetails } from "./_mocks/mockStockAssetDetails";
import { mockAssetHoldings } from "./_mocks/mockAssetHoldings";
import { screen } from "@testing-library/react";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { mockAssetPriceHistory } from "./_mocks/mockAssetPriceHistory";
import { TooltipProvider } from "@/app/components/ui/tooltip";

const mockUseParams = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockUseAssetDetails = vi.fn();

vi.mock("./hooks/useAssetDetails", () => ({
    useAssetDetails: (assetId: number) => mockUseAssetDetails(assetId),
}));

const mockUseAssetCurrentPrice = vi.fn();

vi.mock("./hooks/useAssetCurrentPrice", () => ({
    useAssetCurrentPrice: (assetId: number) =>
        mockUseAssetCurrentPrice(assetId),
}));

const mockUseAssetPriceHistory = vi.fn();

vi.mock("./hooks/useAssetPriceHistory", () => ({
    useAssetPriceHistory: (assetId: number) =>
        mockUseAssetPriceHistory(assetId),
}));

const mockUseAssetHoldings = vi.fn();

vi.mock("./hooks/useAssetHoldings", () => ({
    useAssetHoldings: (assetId: number) => mockUseAssetHoldings(assetId),
}));

const mockUsePortfolioList = vi.fn();

vi.mock(
    "../../portfolios/components/SelectedPortfolio/usePortfolioList",
    () => ({
        usePortfolioList: () => mockUsePortfolioList(),
    }),
);

describe("AssetPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TooltipProvider>
                        <AssetPage />
                    </TooltipProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the page successfully", () => {
        mockUseParams.mockReturnValue({ assetId: "1" });
        mockUseAssetDetails.mockReturnValue({
            data: mockStockAssetDetails,
            isLoading: false,
        });
        mockUseAssetHoldings.mockReturnValue({
            data: mockAssetHoldings,
            isLoading: false,
            isHoldingsNotFoundError: false,
        });
        mockUsePortfolioList.mockReturnValue({
            data: [{ id: 1, name: "Main Portfolio" }],
            isLoading: false,
        });
        mockUseAssetPriceHistory.mockReturnValue({
            data: mockAssetPriceHistory,
            isLoading: false,
        });
        mockUseAssetCurrentPrice.mockReturnValue({
            data: {
                price: 110,
            },
            isLoading: false,
        });

        renderPage();

        expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
        expect(screen.getByText("AAPL")).toBeInTheDocument();

        const cardTitles = [
            "Current Holdings",
            "Add to a Portfolio",
            "Asset Activity (last 24 hours)",
            "Asset price",
            "Asset Details",
        ];

        cardTitles.forEach((title) => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });
    });

    it("should render the loading state correctly", () => {
        mockUseParams.mockReturnValue({ assetId: "1" });

        mockUseAssetDetails.mockReturnValue({
            data: null,
            isLoading: true,
        });

        mockUseAssetHoldings.mockReturnValue({
            data: [],
            isLoading: true,
            isHoldingsNotFoundError: false,
        });
        mockUsePortfolioList.mockReturnValue({
            data: [],
            isLoading: true,
        });

        renderPage();

        expect(
            screen.getByTestId("asset-name-symbol-skeleton"),
        ).toBeInTheDocument();
    });
});
