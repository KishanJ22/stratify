import { Skeleton } from "@/app/components/ui/skeleton";
import KeyPerformanceCard from "./KeyPerformanceCard";
import { Progress } from "@/app/components/ui/progress";
import { useTranslations } from "next-intl";

interface GoalProgressionCardProps {
    isLoading: boolean;
}

const GoalProgressionCard = ({ isLoading }: GoalProgressionCardProps) => {
    const translate = useTranslations("Dashboard");

    return (
        <KeyPerformanceCard title={translate("goalProgression")}>
            {isLoading ? (
                <Skeleton
                    className="h-4 w-full"
                    data-testid="goal-progression-skeleton"
                />
            ) : (
                <div className="flex flex-col gap-y-1">
                    <Progress value={67} />
                    <div className="flex flex-row justify-between text-lg leading-5 text-secondary-base">
                        <span>{"0"}</span>
                        <span>{"100"}</span>
                    </div>
                </div>
            )}
        </KeyPerformanceCard>
    );
};

export default GoalProgressionCard;
