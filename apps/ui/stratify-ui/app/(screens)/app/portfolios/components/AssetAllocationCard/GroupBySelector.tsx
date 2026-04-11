import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { TFunction } from "@/i18n/TFunction";
import { useTranslations } from "next-intl";
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
        label: "Portfolios.assetAllocation.groupByOptions.assetClass",
        value: "assetClass",
    },
    {
        label: "Portfolios.assetAllocation.groupByOptions.sector",
        value: "sector",
    },
    {
        label: "Portfolios.assetAllocation.groupByOptions.country",
        value: "country",
    },
    {
        label: "Portfolios.assetAllocation.groupByOptions.noGrouping",
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
    const translate = useTranslations();

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
                {translate("Portfolios.assetAllocation.groupBy")}
            </div>
            <Select
                value={disabled ? "" : groupBy}
                onValueChange={(value) => setGroupBy(value as GroupByOption)}
                disabled={disabled}
            >
                <SelectTrigger
                    className="max-w-36 border-secondary-dark bg-secondary-lightest text-secondary-dark ring-secondary-dark"
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
                                {translate(option.label as any)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default GroupBySelector;
