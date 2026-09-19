import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import DeletePortfolioModal, {
    DeletePortfolioModalProps,
} from "./DeletePortfolioModal";

vi.mock("next-intl", () =>
    import("@/app/tests/_mocks/mockTranslations").then((m) =>
        m.mockNextIntlFactory(),
    ),
);

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
    },
}));

const mockMutate = vi.fn();
const mockIsPending = vi.fn();

const mockUseDeletePortfolio = {
    mutate: mockMutate,
    isPending: mockIsPending,
};

vi.mock("./useDeletePortfolio", () => ({
    useDeletePortfolio: () => mockUseDeletePortfolio,
}));

const mockHandleClose = vi.fn();
const mockSetSelectedPortfolioId = vi.fn();
const mockSetSelectedPortfolioName = vi.fn();

const defaultProps = {
    isOpen: true,
    handleClose: mockHandleClose,
    selectedPortfolioId: 1,
    selectedPortfolioName: "Main",
    setSelectedPortfolioId: mockSetSelectedPortfolioId,
    setSelectedPortfolioName: mockSetSelectedPortfolioName,
} satisfies DeletePortfolioModalProps;

const user = userEvent.setup();

describe("DeletePortfolioModal", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderModal = (props?: Partial<DeletePortfolioModalProps>) =>
        renderWithContext({
            children: <DeletePortfolioModal {...defaultProps} {...props} />,
        });

    it("should render the modal when isOpen is true", () => {
        renderModal();

        const translationKeys = [
            "Portfolios.deletePortfolioModal.title",
            "Portfolios.deletePortfolioModal.descriptionLineOne",
            "Portfolios.deletePortfolioModal.descriptionLineTwo",
            "Portfolios.deletePortfolioModal.goBack",
            "Portfolios.deletePortfolioModal.deletePortfolio",
        ];

        translationKeys.forEach((key) =>
            expect(screen.getByText(key)).toBeInTheDocument(),
        );
    });

    it("should display the portfolio name correctly", () => {
        renderModal();

        expect(
            screen.getByText(`"portfolioName":"Main"`, { exact: false }),
        ).toBeInTheDocument();
    });

    it("should close the modal when clicking on the cross icon", async () => {
        renderModal();

        const crossIcon = screen.getByTestId("close-modal-icon");

        await user.click(crossIcon);

        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("should close the modal when clicking on the go back button", async () => {
        renderModal();

        const goBackButton = screen.getByTestId("go-back-button");

        await user.click(goBackButton);

        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("should delete the portfolio when clicking on the delete portfolio button", async () => {
        renderModal();

        const deletePortfolioButton = screen.getByTestId(
            "delete-portfolio-button",
        );

        await user.click(deletePortfolioButton);

        expect(mockMutate).toHaveBeenCalled();
    });

    it("should show a loading spinner when clicking on the delete portfolio button", async () => {
        mockIsPending.mockReturnValue(true);
        renderModal();

        const deletePortfolioButton = screen.getByTestId(
            "delete-portfolio-button",
        );

        await user.click(deletePortfolioButton);

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should not show the modal when isOpen is false", () => {
        renderModal({ isOpen: false });

        expect(
            screen.queryByText("Portfolios.deletePortfolioModal.title"),
        ).not.toBeInTheDocument();
    });

    it("should set the portfolio states correctly when the deletion is successful", async () => {
        renderModal();

        const deletePortfolioButton = screen.getByTestId(
            "delete-portfolio-button",
        );

        await user.click(deletePortfolioButton);

        const [, { onSuccess }] = mockMutate.mock.calls[0];
        onSuccess({ response: { status: 204 } });

        expect(mockSetSelectedPortfolioId).toHaveBeenCalledWith(null);
        expect(mockSetSelectedPortfolioName).toHaveBeenCalledWith("");
        expect(toast.success).toHaveBeenCalledWith(
            "Portfolios.deletePortfolioModal.portfolioDeletedSuccess",
        );
        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("should not reset portfolio states when the response status is not 204", async () => {
        renderModal();

        const deletePortfolioButton = screen.getByTestId(
            "delete-portfolio-button",
        );

        await user.click(deletePortfolioButton);

        const [, { onSuccess }] = mockMutate.mock.calls[0];
        onSuccess({ response: { status: 200 } });

        expect(mockSetSelectedPortfolioId).not.toHaveBeenCalled();
        expect(mockSetSelectedPortfolioName).not.toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();
        expect(mockHandleClose).toHaveBeenCalled();
    });
});
