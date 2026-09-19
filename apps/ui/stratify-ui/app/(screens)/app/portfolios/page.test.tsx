import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { renderWithContext } from "@/app/tests/utils";
import type { CreatePortfolioModalProps } from "./components/CreatePortfolio/CreatePortfolioModal";
import PortfoliosPage from "./page";

const mockGetSearchParam = vi.fn();
const mockRouterPush = vi.fn();

const mockUseSearchParams = {
	get: mockGetSearchParam,
};

const mockUseRouter = {
	push: mockRouterPush,
};

vi.mock("next/navigation", () => ({
	useSearchParams: () => mockUseSearchParams,
	useRouter: () => mockUseRouter,
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

		expect(screen.getByText("Portfolios.title")).toBeInTheDocument();
		expect(screen.getByText("Investments.title")).toBeInTheDocument();
	});

	it("should open the create portfolio modal when the create search param is true", async () => {
		mockGetSearchParam.mockReturnValue("true");

		renderPage();

		expect(
			await screen.findByText("CreatePortfolioModal"),
		).toBeInTheDocument();
	});
});
