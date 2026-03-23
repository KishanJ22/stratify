import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePortfolioModal, {
    CreatePortfolioModalProps,
} from "./CreatePortfolioModal";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockHandleClose = vi.fn();
const mockSetSelectedPortfolioId = vi.fn();

const defaultProps = {
    isOpen: true,
    handleClose: mockHandleClose,
    setSelectedPortfolioId: mockSetSelectedPortfolioId,
} satisfies CreatePortfolioModalProps;

const user = userEvent.setup();

describe("CreatePortfolioModal", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderModal = (props?: Partial<CreatePortfolioModalProps>) =>
        renderWithContext({
            children: <CreatePortfolioModal {...defaultProps} {...props} />,
        });

    it("Should render the modal when isOpen is true", () => {
        renderModal();

        expect(screen.getByText("Create Portfolio")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Add and monitor your investments by creating a portfolio.",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Main Portfolio"),
        ).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
    });

    it("Should not render the modal when isOpen is false", () => {
        renderModal({ isOpen: false });

        expect(screen.queryByText("Create Portfolio")).not.toBeInTheDocument();
    });

    it("Should call handleClose when the close icon is clicked", async () => {
        renderModal();

        const closeIcon = screen.getByTestId("close-modal-icon");
        await user.click(closeIcon);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
});
