import { beforeEach, describe, expect, it, vi } from "vitest";
import { MarketDataTab } from "../MarketDataTabs";
import { renderWithContext } from "@/app/tests/utils";
import MarketDataTable from "./MarketDataTable";
import { screen } from "@testing-library/react";
import { paths } from "@/openapi/types/stratify-api";

type Asset =
    paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

const mockResponseData = [
    {
        name: "Apple Inc.",
        symbol: "AAPL",
        assetType: "STOCK",
        marketState: "REGULAR",
        currency: "USD",
        priceDetails: {
            currentPrice: 150.25,
            volume: 1000000,
            priceChange: 2.5,
            priceChangePercent: 1.69,
        },
    },
] satisfies Asset[];

const mockUseTopGainers = vi.fn();

const mockUseTopLosers = vi.fn();

vi.mock("../hooks/useTopGainers", () => ({
    useTopGainers: () => mockUseTopGainers(),
}));

vi.mock("../hooks/useTopLosers", () => ({
    useTopLosers: () => mockUseTopLosers(),
}));

describe("MarketDataTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (selectedTab: MarketDataTab) => {
        renderWithContext({
            children: <MarketDataTable selectedTab={selectedTab} />,
        });
    };

    it("render table with data", () => {
        mockUseTopGainers.mockReturnValue({
            data: mockResponseData,
            isLoading: false,
        });

        renderComponent("topGainers");

        const tableHeaders = [
            "Asset Name",
            "Asset Type",
            "Market State",
            "Current Price",
            "Volume (24 hours)",
            "Change (24 hours)",
        ];

        tableHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        const assetRow = [
            "Apple Inc. (AAPL)",
            "Stock",
            "Open",
            "150.25 (USD)",
            "1,000,000",
            "+ 2.5",
            "+ 1.69%",
        ];

        assetRow.forEach((cell) => {
            expect(screen.getByText(cell)).toBeInTheDocument();
        });
    });

    it("renders loading state when data is loading", () => {
        mockUseTopGainers.mockReturnValue({
            data: mockResponseData,
            isLoading: true,
        });

        renderComponent("topGainers");

        const tableHeaders = [
            "Asset Name",
            "Asset Type",
            "Market State",
            "Current Price",
            "Volume (24 hours)",
            "Change (24 hours)",
        ];

        tableHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        expect(screen.getAllByTestId("skeleton-row")).toHaveLength(5);
    });

    it("renders no data message when there is no data", () => {
        mockUseTopGainers.mockReturnValue({
            data: [],
            isLoading: false,
        });

        renderComponent("topGainers");

        const tableHeaders = [
            "Asset Name",
            "Asset Type",
            "Market State",
            "Current Price",
            "Volume (24 hours)",
            "Change (24 hours)",
        ];

        tableHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        expect(screen.getByText("No results.")).toBeInTheDocument();
    });

    it("renders only the selected tab's data", () => {
        mockUseTopGainers.mockReturnValue({
            data: mockResponseData,
            isLoading: false,
        });

        renderComponent("topLosers");

        const tableHeaders = [
            "Asset Name",
            "Asset Type",
            "Market State",
            "Current Price",
            "Volume (24 hours)",
            "Change (24 hours)",
        ];

        tableHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });
});
