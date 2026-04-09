import type { ColumnDef } from "@tanstack/react-table";
import AssetBadge, { assetTypeMap } from "@/app/components/(app)/AssetBadge";
import { Investment } from "../../../portfolios/components/InvestmentsTable/InvestmentsTable";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { formatNumericValue } from "@/app/utils/formatNumericValue";

export const columns = (
    userCurrency: string,
    isNotFoundError: boolean,
): ColumnDef<Investment>[] => [
    {
        accessorKey: "name",
        header: "Name",
        meta: {
            headerClassName: "w-62.5",
        },
        cell: ({ row }) => {
            const { name, portfolioName, assetId } = row.original;

            return isNotFoundError ? (
                <div className="text-sm leading-5 max-w-62.5 whitespace-nowrap text-primary-dark">
                    {name}
                </div>
            ) : (
                <div className="flex flex-col leading-5 max-w-62.5">
                    <Link
                        href={`/app/assets/${assetId}`}
                        className="text-sm whitespace-nowrap text-ellipsis overflow-hidden text-primary-darker hover:underline hover:text-primary-dark transition-colors"
                    >
                        {name}
                    </Link>
                    <span className="text-secondary-light font-medium text-xs">
                        {portfolioName}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
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
        header: `Value (${userCurrency})`,
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
                    {currentAssetCurrencyValue && assetCurrency ? (
                        <Tooltip>
                            <TooltipTrigger data-testid="asset-currency-info-icon">
                                <InfoIcon className="w-4 h-4 text-primary-darker" />
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className="font-semibold"
                            >
                                {formatNumericValue(
                                    currentAssetCurrencyValue,
                                    assetCurrency,
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ) : null}
                </div>
            );
        },
    },
    {
        accessorKey: "currentReturn",
        header: `Return (${userCurrency})`,
        meta: {
            align: "right",
            headerClassName: "w-[175px]",
        },
        cell: ({ row }) => {
            const { currentReturn, currentReturnPercentage } = row.original;

            const isPositive = currentReturn > 0;
            const sign = isPositive ? "+" : "";

            const isPlaceholderRow =
                row.original.currentReturn === 0 && row.original.shares === 0;

            return isPlaceholderRow ? (
                "---"
            ) : (
                <div
                    className={`flex flex-col justify-end text-sm leading-4 text-nowrap font-sans ${isPositive ? "text-positive-base" : "text-negative-base"}`}
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
        cell: ({ row }) =>
            isNotFoundError ? null : (
                <Link
                    href={`/app/portfolios?portfolioId=${row.original.portfolioId}`}
                    className="font-medium text-nowrap text-primary-darker hover:text-primary-dark transition-colors hover:underline hover:cursor-pointer"
                >
                    View Portfolio
                </Link>
            ),
    },
];
