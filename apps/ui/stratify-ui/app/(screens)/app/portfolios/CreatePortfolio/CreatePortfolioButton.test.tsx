import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePortfolioButton from "./CreatePortfolioButton";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatePortfolioModalProps } from "./CreatePortfolioModal";

vi.mock("./CreatePortfolioModal", () => ({
    default: ({ isOpen }: CreatePortfolioModalProps) => {
        if (isOpen) {
            return <div>CreatePortfolioModal</div>;
        }
    },
}));

const user = userEvent.setup();

describe("CreatePortfolioButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () =>
        renderWithContext({
            children: <CreatePortfolioButton />,
        });

    it("should render the create portfolio button", () => {
        renderComponent();

        const button = screen.getByText("Create Portfolio");
        expect(button).toBeInTheDocument();
        const plusIcon = screen.getByTestId("plus");
        expect(plusIcon).toBeInTheDocument();
    });

    it("should open the create portfolio modal when clicking the button", async () => {
        renderComponent();

        const button = screen.getByText("Create Portfolio");

        await user.click(button);

        await waitFor(async () => {
            expect(
                screen.getByText("CreatePortfolioModal"),
            ).toBeInTheDocument();
        });
    });
});
