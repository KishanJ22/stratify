import { Skeleton } from "@/app/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface PortfolioMetricCardProps {
    title: string;
    tooltipContent: React.ReactNode;
    isLoading: boolean;
    children: React.ReactNode;
}

const PortfolioMetricCard = ({
    title,
    tooltipContent,
    isLoading,
    children,
}: PortfolioMetricCardProps) => {
    return (
        <div className="bg-secondary-lightest rounded-xl py-2.5 px-3 border border-primary-dark font-sans">
            <div className="flex items-center gap-1 mb-2">
                <span className="text-xl font-medium text-primary-darker">
                    {isLoading ? (
                        <Skeleton
                            className="w-25 h-5"
                            data-testid="portfolio-metric-card-title-skeleton"
                        />
                    ) : (
                        title
                    )}
                </span>
                <Tooltip>
                    <TooltipTrigger data-testid="portfolio-metric-card-info-icon">
                        <InfoIcon className="size-4 text-primary-darker" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-semibold">
                        {tooltipContent}
                    </TooltipContent>
                </Tooltip>
            </div>
            {isLoading ? (
                <Skeleton
                    className="w-full h-10"
                    data-testid="portfolio-metric-card-value-skeleton"
                />
            ) : (
                children
            )}
        </div>
    );
};

export default PortfolioMetricCard;
