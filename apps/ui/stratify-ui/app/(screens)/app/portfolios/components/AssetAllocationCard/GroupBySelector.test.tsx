import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MockPointerEvent } from "@/app/tests/_mocks/MockPointerEvent";
import GroupBySelector, { GroupBySelectorProps } from "./GroupBySelector";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";

const mockSetGroupBy = vi.fn();

const defaultGroupBySelectorProps = {
    groupBy: "assetClass",
    setGroupBy: mockSetGroupBy,
    disabled: false,
} satisfies GroupBySelectorProps;

describe("GroupBySelector", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<GroupBySelectorProps>) =>
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <GroupBySelector {...defaultGroupBySelectorProps} {...props} />
            </NextIntlClientProvider>,
        );

    it("should render the group by selector", () => {
        renderComponent();

        expect(
            screen.getByTestId("group-by-select-enabled"),
        ).toBeInTheDocument();
        expect(screen.getByText("Group by:")).toBeInTheDocument();
        expect(screen.getByText("Asset class")).toBeInTheDocument();
    });

    it("should be disabled when the disabled prop is true", () => {
        renderComponent({ disabled: true });

        expect(
            screen.getByTestId("group-by-select-disabled"),
        ).toBeInTheDocument();
    });

    it("should render the group by options when clicking on the selector", async () => {
        renderComponent();

        const selectButton = screen.getByText("Asset class");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        const groupByOptions = [
            "Asset class",
            "Sector",
            "Country",
            "No grouping",
        ];

        const groupByOptionsComponent =
            await screen.findByTestId("group-by-options");

        for (const option of groupByOptions) {
            expect(
                within(groupByOptionsComponent).getByText(option),
            ).toBeInTheDocument();
        }
    });

    it("should set the group by option when selecting an option", async () => {
        renderComponent();

        const selectButton = screen.getByText("Asset class");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        const sectorOption = await screen.findByText("Sector");

        fireEvent.click(sectorOption);

        expect(mockSetGroupBy).toHaveBeenCalledWith("sector");
    });
});
