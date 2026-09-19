import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import { mockSearchAsset } from "./_mocks/mockAssetSearch";
import AssetSearch from "./AssetSearch";
import type { AssetSearchItemProps } from "./AssetSearchItem";

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
	searchResults: [mockSearchAsset],
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
