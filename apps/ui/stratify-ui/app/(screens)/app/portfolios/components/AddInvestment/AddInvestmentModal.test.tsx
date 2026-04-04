import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddInvestmentModal, {
    AddInvestmentModalProps,
} from "./AddInvestmentModal";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";

const mockHandleClose = vi.fn();

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

const user = userEvent.setup();

describe("AddInvestmentModal", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderModal = ({
        portfolioId,
        isOpen,
        handleClose,
    }: AddInvestmentModalProps) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <AddInvestmentModal
                        portfolioId={portfolioId}
                        isOpen={isOpen}
                        handleClose={handleClose}
                    />
                </MockSessionProvider>
            ),
        });

    it("should render the modal when isOpen is true", () => {
        renderModal({
            portfolioId: 1,
            isOpen: true,
            handleClose: mockHandleClose,
        });

        expect(screen.getByTestId("modal-title")).toBeInTheDocument();
        expect(screen.getByTestId("modal-description")).toBeInTheDocument();
    });

    it("should not render the modal when isOpen is false", () => {
        renderModal({
            portfolioId: 1,
            isOpen: false,
            handleClose: mockHandleClose,
        });

        expect(screen.queryByTestId("modal-title")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("modal-description"),
        ).not.toBeInTheDocument();
    });

    it("should call handleClose when the close icon is clicked", async () => {
        renderModal({
            portfolioId: 1,
            isOpen: true,
            handleClose: mockHandleClose,
        });

        const closeIcon = screen.getByTestId("close-modal-icon");
        await user.click(closeIcon);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it("should display the correct fields in the form", () => {
        renderModal({
            portfolioId: 1,
            isOpen: true,
            handleClose: mockHandleClose,
        });

        expect(screen.getByTestId("asset-name-field")).toBeInTheDocument();
        expect(screen.getByTestId("trade-date-field")).toBeInTheDocument();
        expect(screen.getByTestId("price-per-share-field")).toBeInTheDocument();
        expect(screen.getByTestId("quantity-field")).toBeInTheDocument();
        expect(screen.getByTestId("fee-field")).toBeInTheDocument();
        expect(screen.getByText("Subtotal")).toBeInTheDocument();
        expect(screen.getByText("Total")).toBeInTheDocument();
    });
});
