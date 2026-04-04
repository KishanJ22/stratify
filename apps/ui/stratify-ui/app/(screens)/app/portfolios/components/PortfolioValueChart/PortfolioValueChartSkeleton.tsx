import { Skeleton } from "@/app/components/ui/skeleton";

const PortfolioValueChartSkeleton = () => (
    <div
        className="flex flex-col w-full"
        data-testid="portfolio-value-chart-skeleton"
    >
        <div className="flex flex-row justify-between">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-32 h-5" />
        </div>
        <Skeleton className="w-32 h-10 self-start mt-1" />
        <Skeleton className="w-44 h-5 self-start mt-1" />
        <Skeleton className="w-full h-62.5 mt-2" />
    </div>
);

export default PortfolioValueChartSkeleton;
