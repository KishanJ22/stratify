import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PortfoliosPage from "./page";
import { renderWithContext } from "@/app/tests/utils";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { CreatePortfolioModalProps } from "./components/CreatePortfolio/CreatePortfolioModal";

const mockGetSearchParam = vi.fn();

const mockUseSearchParams = {
    get: mockGetSearchParam,
};

vi.mock("next/navigation", () => ({
    useSearchParams: () => mockUseSearchParams,
}));

vi.mock("./components/CreatePortfolio/CreatePortfolioModal", () => ({
    default: ({ isOpen }: CreatePortfolioModalProps) => {
        if (isOpen) {
            return <div>CreatePortfolioModal</div>;
        }
    },
}));

describe("Portfolios page", () => {
    const renderPage = () =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TooltipProvider>
                        <PortfoliosPage />
                    </TooltipProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the portfolios page", () => {
        renderPage();

        expect(screen.getByText("Portfolios")).toBeInTheDocument();
        expect(screen.getByText("Investments")).toBeInTheDocument();
    });

    it("should open the create portfolio modal when the create search param is true", async () => {
        mockGetSearchParam.mockReturnValue("true");

        renderPage();

        expect(
            await screen.findByText("CreatePortfolioModal"),
        ).toBeInTheDocument();
    });
});
