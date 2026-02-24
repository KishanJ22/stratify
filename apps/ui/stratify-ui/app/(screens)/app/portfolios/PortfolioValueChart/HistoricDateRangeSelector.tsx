import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/app/components/ui/select";
import { Dispatch, SetStateAction } from "react";

const dateRangeValues = ["7d", "30d", "6m", "12m", "all"] as const;
export type DateRange = (typeof dateRangeValues)[number];

const dateRanges = [
    {
        label: "Last 7 days",
        value: "7d",
    },
    {
        label: "Last 30 days",
        value: "30d",
    },
    {
        label: "Last 6 months",
        value: "6m",
    },
    {
        label: "Last 12 months",
        value: "12m",
    },
    {
        label: "All time",
        value: "all",
    },
];

interface HistoryDateRangeSelectorProps {
    selectedDateRange: DateRange;
    setSelectedDateRange: Dispatch<SetStateAction<DateRange>>;
}

const HistoryDateRangeSelector = ({
    selectedDateRange,
    setSelectedDateRange,
}: HistoryDateRangeSelectorProps) => {
    return (
        <Select
            value={selectedDateRange}
            onValueChange={(value) => setSelectedDateRange(value as DateRange)}
        >
            <SelectTrigger className="max-w-32">
                <SelectValue data-testid="date-range-select-value" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
                <SelectGroup className="flex flex-col gap-y-1">
                    {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                            {range.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default HistoryDateRangeSelector;
