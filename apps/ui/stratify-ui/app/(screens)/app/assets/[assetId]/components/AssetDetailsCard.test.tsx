import { describe, vi, beforeEach, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockStockAssetDetails } from "../_mocks/mockStockAssetDetails";
import { mockFundAssetDetails } from "../_mocks/mockFundAssetDetails";
import { mockCryptocurrencyAssetDetails } from "../_mocks/mockCryptocurrencyAssetDetails";
import AssetDetailsCard, { AssetDetailsCardProps } from "./AssetDetailsCard";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";

const user = userEvent.setup();

const mockSetIsSectorsModalOpen = vi.fn();

const defaultProps = {
    asset: mockStockAssetDetails,
    setIsSectorsModalOpen: mockSetIsSectorsModalOpen,
    isLoading: false,
} satisfies AssetDetailsCardProps;

describe("AssetDetailsCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<AssetDetailsCardProps>) =>
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <AssetDetailsCard {...defaultProps} {...props} />
            </NextIntlClientProvider>,
        );

    it("should render the asset details card correctly for a stock asset", () => {
        renderComponent();

        const labels = [
            "Asset Details",
            "Asset type",
            "Market state",
            "Country",
            "Industry",
            "Sector",
        ];

        labels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        const details = [
            "countries.1",
            "Stock",
            "Open",
            "Consumer Electronics",
            "technology",
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

    it("should render the view sectors button when the asset is a fund", () => {
        renderComponent({
            asset: mockFundAssetDetails,
        });

        expect(screen.getByText("Sectors")).toBeInTheDocument();
        const viewSectorsButton = screen.getByTestId("view-sectors-button");
        expect(viewSectorsButton).toBeInTheDocument();
    });

    it("should not render the country, industry and sector information for a cryptocurrency asset", () => {
        renderComponent({
            asset: mockCryptocurrencyAssetDetails,
        });

        expect(screen.queryByText("Country")).not.toBeInTheDocument();
        expect(screen.queryByText("Industry")).not.toBeInTheDocument();
        expect(screen.queryByText("Sector")).not.toBeInTheDocument();
    });

    it("should call setIsSectorsModalOpen with true when clicking the view sectors button", async () => {
        renderComponent({
            asset: mockFundAssetDetails,
        });

        const viewSectorsButton = screen.getByTestId("view-sectors-button");
        await user.click(viewSectorsButton);

        expect(mockSetIsSectorsModalOpen).toHaveBeenCalledWith(true);
    });
});
