import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddTradeModal, { AddTradeModalProps } from "./AddTradeModal";
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

const mockAsset = {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    assetCurrency: "USD",
};

const defaultProps = {
    portfolioId: 1,
    asset: mockAsset,
    isOpen: true,
    handleClose: mockHandleClose,
} satisfies AddTradeModalProps;

describe("AddTradeModal", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderModal = (props?: Partial<AddTradeModalProps>) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <AddTradeModal {...defaultProps} {...props} />
                </MockSessionProvider>
            ),
        });

    it("should render the modal when isOpen is true", () => {
        renderModal();

        expect(screen.getByTestId("modal-title")).toBeInTheDocument();
        expect(screen.getByTestId("modal-description")).toBeInTheDocument();
    });

    it("should not render the modal when isOpen is false", () => {
        renderModal({ isOpen: false });

        expect(screen.queryByTestId("modal-title")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("modal-description"),
        ).not.toBeInTheDocument();
    });

    it("should call handleClose when the close icon is clicked", async () => {
        renderModal();

        const closeButton = screen.getByTestId("close-modal-icon");
        await user.click(closeButton);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it("should display the correct fields in the form", () => {
        renderModal();

        expect(screen.getByTestId("asset-name-field")).toBeInTheDocument();
        expect(screen.getByTestId("trade-date-field")).toBeInTheDocument();
        expect(screen.getByTestId("price-per-share-field")).toBeInTheDocument();
        expect(screen.getByTestId("quantity-field")).toBeInTheDocument();
        expect(screen.getByTestId("trade-type-field")).toBeInTheDocument();
        expect(screen.getByTestId("fee-field")).toBeInTheDocument();
        expect(screen.getByText("Subtotal")).toBeInTheDocument();
        expect(screen.getByText("Total Bought")).toBeInTheDocument();
    });
});
