import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import SetGoalModal, { SetGoalModalProps } from "./SetGoalModal";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";

const mockHandleClose = vi.fn();

const user = userEvent.setup();

const mockRefetchGoal = vi.fn();

const defaultProps = {
    isOpen: true,
    handleClose: mockHandleClose,
    currentTargetAmount: 1000,
    isGoalNotFoundError: false,
    refetchGoal: mockRefetchGoal,
} satisfies SetGoalModalProps;

describe("SetGoalModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderModal = (props?: Partial<SetGoalModalProps>) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <NextIntlClientProvider locale="en" messages={messages}>
                        <SetGoalModal {...defaultProps} {...props} />
                    </NextIntlClientProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the modal correctly when isGoalNotFoundError is false", () => {
        renderModal();

        expect(screen.getByText("Edit Goal")).toBeInTheDocument();
        expect(screen.getByLabelText("Target Amount")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should render the modal correctly when isGoalNotFoundError is true", () => {
        renderModal({ isGoalNotFoundError: true });

        expect(screen.getByText("Set Goal")).toBeInTheDocument();
        expect(screen.getByLabelText("Target Amount")).toBeInTheDocument();
        expect(screen.getByText("Set")).toBeInTheDocument();
    });

    it("should call handleClose when the close icon is clicked", async () => {
        renderModal();

        const closeIcon = screen.getByTestId("close-modal-icon");
        await user.click(closeIcon);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it("should set the target amount input value to the current target amount when editing a goal", () => {
        renderModal();

        const targetAmountInput = screen.getByLabelText(
            "Target Amount",
        ) as HTMLInputElement;
        expect(targetAmountInput.value).toBe("1000");
    });

    it("should enable the submit button when the target amount input is valid", async () => {
        renderModal();

        const targetAmountInput = within(
            screen.getByTestId("target-amount-input"),
        ).getByLabelText("Target Amount");

        await user.clear(targetAmountInput);
        await user.type(targetAmountInput, "5000");

        expect(screen.getByText("Edit")).toBeEnabled();
    });

    it("should disable the submit button when the target amount input is invalid", async () => {
        renderModal();

        const targetAmountInput = within(
            screen.getByTestId("target-amount-input"),
        ).getByLabelText("Target Amount");

        await user.clear(targetAmountInput);
        await user.type(targetAmountInput, "0");

        expect(
            screen.getByTestId("submit-button-disabled"),
        ).toBeInTheDocument();
    });

    it("should call handleClose when the close icon is clicked", async () => {
        renderModal();

        const closeIcon = screen.getByTestId("close-modal-icon");
        await user.click(closeIcon);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
});
