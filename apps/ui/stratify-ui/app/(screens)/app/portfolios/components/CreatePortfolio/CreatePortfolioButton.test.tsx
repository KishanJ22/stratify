import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePortfolioButton from "./CreatePortfolioButton";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSetIsCreatePortfolioModalOpen = vi.fn();

const defaultProps = {
    setIsCreatePortfolioModalOpen: mockSetIsCreatePortfolioModalOpen,
};

const user = userEvent.setup();

describe("CreatePortfolioButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props = defaultProps) =>
        renderWithContext({
            children: <CreatePortfolioButton {...props} />,
        });

    it("should render the create portfolio button", () => {
        renderComponent();

        const button = screen.getByText("Portfolios.createPortfolio");
        expect(button).toBeInTheDocument();
        const plusIcon = screen.getByTestId("plus");
        expect(plusIcon).toBeInTheDocument();
    });

    it("should open the create portfolio modal when clicking the button", async () => {
        renderComponent();

        const button = screen.getByText("Portfolios.createPortfolio");

        await user.click(button);

        expect(mockSetIsCreatePortfolioModalOpen).toHaveBeenCalledTimes(1);
        expect(mockSetIsCreatePortfolioModalOpen).toHaveBeenCalledWith(true);
    });
});
