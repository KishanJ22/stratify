import { Skeleton } from "@/app/components/ui/skeleton";
import { useSessionContext } from "../../SessionProvider";
import KeyPerformanceCard from "./KeyPerformanceCard";
import Link from "next/link";
import { useTranslations } from "next-intl";

export interface TotalValueCardProps {
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
    const translate = useTranslations();
    const userCurrency = session?.userDetails.currency as string;

    return (
        <KeyPerformanceCard title={translate("Dashboard.totalValue")}>
            {isLoading ? (
                <Skeleton
                    className="h-8 w-1/2"
                    data-testid="total-value-skeleton"
                />
            ) : isPortfoliosNotFoundError ? (
                <Link
                    href="/app/portfolios?createPortfolio=true"
                    className="text-3xl leading-9 text-secondary-light hover:text-secondary-base transition-colors hover:underline"
                    data-testid="create-portfolio-link"
                >
                    {translate("Dashboard.createAPortfolio")}
                </Link>
            ) : isInvestmentsNotFoundError ? (
                <Link
                    href="/app/portfolios"
                    className="text-3xl leading-9 text-secondary-light hover:text-secondary-base transition-colors hover:underline"
                    data-testid="add-investment-link"
                >
                    {translate("Dashboard.addAnInvestment")}
                </Link>
            ) : (
                <span className="text-3xl leading-9 text-secondary-base">
                    {totalValue
                        ? translate("Generic.currencyAmount", {
                              amount: totalValue,
                              currency: userCurrency,
                          })
                        : "---"}
                </span>
            )}
        </KeyPerformanceCard>
    );
};

export default TotalValueCard;
