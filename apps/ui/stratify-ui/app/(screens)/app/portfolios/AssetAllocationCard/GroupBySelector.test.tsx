import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MockPointerEvent } from "@/app/tests/_mocks/MockPointerEvent";
import GroupBySelector, { GroupBySelectorProps } from "./GroupBySelector";

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
        render(<GroupBySelector {...defaultGroupBySelectorProps} {...props} />);

    it("should render the group by selector", () => {
        renderComponent();

        expect(
            screen.getByTestId("group-by-select-enabled"),
        ).toBeInTheDocument();
        expect(screen.getByText("Group by:")).toBeInTheDocument();
        expect(screen.getByText("Asset Class")).toBeInTheDocument();
    });

    it("should be disabled when the disabled prop is true", () => {
        renderComponent({ disabled: true });

        expect(
            screen.getByTestId("group-by-select-disabled"),
        ).toBeInTheDocument();
    });

    it("should render the group by options when clicking on the selector", async () => {
        renderComponent();

        const selectButton = screen.getByText("Asset Class");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        const groupByOptions = [
            "Asset Class",
            "Sector",
            "Country",
            "No Grouping",
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

        const selectButton = screen.getByText("Asset Class");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        const sectorOption = await screen.findByText("Sector");

        fireEvent.click(sectorOption);

        expect(mockSetGroupBy).toHaveBeenCalledWith("sector");
    });
});
