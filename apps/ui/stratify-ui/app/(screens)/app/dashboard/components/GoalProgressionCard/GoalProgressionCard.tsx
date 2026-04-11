import { Skeleton } from "@/app/components/ui/skeleton";
import { Progress } from "@/app/components/ui/progress";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSessionContext } from "../../../SessionProvider";

interface GoalProgressionCardProps {
    totalValue?: number;
    targetValue?: number;
    isLoading: boolean;
    isGoalNotFoundError?: boolean;
}

const GoalProgressionCard = ({
    totalValue,
    targetValue,
    isLoading,
    isGoalNotFoundError,
}: GoalProgressionCardProps) => {
    const translate = useTranslations("Dashboard");
    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency;

    const [isSetGoalModalOpen, setIsSetGoalModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-28.75 w-full shadow-lg bg-primary-lightest rounded-xl py-2.5 px-3 font-sans">
            <div className="flex flex-row justify-between items-center">
                <div className="text-3xl leading-10 font-semibold text-secondary-base">
                    {translate("goalProgression.title")}
                </div>
                {isLoading ? (
                    <Skeleton className="h-4 w-10" />
                ) : (
                    <div className="px-2 py-0.5 rounded-xl bg-secondary-lighter font-medium text-sm leading-5 text-secondary-darker cursor-pointer hover:bg-secondary-base hover:text-secondary-lightest transition-colors">
                        {translate(
                            isGoalNotFoundError
                                ? "goalProgression.set"
                                : "goalProgression.edit",
                        )}
                    </div>
                )}
            </div>
            <div className="mt-2.5">
                {isLoading ? (
                    <Skeleton
                        className="h-4 w-full"
                        data-testid="goal-progression-skeleton"
                    />
                ) : isGoalNotFoundError ? (
                    <div className="flex flex-col gap-y-2.5">
                        <Progress
                            value={67}
                            indicatorClassName="bg-secondary-light"
                        />
                        <div className="text-base leading-5 text-secondary-light">
                            {translate("goalProgression.goalNotSet")}
                        </div>
                    </div>
                ) : totalValue && targetValue && totalValue >= targetValue ? (
                    <div className="flex flex-col gap-y-2.5">
                        <Progress
                            value={100}
                            className="bg-positive-base"
                            indicatorClassName="bg-positive-base"
                        />
                        <div className="text-sm leading-5 text-secondary-light">
                            {translate("goalProgression.goalSuccessfullyMet", {
                                targetValue,
                                userCurrency: userCurrency || "---",
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-2.5">
                        <Progress value={67} />
                        <div className="flex flex-row justify-between text-lg leading-5 text-secondary-base">
                            <span>{"0"}</span>
                            <span>{targetValue}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalProgressionCard;
