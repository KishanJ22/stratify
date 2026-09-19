import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { renderWithContext } from "@/app/tests/utils";
import { mockInvestmentsData } from "../../../portfolios/components/InvestmentsTable/_mocks/mockInvestmentData";
import TopPerformersCard, {
	type TopPerformersCardProps,
} from "./TopPerformersCard";

const defaultProps = {
	investments: mockInvestmentsData,
	isLoading: false,
	isPortfoliosNotFoundError: false,
	isInvestmentsNotFoundError: false,
} satisfies TopPerformersCardProps;

describe("TopPerformersCard", () => {
	const renderComponent = (props?: Partial<TopPerformersCardProps>) =>
		renderWithContext({
			children: (
				<MockSessionProvider>
					<TooltipProvider>
						<TopPerformersCard {...defaultProps} {...props} />
					</TooltipProvider>
				</MockSessionProvider>
			),
		});

	it("should render the card successfully", () => {
		renderComponent();

		expect(
			screen.getByText("Dashboard.topPerformers.title"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Dashboard.topPerformers.description"),
		).toBeInTheDocument();

		const investmentRow = [
			"Leonida Inc.",
			"Test Portfolio",
			"Stock",
			"2,219.2",
		];

		investmentRow.forEach((text) => {
			expect(screen.getByText(text)).toBeInTheDocument();
		});
	});
});
