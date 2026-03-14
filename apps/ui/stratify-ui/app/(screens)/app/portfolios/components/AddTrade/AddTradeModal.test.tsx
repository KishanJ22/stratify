import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddTradeModal, { AddTradeModalProps } from "./AddTradeModal";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";

const mockHandleClose = vi.fn();

const user = userEvent.setup();

const mockInvestment = {
    assetId: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    assetCurrency: "USD",
};

describe("AddTradeModal", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderModal = ({
        portfolioId,
        investment,
        isOpen,
        handleClose,
    }: AddTradeModalProps) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <AddTradeModal
                        portfolioId={portfolioId}
                        investment={investment}
                        isOpen={isOpen}
                        handleClose={handleClose}
                    />
                </MockSessionProvider>
            ),
        });

    it("should render the modal when isOpen is true", () => {
        renderModal({
            portfolioId: 1,
            investment: mockInvestment,
            isOpen: true,
            handleClose: mockHandleClose,
        });

        expect(screen.getByTestId("modal-title")).toBeInTheDocument();
        expect(screen.getByTestId("modal-description")).toBeInTheDocument();
    });

    it("should not render the modal when isOpen is false", () => {
        renderModal({
            portfolioId: 1,
            investment: mockInvestment,
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
            investment: mockInvestment,
            isOpen: true,
            handleClose: mockHandleClose,
        });

        const closeButton = screen.getByTestId("close-modal-icon");
        await user.click(closeButton);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it("should display the correct fields in the form", () => {
        renderModal({
            portfolioId: 1,
            investment: mockInvestment,
            isOpen: true,
            handleClose: mockHandleClose,
        });

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
