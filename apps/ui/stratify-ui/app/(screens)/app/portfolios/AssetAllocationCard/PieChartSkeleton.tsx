import { Skeleton } from "@/app/components/ui/skeleton";

const PieChartSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-5 mt-2 items-center">
            <Skeleton className="h-52 w-52 rounded-full bg-secondary-base/30" />
            <div className="grid grid-cols-2 grid-rows-3 gap-2 w-full">
                <Skeleton className="h-5 w-full rounded-xl bg-secondary-base/30" />
                <Skeleton className="h-5 w-full rounded-xl bg-secondary-base/30" />
                <Skeleton className="h-5 w-full rounded-xl bg-secondary-base/30" />
                <Skeleton className="h-5 w-full rounded-xl bg-secondary-base/30" />
            </div>
        </div>
    );
};

export default PieChartSkeleton;
