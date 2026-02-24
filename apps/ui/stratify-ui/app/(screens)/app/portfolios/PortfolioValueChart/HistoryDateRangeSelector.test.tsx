import { beforeEach, describe, expect, it, vi } from "vitest";
import HistoryDateRangeSelector, {
    DateRange,
} from "./HistoryDateRangeSelector";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MockPointerEvent } from "@/app/tests/_mocks/MockPointerEvent";

const mockSetSelectedDateRange = vi.fn();

const defaultProps = {
    selectedDateRange: "30d" as DateRange,
    setSelectedDateRange: mockSetSelectedDateRange,
};

describe("HistoryDateRangeSelector", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props = defaultProps) =>
        render(<HistoryDateRangeSelector {...props} />);

    it("should render the date range selector", () => {
        renderComponent();

        const selectButton = screen.getByTestId("date-range-select-value");

        expect(selectButton).toBeInTheDocument();
        expect(selectButton).toHaveTextContent("Last 30 days");
    });

    it("should render the date range options when clicking on the select dropdown", async () => {
        renderComponent();

        const selectButton = screen.getByTestId("date-range-select-value");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        const selectOptions = await screen.findByRole("group");

        expect(
            within(selectOptions).getByText("Last 7 days"),
        ).toBeInTheDocument();
        expect(
            within(selectOptions).getByText("Last 30 days"),
        ).toBeInTheDocument();
        expect(
            within(selectOptions).getByText("Last 6 months"),
        ).toBeInTheDocument();
        expect(
            within(selectOptions).getByText("Last 12 months"),
        ).toBeInTheDocument();
        expect(within(selectOptions).getByText("All time")).toBeInTheDocument();
    });

    it("should call setSelectedDateRange with the correct date range when an option is selected", async () => {
        renderComponent();

        const selectButton = screen.getByTestId("date-range-select-value");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        const selectOptions = await screen.findByRole("group");
        const last6MonthsOption =
            within(selectOptions).getByText("Last 6 months");

        fireEvent.click(last6MonthsOption);

        expect(mockSetSelectedDateRange).toHaveBeenCalledWith("6m");
    });
});
