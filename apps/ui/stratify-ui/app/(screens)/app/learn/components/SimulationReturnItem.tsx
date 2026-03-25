import { cn } from "@/lib/utils";
import { CompoundingSimulatorSuccessResponse } from "../compounding/useCompoundingSimulator";
import { Skeleton } from "@/app/components/ui/skeleton";

interface SimulationReturnItemProps {
    title: string;
    badgeColour: string;
    returnDetails?: CompoundingSimulatorSuccessResponse["data"]["returns"]["compoundingWithDividends"];
    isLoading: boolean;
}

const SimulationReturnItem = ({
    title,
    badgeColour,
    returnDetails,
    isLoading,
}: SimulationReturnItemProps) => {
    const hasPositiveReturn = returnDetails
        ? returnDetails.absolute > 0
        : false;
    const hasNegativeReturn = returnDetails
        ? returnDetails.absolute < 0
        : false;

    return (
        <div className="flex flex-col items-end font-sans">
            <div className="flex flex-row items-center justify-items-center gap-x-1">
                <div
                    className="w-1 h-5 py-0.5 rounded-sm"
                    style={{
                        backgroundColor:
                            returnDetails === null
                                ? "var(--secondary-light)"
                                : badgeColour,
                    }}
                />
                <div
                    className={`text-xl leading-6 font-medium ${returnDetails === null ? "text-secondary-light" : "text-secondary-dark"}`}
                >
                    {title}
                </div>
            </div>
            {isLoading ? (
                <div className="flex flex-col gap-y-1">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                </div>
            ) : (
                <div
                    className={cn(
                        "flex flex-col gap-y-1 mt-1 text-secondary-light font-medium leading-5 items-end",
                        hasPositiveReturn && "text-positive-base",
                        hasNegativeReturn && "text-negative-base",
                    )}
                >
                    <div>
                        {returnDetails
                            ? (hasPositiveReturn ? "+" : "") +
                              returnDetails.absolute.toLocaleString()
                            : "---"}
                    </div>
                    <div>
                        {returnDetails
                            ? (hasPositiveReturn ? "+" : "") +
                              returnDetails.percentage +
                              "%"
                            : "---"}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationReturnItem;
