import { Badge } from "@/app/components/ui/badge";
import {
    AssetType,
    MarketState,
} from "../../(screens)/app/markets/MarketDataTable/MarketDataTable";

interface BadgeProps {
    className: string;
    label: string;
}

type BadgeConfigurationMap<T extends string> = Record<T, BadgeProps>;

export const assetTypeMap: BadgeConfigurationMap<AssetType> = {
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

export const marketStateMap: BadgeConfigurationMap<MarketState> = {
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

const AssetBadge = ({ className, label }: BadgeProps) => (
    <Badge className={`text-nowrap ${className}`}>{label}</Badge>
);

export default AssetBadge;
