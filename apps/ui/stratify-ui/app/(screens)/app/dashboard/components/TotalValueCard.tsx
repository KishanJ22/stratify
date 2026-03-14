import { Skeleton } from "@/app/components/ui/skeleton";
import { useSessionContext } from "../../SessionProvider";
import KeyPerformanceCard from "./KeyPerformanceCard";
import Link from "next/link";

interface TotalValueCardProps {
    isPortfoliosNotFoundError: boolean;
    isInvestmentsNotFoundError: boolean;
    isLoading: boolean;
    totalValue?: number;
}

const TotalValueCard = ({
    totalValue,
    isPortfoliosNotFoundError,
    isInvestmentsNotFoundError,
    isLoading,
}: TotalValueCardProps) => {
    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency as string;

    return (
        <KeyPerformanceCard title="Total value">
            {isLoading ? (
                <Skeleton
                    className="h-8 w-1/2"
                    data-testid="total-value-skeleton"
                />
            ) : isPortfoliosNotFoundError ? (
                <Link
                    href="/app/portfolios?createPortfolio=true"
                    className="text-3xl leading-9 text-secondary-light hover:text-secondary-base transition-colors hover:underline"
                >
                    {"Create a portfolio"}
                </Link>
            ) : isInvestmentsNotFoundError ? (
                <span className="text-3xl leading-9 text-secondary-light">
                    {"---"}
                </span>
            ) : (
                <span className="text-3xl leading-9 text-secondary-base">
                    {totalValue
                        ? `${totalValue.toLocaleString()} (${userCurrency})`
                        : "---"}
                </span>
            )}
        </KeyPerformanceCard>
    );
};

export default TotalValueCard;
