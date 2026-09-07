import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { type PortfolioList } from "./usePortfolioList";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export interface PortfolioSelectorProps {
    portfolioList: PortfolioList;
    isLoading: boolean;
    selectedPortfolioId: number | null;
    setSelectedPortfolioId: Dispatch<SetStateAction<number | null>>;
    setSelectedPortfolioName: Dispatch<SetStateAction<string>>;
    variant?: "primary" | "secondary";
}

const PortfolioSelector = ({
    portfolioList,
    isLoading,
    selectedPortfolioId,
    setSelectedPortfolioId,
    setSelectedPortfolioName,
    variant = "primary",
}: PortfolioSelectorProps) => {
    const isSelectDisabled = portfolioList.length === 0;

    return isLoading ? (
        <Skeleton
            className="h-11 w-48 sm:w-64 md:w-52 rounded-xl"
            data-testid="loading-skeleton"
        />
    ) : (
        <Select
            onValueChange={(value) => {
                const selectedId = parseInt(value);
                const selectedPortfolio = portfolioList.find(
                    ({ id }) => id === selectedId,
                );

                setSelectedPortfolioId(selectedId);
                setSelectedPortfolioName(selectedPortfolio?.name ?? "");
            }}
            value={
                selectedPortfolioId ? selectedPortfolioId.toString() : undefined
            }
        >
            <SelectTrigger
                className={cn(
                    "w-48 sm:w-48 md:w-52",
                    variant === "secondary" &&
                        "border-secondary-dark bg-white text-secondary-dark ring-secondary-dark shadow-none",
                )}
                iconClassName={
                    variant === "secondary" ? "text-secondary-dark" : ""
                }
                disabled={isSelectDisabled}
            >
                <SelectValue
                    data-testid="portfolio-select-value"
                    placeholder={
                        isSelectDisabled
                            ? "Create a portfolio"
                            : "Select a portfolio"
                    }
                />
            </SelectTrigger>
            <SelectContent
                className={
                    variant === "secondary"
                        ? "border-secondary-base bg-white text-secondary-dark"
                        : ""
                }
                side="bottom"
                align="start"
            >
                <SelectGroup className="flex flex-col gap-y-1">
                    {portfolioList.map((portfolio) => (
                        <SelectItem
                            key={portfolio.id}
                            value={portfolio.id.toString()}
                            className={
                                variant === "secondary"
                                    ? "data-highlighted:bg-secondary-lighter data-[state=checked]:bg-secondary-light/70 data-[state=checked]:text-secondary-darkest text-secondary-dark cursor-pointer"
                                    : ""
                            }
                        >
                            {portfolio.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default PortfolioSelector;
