import { describe, expect, it, vi } from "vitest";
import MarketDataTabs, { MarketDataTabsProps } from "./MarketDataTabs";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("MarketDataTabs", () => {
    const renderComponent = ({
        selectedTab,
        setSelectedTab,
    }: MarketDataTabsProps) => {
        render(
            <MarketDataTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />,
        );
    };

    it("renders the tabs correctly", () => {
        const mockSetSelectedTab = vi.fn();

        renderComponent({
            selectedTab: "topGainers",
            setSelectedTab: mockSetSelectedTab,
        });

        expect(screen.getByText("Top Gainers")).toBeInTheDocument();
        expect(screen.getByText("Top Losers")).toBeInTheDocument();
        expect(screen.getByText("Most Active")).toBeInTheDocument();
    });

    it("calls setSelectedTab when a tab is clicked", async () => {
        const mockSetSelectedTab = vi.fn();

        renderComponent({
            selectedTab: "topGainers",
            setSelectedTab: mockSetSelectedTab,
        });

        const topLosersTab = screen.getByText("Top Losers");

        await user.click(topLosersTab);

        await waitFor(() => {
            expect(mockSetSelectedTab).toHaveBeenCalledWith("topLosers");
        });
    });

    it("does not call setSelectedTab when the same tab is clicked", async () => {
        const mockSetSelectedTab = vi.fn();

        renderComponent({
            selectedTab: "topGainers",
            setSelectedTab: mockSetSelectedTab,
        });

        const topGainersTab = screen.getByText("Top Gainers");

        await user.click(topGainersTab);

        await waitFor(() => {
            expect(mockSetSelectedTab).not.toHaveBeenCalled();
        });
    });
});
