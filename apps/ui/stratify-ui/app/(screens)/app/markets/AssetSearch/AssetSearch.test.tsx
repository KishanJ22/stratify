import { renderWithContext } from "@/app/tests/utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AssetSearch from "./AssetSearch";
import { screen } from "@testing-library/react";
import type { AssetSearchItemProps } from "./AssetSearchItem";
import { SearchAsset } from "./useAssetSearch";

const user = userEvent.setup();

vi.mock("./AssetSearchItem", () => {
    return {
        default: ({ asset }: AssetSearchItemProps) => (
            <div data-testid="asset-search-item">
                {asset.name} ({asset.symbol})
            </div>
        ),
    };
});

const mockSearch = vi.fn();
const mockResetSearch = vi.fn();
const mockIsSearching = vi.fn();
const mockSearchStatus = vi.fn();
const mockIsNoResultsFound = vi.fn();

const mockUseAssetSearch = () => ({
    searchResults: [
        {
            id: 1,
            name: "Apple Inc.",
            symbol: "AAPL",
            assetType: "STOCK",
            currentPrice: 150.25,
            priceChangePercent: 1.5,
            priceChange: 2.25,
            currency: "USD",
        },
    ] satisfies SearchAsset[],
    isSearching: mockIsSearching(),
    search: mockSearch,
    resetSearch: mockResetSearch,
    searchStatus: mockSearchStatus(),
    isNoResultsFound: mockIsNoResultsFound(),
});

vi.mock("./useAssetSearch", () => {
    return {
        useAssetSearch: () => mockUseAssetSearch(),
    };
});

describe("AssetSearch", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () =>
        renderWithContext({
            children: <AssetSearch />,
        });

    it("should render the search button", () => {
        renderComponent();

        const searchButton = screen.getByText("Search");

        expect(searchButton).toBeInTheDocument();
    });

    it("should open the search popover when clicking on the search button", async () => {
        renderComponent();

        const searchButton = screen.getByText("Search");

        await user.click(searchButton);

        expect(
            screen.getByPlaceholderText("Search for an asset..."),
        ).toBeInTheDocument();
    });

    it("should display the loading state when searching", async () => {
        mockIsSearching.mockReturnValue(true);
        renderComponent();

        const searchButton = screen.getByText("Search");

        await user.click(searchButton);

        const searchInput = screen.getByPlaceholderText(
            "Search for an asset...",
        );

        await user.type(searchInput, "AAPL");

        await screen.findByTestId("loading-state");
    });

    it("should display search results", async () => {
        mockIsSearching.mockReturnValue(false);
        mockSearchStatus.mockReturnValue("success");

        renderComponent();

        const searchButton = screen.getByText("Search");

        await user.click(searchButton);

        const searchInput = screen.getByPlaceholderText(
            "Search for an asset...",
        );

        await user.type(searchInput, "AAPL");

        expect(
            await screen.findByTestId("asset-search-item"),
        ).toBeInTheDocument();
    });

    it("should display no results message when no assets are found", async () => {
        mockIsSearching.mockReturnValue(false);
        mockSearchStatus.mockReturnValue("error");
        mockIsNoResultsFound.mockReturnValue(true);

        renderComponent();

        const searchButton = screen.getByText("Search");

        await user.click(searchButton);

        const searchInput = screen.getByPlaceholderText(
            "Search for an asset...",
        );

        await user.type(searchInput, "AAPL");

        expect(await screen.findByText("No assets found.")).toBeInTheDocument();
    });
});
