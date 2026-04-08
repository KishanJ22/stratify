import { Skeleton } from "@/app/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

interface PortfolioMetricCardProps {
    title: string;
    tooltipContent: React.ReactNode;
    isLoading: boolean;
    children: React.ReactNode;
    tooltipContentSide?: "top" | "right" | "bottom" | "left";
}

const PortfolioMetricCard = ({
    title,
    tooltipContent,
    isLoading,
    children,
    tooltipContentSide = "right",
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
                        <InfoIcon size={20} className="text-primary-darker" />
                    </TooltipTrigger>
                    <TooltipContent
                        side={tooltipContentSide}
                        className={cn(
                            "font-medium text-sm bg-secondary-lighter text-secondary-dark",
                            (tooltipContentSide === "bottom" ||
                                tooltipContentSide === "top") &&
                                "mr-10",
                        )}
                        arrowClassName={cn(
                            "bg-secondary-lighter fill-secondary-lighter",
                            (tooltipContentSide === "bottom" ||
                                tooltipContentSide === "top") &&
                                "ml-10",
                        )}
                    >
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
