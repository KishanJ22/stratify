import { Skeleton } from "@/app/components/ui/skeleton";
import { Progress } from "@/app/components/ui/progress";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useSessionContext } from "../../../SessionProvider";

interface GoalProgressionCardProps {
    totalValue?: number;
    targetValue?: number;
    isLoading: boolean;
    isGoalNotFoundError?: boolean;
    setIsGoalModalOpen: Dispatch<SetStateAction<boolean>>;
}

const GoalProgressionCard = ({
    totalValue,
    targetValue,
    isLoading,
    isGoalNotFoundError,
    setIsGoalModalOpen,
}: GoalProgressionCardProps) => {
    const translate = useTranslations();
    const { session } = useSessionContext();

    const userCurrency = session?.userDetails.currency;

    return (
        <div className="flex flex-col h-28.75 w-full shadow-lg bg-primary-lightest rounded-xl py-2.5 px-3 font-sans">
            <div className="flex flex-row justify-between items-center">
                <div className="text-3xl leading-10 font-semibold text-secondary-base">
                    {translate("Dashboard.goalProgression.title")}
                </div>
                {isLoading ? (
                    <Skeleton className="h-4 w-10" />
                ) : (
                    <div
                        className="px-2 py-0.5 rounded-xl bg-secondary-lighter font-medium text-sm leading-5 text-secondary-darker cursor-pointer hover:bg-secondary-base hover:text-secondary-lightest transition-colors"
                        onClick={() => setIsGoalModalOpen(true)}
                    >
                        {translate(
                            isGoalNotFoundError
                                ? "Dashboard.goalProgression.set"
                                : "Dashboard.goalProgression.edit",
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
                            {translate("Dashboard.goalProgression.goalNotSet")}
                        </div>
                    </div>
                ) : totalValue && targetValue && totalValue >= targetValue ? (
                    <div className="flex flex-col gap-y-2.5">
                        <Progress
                            value={100}
                            className="bg-positive-base"
                            indicatorClassName="bg-positive-base"
                        />
                        <div className="text-base leading-5 text-positive-base">
                            {translate(
                                "Dashboard.goalProgression.goalSuccessfullyMet",
                                {
                                    targetValue,
                                    userCurrency: userCurrency || "---",
                                },
                            )}
                        </div>
                    </div>
                ) : totalValue && targetValue ? (
                    <div className="flex flex-col gap-y-2.5">
                        <Progress value={(totalValue / targetValue) * 100} />
                        <div className="flex flex-row justify-between text-lg leading-5 text-secondary-base">
                            <span>{"0"}</span>
                            <span>
                                {targetValue
                                    ? translate("Generic.currencyAmount", {
                                          amount: targetValue,
                                          currency: userCurrency || "---",
                                      })
                                    : "---"}
                            </span>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default GoalProgressionCard;
