import { ColumnDef } from "@tanstack/react-table";
import { Asset, AssetType, MarketState } from "./MarketDataTable";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface BadgeProps {
    className: string;
    label: string;
}

type BadgeConfigurationMap<T extends string> = Record<T, BadgeProps>;

const assetTypeMap: BadgeConfigurationMap<AssetType> = {
    STOCK: {
        className: "bg-secondary-lighter text-secondary-darker",
        label: "Stock",
    },
    ETF: {
        className: "bg-primary-lighter text-primary-darker",
        label: "Exchange Traded Fund",
    },
    CRYPTOCURRENCY: {
        className: "bg-accent-lighter text-accent-darker",
        label: "Cryptocurrency",
    },
};

const marketStateMap: BadgeConfigurationMap<MarketState> = {
    PRE: {
        className: "bg-primary-lighter text-primary-darker",
        label: "Pre-market",
    },
    PREPRE: {
        className: "bg-primary-lighter text-primary-darker",
        label: "Pre-market",
    },
    REGULAR: {
        className: "bg-primary-base text-primary-lightest",
        label: "Open",
    },
    POST: {
        className: "bg-primary-darker text-primary-lighter",
        label: "After-hours",
    },
    POSTPOST: {
        className: "bg-primary-darker text-primary-lighter",
        label: "After-hours",
    },
    CLOSED: {
        className: "bg-muted-dark text-muted-lighter",
        label: "Closed",
    },
};

const BadgeCell = ({ className, label }: BadgeProps) => (
    <Badge className={className}>{label}</Badge>
);

export const columns: ColumnDef<Asset>[] = [
    {
        accessorKey: "name",
        header: "Asset Name",
        cell: ({ row }) => {
            const assetName = row.original.name;

            return (
                <Button
                    variant="link"
                    className="font-medium text-primary-darker hover:underline hover:text-primary-dark transition-colors"
                >
                    {assetName} {`(${row.original.symbol})`}
                </Button>
            );
        },
    },
    {
        accessorKey: "assetType",
        header: "Asset Type",
        cell: ({ row }) => (
            <BadgeCell
                {...assetTypeMap[row.original.assetType]}
                data-testid="asset-type-badge"
            />
        ),
    },
    {
        accessorKey: "marketState",
        header: "Market State",
        cell: ({ row }) => {
            return (
                <BadgeCell
                    {...marketStateMap[row.original.marketState]}
                    data-testid="market-state-badge"
                />
            );
        },
    },
    {
        accessorKey: "currentPrice",
        header: "Current Price",
        meta: {
            type: "currency",
        },
        cell: ({ row }) => {
            const currentPrice = row.original.currentPrice ?? "---";
            const currency = row.original.currency ?? "---";

            const formattedPrice =
                typeof currentPrice === "number"
                    ? parseFloat(currentPrice.toFixed(2)).toLocaleString()
                    : currentPrice;

            return (
                <span className="flex flex-row justify-end">
                    {formattedPrice} {`(${currency})`}
                </span>
            );
        },
    },
    {
        accessorKey: "volume",
        header: "Volume (24 hours)",
        meta: {
            type: "number",
        },
    },
    {
        accessorKey: "priceChange",
        header: "Change (24 hours)",
        meta: {
            align: "right",
        },
        cell: ({ row }) => {
            const originalPriceChange = row.original.priceChange;
            const originalPriceChangePercentage =
                row.original.priceChangePercentage;

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
