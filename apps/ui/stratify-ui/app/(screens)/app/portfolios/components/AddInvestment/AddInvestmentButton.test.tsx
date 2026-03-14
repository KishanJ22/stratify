import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddInvestmentModalProps } from "./AddInvestmentModal";
import AddInvestmentButton from "./AddInvestmentButton";

vi.mock("./AddInvestmentModal", () => ({
    default: ({ isOpen }: AddInvestmentModalProps) => {
        if (isOpen) {
            return <div>AddInvestmentModal</div>;
        }
    },
}));

const user = userEvent.setup();

describe("AddInvestmentButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (portfolioId = 1) =>
        renderWithContext({
            children: <AddInvestmentButton portfolioId={portfolioId} />,
        });

    it("should render the add investment button", () => {
        renderComponent();

        const button = screen.getByText("Add Investment");
        expect(button).toBeInTheDocument();
        const plusIcon = screen.getByTestId("plus");
        expect(plusIcon).toBeInTheDocument();
    });

    it("should open the add investment modal when clicking the button", async () => {
        renderComponent();

        const button = screen.getByText("Add Investment");

        await user.click(button);

        await waitFor(async () => {
            expect(screen.getByText("AddInvestmentModal")).toBeInTheDocument();
        });
    });
});
