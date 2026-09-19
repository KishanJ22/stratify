import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import ManagePortfolioMenu, {
	type ManagePortfolioMenuProps,
} from "./ManagePortfolioMenu";

const user = userEvent.setup();

const mockSetIsRenamePortfolioModalOpen = vi.fn();
const mockSetIsDeletePortfolioModalOpen = vi.fn();

const defaultProps = {
	isManagePortfolioMenuOpen: true,
	setIsRenamePortfolioModalOpen: mockSetIsRenamePortfolioModalOpen,
	setIsDeletePortfolioModalOpen: mockSetIsDeletePortfolioModalOpen,
} satisfies ManagePortfolioMenuProps;

describe("ManagePortfolioMenu", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderComponent = (props?: Partial<ManagePortfolioMenuProps>) =>
		renderWithContext({
			children: <ManagePortfolioMenu {...defaultProps} {...props} />,
		});

	it("should render the menu correctly", () => {
		renderComponent();

		expect(
			screen.getByText("Portfolios.renamePortfolio"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Portfolios.deletePortfolio"),
		).toBeInTheDocument();
	});

	it("should call the correct function when the rename portfolio button is pressed", async () => {
		renderComponent();

		await user.click(screen.getByText("Portfolios.renamePortfolio"));

		expect(mockSetIsRenamePortfolioModalOpen).toHaveBeenCalled();
	});

	it("should call the correct function when the delete portfolio button is pressed", async () => {
		renderComponent();

		await user.click(screen.getByText("Portfolios.deletePortfolio"));

		expect(mockSetIsDeletePortfolioModalOpen).toHaveBeenCalled();
	});
});
