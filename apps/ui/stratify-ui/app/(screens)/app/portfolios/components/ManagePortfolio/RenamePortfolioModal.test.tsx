import { beforeEach, describe, expect, it, vi } from "vitest";
import RenamePortfolioModal, {
    RenamePortfolioModalProps,
} from "./RenamePortfolioModal";
import userEvent from "@testing-library/user-event";
import { renderWithContext } from "@/app/tests/utils";
import { fireEvent, screen } from "@testing-library/react";
import { toast } from "sonner";

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

    it("should rename the portfolio successfully when clicking on the Save button", async () => {
        renderModal();

        const nameInput = screen.getByTestId("name-input");
        await user.clear(nameInput);
        await user.type(nameInput, "technology portfolio");
        fireEvent.blur(nameInput);

        await user.click(screen.getByText("Generic.save"));

        const [, { onSuccess }] = mockMutate.mock.calls[0];
        onSuccess({ response: { status: 204 } });

        expect(mockSetSelectedPortfolioName).toHaveBeenCalledWith(
            "technology portfolio",
        );

        expect(toast.success).toHaveBeenCalledWith(
            "Portfolios.renamePortfolioModal.portfolioRenamedSuccess",
        );
        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("should show an error message if the portfolio name already exists", async () => {
        renderModal();

        const nameInput = screen.getByTestId("name-input");
        await user.clear(nameInput);
        await user.type(nameInput, "technology portfolio");
        fireEvent.blur(nameInput);

        await user.click(screen.getByText("Generic.save"));

        const [, { onError }] = mockMutate.mock.calls[0];
        await onError({
            response: { status: 400 },
            data: Promise.resolve({ message: "portfolioNameAlreadyExists" }),
        });

        expect(mockSetSelectedPortfolioName).not.toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();

        expect(
            await screen.findByText("Portfolios.portfolioNameAlreadyExists"),
        ).toBeInTheDocument();
    });
});
