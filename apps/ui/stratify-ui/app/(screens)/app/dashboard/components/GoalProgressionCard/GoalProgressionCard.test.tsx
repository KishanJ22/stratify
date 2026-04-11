import { beforeEach, describe, expect, it, vi } from "vitest";
import GoalProgressionCard, {
    GoalProgressionCardProps,
} from "./GoalProgressionCard";
import { renderWithContext } from "@/app/tests/utils";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSetIsGoalModalOpen = vi.fn();

const defaultProps = {
    totalValue: 1000,
    targetValue: 2000,
    isLoading: false,
    isGoalNotFoundError: false,
    setIsGoalModalOpen: mockSetIsGoalModalOpen,
} satisfies GoalProgressionCardProps;

const user = userEvent.setup();

describe("GoalProgressionCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<GoalProgressionCardProps>) =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <NextIntlClientProvider locale="en" messages={messages}>
                        <GoalProgressionCard {...defaultProps} {...props} />
                    </NextIntlClientProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the card correctly", () => {
        renderComponent();

        expect(screen.getByText("Goal Progression")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("2,000 (GBP)")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should show the loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });

        expect(
            screen.getByTestId("goal-progression-skeleton"),
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("set-goal-button-skeleton"),
        ).toBeInTheDocument();
    });

    it("should show the set goal button when there is a goal not found error", () => {
        renderComponent({ isGoalNotFoundError: true });

        expect(screen.getByText("Set")).toBeInTheDocument();
        expect(screen.getByText("Goal not set")).toBeInTheDocument();
    });

    it("should call setIsGoalModalOpen with true when edit button is clicked", async () => {
        renderComponent();

        const editButton = screen.getByText("Edit");
        await user.click(editButton);

        expect(mockSetIsGoalModalOpen).toHaveBeenCalledWith(true);
    });

    it("should display complete progression when totalValue is greater than or equal to targetValue", () => {
        renderComponent({ totalValue: 2500, targetValue: 2000 });

        expect(
            screen.getByText("Your goal of 2,000 (GBP) has been reached!"),
        ).toBeInTheDocument();
    });
});
