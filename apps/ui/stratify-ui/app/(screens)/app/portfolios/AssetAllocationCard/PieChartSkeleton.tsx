import { Skeleton } from "@/app/components/ui/skeleton";

const PieChartSkeleton = () => {
    return (
        <div
            className="flex flex-col gap-y-5 mt-2 items-center"
            data-testid="pie-chart-skeleton"
        >
            <Skeleton className="h-52 w-52 rounded-full bg-secondary-base/30" />
            <Skeleton className="h-10 w-full rounded-xl bg-secondary-base/30" />
        </div>
    );
};

export default PieChartSkeleton;
