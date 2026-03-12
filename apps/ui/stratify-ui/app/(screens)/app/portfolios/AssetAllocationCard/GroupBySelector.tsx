import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { Dispatch, SetStateAction } from "react";

const groupByValues = [
    "assetClass",
    "sector",
    "country",
    "noGrouping",
] as const;

export type GroupByOption = (typeof groupByValues)[number];

const groupByOptions = [
    {
        label: "Asset Class",
        value: "assetClass",
    },
    {
        label: "Sector",
        value: "sector",
    },
    {
        label: "Country",
        value: "country",
    },
    {
        label: "No Grouping",
        value: "noGrouping",
    },
];

export interface GroupBySelectorProps {
    groupBy: GroupByOption;
    setGroupBy: Dispatch<SetStateAction<GroupByOption>>;
    disabled: boolean;
}

const GroupBySelector = ({
    groupBy,
    setGroupBy,
    disabled,
}: GroupBySelectorProps) => {
    return (
        <div
            className="mt-2"
            data-testid={
                disabled
                    ? "group-by-select-disabled"
                    : "group-by-select-enabled"
            }
        >
            <div className="text-base leading-5 text-secondary-base mb-1">
                Group by:
            </div>
            <Select
                value={disabled ? "" : groupBy}
                onValueChange={(value) => setGroupBy(value as GroupByOption)}
                disabled={disabled}
            >
                <SelectTrigger
                    className="max-w-36 border-secondary-dark bg-secondary-lighter text-secondary-dark ring-secondary-dark"
                    iconClassName="text-secondary-dark"
                >
                    <SelectValue data-testid="group-by-select-value" />
                </SelectTrigger>
                <SelectContent
                    className="border-secondary-base bg-secondary-lightest text-secondary-dark"
                    side="bottom"
                    align="start"
                >
                    <SelectGroup
                        className="flex flex-col gap-y-1"
                        data-testid="group-by-options"
                    >
                        {groupByOptions.map((option) => (
                            <SelectItem
                                className="data-highlighted:bg-secondary-lighter data-[state=checked]:bg-secondary-light/70 data-[state=checked]:text-secondary-darkest text-secondary-dark cursor-pointer"
                                iconClassName="text-secondary-dark"
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default GroupBySelector;
