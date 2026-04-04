import { describe, vi, beforeEach, expect, it } from "vitest";
import { mockStockAssetDetails } from "../_mocks/mockStockAssetDetails";
import { render, screen } from "@testing-library/react";
import AssetActivityCard, { AssetActivityCardProps } from "./AssetActivityCard";

const defaultProps = {
    asset: mockStockAssetDetails,
    isLoading: false,
} satisfies AssetActivityCardProps;

describe("AssetActivityCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<AssetActivityCardProps>) =>
        render(<AssetActivityCard {...defaultProps} {...props} />);

    it("should render the asset activity card correctly with pricing details", () => {
        renderComponent();

        const labels = [
            "Asset Activity (last 24 hours)",
            "Open",
            "Close",
            "High",
            "Low",
            "Change",
            "Trading volume",
        ];

        labels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        const details = [
            "149 (USD)",
            "150 (USD)",
            "151 (USD)",
            "148.75 (USD)",
            "+1.18%",
            "75,000,000",
        ];

        details.forEach((detail) => {
            expect(screen.getByText(detail)).toBeInTheDocument();
        });
    });

    it("should render the loading skeletons when isLoading is true", () => {
        renderComponent({ isLoading: true });

        const skeletons = screen.getByTestId("loading-skeletons");
        expect(skeletons).toBeInTheDocument();
    });

    it("should not render pricing details when they are not available", () => {
        renderComponent({
            asset: undefined,
        });

        expect(screen.queryByText("Open")).not.toBeInTheDocument();
        expect(screen.queryByText("Close")).not.toBeInTheDocument();
        expect(screen.queryByText("High")).not.toBeInTheDocument();
        expect(screen.queryByText("Low")).not.toBeInTheDocument();
        expect(screen.queryByText("Change")).not.toBeInTheDocument();
        expect(screen.queryByText("Trading volume")).not.toBeInTheDocument();
    });

    it("should render the correct chart icon if the price change is positive", () => {
        renderComponent();

        expect(
            screen.getByTestId("chart-column-increasing"),
        ).toBeInTheDocument();
    });

    it("should render the correct chart icon if the price change is negative", () => {
        renderComponent({
            asset: {
                ...mockStockAssetDetails,
                dayTradingActivity: {
                    ...mockStockAssetDetails.dayTradingActivity,
                    priceChangePercent: -1.18,
                },
            },
        });

        expect(
            screen.getByTestId("chart-column-decreasing"),
        ).toBeInTheDocument();
    });

    it("should render the correct chart icon if there is no price change", () => {
        renderComponent({
            asset: {
                ...mockStockAssetDetails,
                dayTradingActivity: {
                    ...mockStockAssetDetails.dayTradingActivity,
                    priceChangePercent: 0,
                },
            },
        });

        expect(screen.getByTestId("chart-column")).toBeInTheDocument();
    });
});
