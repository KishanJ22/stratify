import { beforeEach, describe, expect, it, vi } from "vitest";
import ManagePortfolioButton, {
    ManagePortfolioButtonProps,
} from "./ManagePortfolioButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

const mockSetIsManagePortfolioMenuOpen = vi.fn();

const defaultProps = {
    isManagePortfolioMenuOpen: false,
    setIsManagePortfolioMenuOpen: mockSetIsManagePortfolioMenuOpen,
    isLoading: false,
} satisfies ManagePortfolioButtonProps;

describe("ManagePortfolioButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<ManagePortfolioButtonProps>) =>
        render(<ManagePortfolioButton {...defaultProps} {...props} />);

    it("should render the button correctly", () => {
        renderComponent();

        expect(screen.getByTestId("ellipsis")).toBeInTheDocument();
    });

    it("should show the loading skeleton if isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    });

    it("should call setIsManagePortfolioMenuOpen when clicking on the button", async () => {
        renderComponent();

        await user.click(screen.getByTestId("ellipsis"));

        expect(mockSetIsManagePortfolioMenuOpen).toHaveBeenCalled();
    });
});
