import { describe, vi, beforeEach, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AssetPriceHistoryChart, {
    AssetPriceHistoryChartProps,
} from "./AssetPriceHistoryChart";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { mockAssetPriceHistory } from "../_mocks/mockAssetPriceHistory";

const mockUseAssetPriceHistory = vi.fn();
const mockUseAssetCurrentPrice = vi.fn();

vi.mock("../hooks/useAssetPriceHistory", () => ({
    useAssetPriceHistory: () => mockUseAssetPriceHistory(),
}));

vi.mock("../hooks/useAssetCurrentPrice", () => ({
    useAssetCurrentPrice: () => mockUseAssetCurrentPrice(),
}));

const defaultProps = {
    assetId: 1,
    assetCurrency: "USD",
    isAssetDetailsLoading: false,
} satisfies AssetPriceHistoryChartProps;

describe("AssetPriceHistoryChart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<AssetPriceHistoryChartProps>) =>
        render(
            <TooltipProvider>
                <AssetPriceHistoryChart {...defaultProps} {...props} />
            </TooltipProvider>,
        );

    it("should render the chart successfully", () => {
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

        renderComponent();

        expect(screen.getByText("Asset price")).toBeInTheDocument();
        expect(screen.getByText("110")).toBeInTheDocument();
        expect(screen.getByText("(USD)")).toBeInTheDocument();
        expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    });

    it("should render the loading skeletons when isLoading is true", () => {
        mockUseAssetPriceHistory.mockReturnValue({
            data: [],
            isLoading: true,
        });

        mockUseAssetCurrentPrice.mockReturnValue({
            data: {},
            isLoading: true,
        });

        renderComponent({ isAssetDetailsLoading: true });

        expect(
            screen.getByTestId("portfolio-value-chart-skeleton"),
        ).toBeInTheDocument();
    });

    it("should render the placeholder chart when no data is available", () => {
        mockUseAssetPriceHistory.mockReturnValue({
            data: [],
            isLoading: false,
        });

        mockUseAssetCurrentPrice.mockReturnValue({
            data: {},
            isLoading: false,
        });

        renderComponent();

        expect(screen.getByText("No data available")).toBeInTheDocument();
    });
});
