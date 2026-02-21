import type { ColumnDef } from "@tanstack/react-table";
import { Investment } from "./InvestmentsTable";
import { Button } from "@/app/components/ui/button";
import AssetBadge, { assetTypeMap } from "@/app/components/(app)/AssetBadge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export const columns = (userCurrency: string): ColumnDef<Investment>[] => [
    {
        accessorKey: "name",
        header: "Asset Name",
        meta: {
            headerClassName: "w-[200px]",
        },
        cell: ({ row }) => {
            const { name, symbol } = row.original;

            return (
                <Button
                    variant="link"
                    className="font-medium text-primary-darker hover:underline hover:text-primary-dark transition-colors"
                >
                    {name} {symbol.length > 0 ? `(${symbol})` : ""}
                </Button>
            );
        },
    },
    {
        accessorKey: "shares",
        header: "Shares",
        meta: {
            align: "right",
            headerClassName: "w-[100px]",
        },
        cell: ({ row }) => {
            const shares = row.original.shares;

            return <div>{shares > 0 ? shares.toLocaleString() : "---"}</div>;
        },
    },
    {
        accessorKey: "type",
        header: "Asset Type",
        meta: {
            headerClassName: "w-[120px]",
        },
        cell: ({ row }) => {
            const assetType = row.original.type;

            return assetTypeMap[assetType] ? (
                <AssetBadge
                    {...assetTypeMap[assetType]}
                    data-testid="asset-type-badge"
                />
            ) : (
                "---"
            );
        },
    },
    {
        accessorKey: "currentValue",
        header: `Current Value (${userCurrency})`,
        meta: {
            align: "right",
            type: "currency",
            headerClassName: "w-[150px]",
        },
        cell: ({ row }) => {
            const { currentValue, currentAssetCurrencyValue, assetCurrency } =
                row.original;

            return (
                <div className="flex flex-row items-center gap-x-1 justify-end">
                    {currentValue > 0
                        ? `${currentValue.toLocaleString()}`
                        : "---"}
                    {currentAssetCurrencyValue && assetCurrency && (
                        <Tooltip>
                            <TooltipTrigger data-testid="asset-currency-info-icon">
                                <InfoIcon className="w-4 h-4 text-primary-darker" />
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className="font-semibold"
                            >
                                {currentAssetCurrencyValue.toLocaleString()}{" "}
                                {`(${assetCurrency})`}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "currentReturn",
        header: `Return (${userCurrency})`,
        meta: {
            align: "right",
            headerClassName: "w-[150px]",
        },
        cell: ({ row }) => {
            const { currentReturn, currentReturnPercentage } = row.original;

            const isPositive = currentReturn > 0;
            const sign = isPositive ? "+" : "";

            const isPlaceholderRow = row.original.shares === 0;

            return isPlaceholderRow ? (
                "---"
            ) : (
                <div
                    className={`flex flex-col justify-end text-sm leading-4 font-sans ${isPositive ? "text-positive-base" : "text-negative-base"}`}
                >
                    <span>
                        {sign} {currentReturn.toLocaleString()}
                    </span>
                    <span>
                        {sign} {currentReturnPercentage.toLocaleString()}%
                    </span>
                </div>
            );
        },
    },
    {
        header: "",
        id: "actions",
        meta: {
            type: "action",
            headerClassName: "w-[120px]",
        },
        cell: ({ row }) => {
            // TODO Implement add trade functionality to click through to a modal to add a trade for a specific investment
            //? See AB#65
            const { symbol, shares, assetCountryId } = row.original;

            return (
                <div className="flex flex-row gap-2">
                    <Button
                        disabled={shares === 0}
                        variant="link"
                        className="font-medium text-primary-darker hover:text-primary-dark transition-colors hover:underline hover:cursor-pointer"
                    >
                        Add trade
                    </Button>
                </div>
            );
        },
    },
];
