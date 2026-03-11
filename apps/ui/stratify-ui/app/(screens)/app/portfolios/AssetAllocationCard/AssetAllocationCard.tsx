import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useInvestmentsList } from "../InvestmentsTable/useInvestmentsList";
import { InfoIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { useState } from "react";

const groupByValues = [
    "assetClass",
    "sector",
    "country",
    "noGrouping",
] as const;

type GroupByOption = (typeof groupByValues)[number];

const groupByOptions = [
    {
        label: "Asset class",
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
        label: "No grouping",
        value: "noGrouping",
    },
];

interface AssetAllocationCardProps {
    portfolioId: number | null;
}

const AssetAllocationCard = ({ portfolioId }: AssetAllocationCardProps) => {
    const { data, isLoading } = useInvestmentsList(portfolioId);
    const [groupBy, setGroupBy] = useState<GroupByOption>("assetClass");

    return (
        <div className="flex-1 h-full py-2.5 px-3 bg-secondary-lightest border border-primary-dark rounded-xl font-sans">
            <div className="flex flex-row gap-x-1 text-xl font-medium text-primary-darker">
                <div>Asset Allocation</div>
                <Tooltip>
                    <TooltipTrigger>
                        <InfoIcon className="w-4 h-4 text-primary-darker" />
                        <TooltipContent
                            className="bg-secondary-lighter text-secondary-dark"
                            arrowClassName="bg-secondary-lighter fill-secondary-lighter"
                        >
                            <p className="text-sm">Asset allocation tooltip</p>
                        </TooltipContent>
                    </TooltipTrigger>
                </Tooltip>
            </div>
            <div className="mt-2">
                <div className="text-base leading-5 text-secondary-base mb-1">
                    Group by:
                </div>
                <Select
                    value={groupBy}
                    onValueChange={(value) =>
                        setGroupBy(value as GroupByOption)
                    }
                    disabled={data.length === 0 || isLoading === true}
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
                        <SelectGroup className="flex flex-col gap-y-1">
                            {groupByOptions.map((option) => (
                                <SelectItem
                                    className="data-highlighted:bg-secondary-lighter data-[state=checked]:bg-secondary-light data-[state=checked]:text-secondary-darkest text-secondary-dark cursor-pointer"
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
        </div>
    );
};

export default AssetAllocationCard;
