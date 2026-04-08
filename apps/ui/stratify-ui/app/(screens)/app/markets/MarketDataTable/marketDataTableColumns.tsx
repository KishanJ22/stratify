import { ColumnDef } from "@tanstack/react-table";
import { TopAsset } from "./MarketDataTable";
import AssetBadge, {
    assetTypeMap,
    marketStateMap,
} from "@/app/components/(app)/AssetBadge";
import Link from "next/link";
import { formatNumericValue } from "@/app/utils/formatNumericValue";

export const columns: ColumnDef<TopAsset>[] = [
    {
        accessorKey: "assetName",
        header: "Asset Name",
        cell: ({ row }) => {
            const { assetId, assetName, symbol } = row.original;

            return (
                <Link
                    href={`/app/assets/${assetId}`}
                    className="font-medium text-primary-darker hover:underline hover:text-primary-dark transition-colors"
                >
                    {assetName} {`(${symbol})`}
                </Link>
            );
        },
    },
    {
        accessorKey: "assetType",
        header: "Asset Type",
        cell: ({ row }) => (
            <AssetBadge
                {...assetTypeMap[row.original.assetType]}
                data-testid="asset-type-badge"
            />
        ),
    },
    {
        accessorKey: "marketState",
        header: "Market State",
        cell: ({ row }) => (
            <AssetBadge
                {...marketStateMap[row.original.marketState]}
                data-testid="market-state-badge"
            />
        ),
    },
    {
        accessorKey: "priceDetails.currentPrice",
        header: "Current Price",
        meta: {
            type: "currency",
        },
        cell: ({ row }) => {
            const currentPrice =
                row.original.priceDetails.currentPrice ?? "---";
            const currency = row.original.currency ?? "---";

            return (
                <span className="flex justify-end">
                    {typeof currentPrice === "number"
                        ? formatNumericValue(currentPrice, currency)
                        : currentPrice}
                </span>
            );
        },
    },
    {
        accessorKey: "priceDetails.volume",
        header: "Volume (24 hours)",
        meta: {
            type: "number",
        },
    },
    {
        accessorKey: "priceDetails.priceChange",
        header: "Change (24 hours)",
        meta: {
            align: "right",
        },
        cell: ({ row }) => {
            const originalPriceChange = row.original.priceDetails.priceChange;
            const originalPriceChangePercentage =
                row.original.priceDetails.priceChangePercent;

            if (originalPriceChange && originalPriceChangePercentage) {
                const priceChange = parseFloat(originalPriceChange.toFixed(2));

                const priceChangePercentage = parseFloat(
                    originalPriceChangePercentage.toFixed(2),
                );

                const isPositive = (priceChange || priceChangePercentage) > 0;

                const sign = isPositive ? "+" : "";

                return (
                    <div
                        className={`flex flex-col justify-end text-sm leading-4 font-sans ${isPositive ? "text-positive-base" : "text-negative-base"}`}
                    >
                        <span>
                            {sign} {priceChange.toLocaleString()}
                        </span>
                        <span>
                            {sign} {priceChangePercentage.toLocaleString()}%
                        </span>
                    </div>
                );
            }
        },
    },
];
