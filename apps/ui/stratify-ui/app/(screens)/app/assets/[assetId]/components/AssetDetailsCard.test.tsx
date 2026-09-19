import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import messages from "@/messages/en/messages.json";
import { mockCryptocurrencyAssetDetails } from "../_mocks/mockCryptocurrencyAssetDetails";
import { mockFundAssetDetails } from "../_mocks/mockFundAssetDetails";
import { mockStockAssetDetails } from "../_mocks/mockStockAssetDetails";
import AssetDetailsCard, {
	type AssetDetailsCardProps,
} from "./AssetDetailsCard";

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
			"Technology",
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
