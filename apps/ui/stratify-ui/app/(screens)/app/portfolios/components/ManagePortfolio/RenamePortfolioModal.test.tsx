import { beforeEach, describe, expect, it, vi } from "vitest";
import RenamePortfolioModal, {
    RenamePortfolioModalProps,
} from "./RenamePortfolioModal";
import userEvent from "@testing-library/user-event";
import { renderWithContext } from "@/app/tests/utils";
import { screen } from "@testing-library/react";

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
    },
}));

const mockMutate = vi.fn();
const mockIsPending = vi.fn();

const mockUseRenamePortfolio = {
    mutate: mockMutate,
    isPending: mockIsPending,
};

vi.mock("./useRenamePortfolio", () => ({
    useRenamePortfolio: () => mockUseRenamePortfolio,
}));

const mockHandleClose = vi.fn();
const mockSetSelectedPortfolioName = vi.fn();

const defaultProps = {
    isOpen: true,
    handleClose: mockHandleClose,
    selectedPortfolioId: 1,
    selectedPortfolioName: "Main",
    setSelectedPortfolioName: mockSetSelectedPortfolioName,
} satisfies RenamePortfolioModalProps;

const user = userEvent.setup();

describe("RenamePortfolioModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderModal = (props?: Partial<RenamePortfolioModalProps>) =>
        renderWithContext({
            children: <RenamePortfolioModal {...defaultProps} {...props} />,
        });

    it("should render the modal when isOpen is true", () => {
        renderModal();

        const translationKeys = [
            "Portfolios.renamePortfolioModal.title",
            "Portfolios.renamePortfolioModal.nameLabel",
            "Generic.save",
        ];

        translationKeys.forEach((key) =>
            expect(screen.getByText(key)).toBeInTheDocument(),
        );
    });

    it("should close the modal when clicking on the cross icon", async () => {
        renderModal();

        const crossIcon = screen.getByTestId("close-modal-icon");

        await user.click(crossIcon);

        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("should rename the portfolio when clicking on the Save button", async () => {
        renderModal();

        const nameInput = screen.getByTestId("name");
        const saveButton = screen.getByText("Generic.save");

        await user.type(nameInput, "technology portfolio");
        await user.click(saveButton);

        expect(mockMutate).toHaveBeenCalled();
    });
});
