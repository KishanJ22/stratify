import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import type { PortfolioList } from "./usePortfolioList";
import { Skeleton } from "@/app/components/ui/skeleton";

export interface PortfolioSelectorProps {
    portfolioList: PortfolioList;
    isLoading: boolean;
}

const PortfolioSelector = ({
    portfolioList,
    isLoading,
}: PortfolioSelectorProps) => {
    const isSelectDisabled = portfolioList.length === 0;

    return (
        <div className="mt-7 flex flex-col gap-y-2">
            <div className="font-sans text-primary-base text-xl">
                Selected Portfolio
            </div>
            {isLoading ? (
                <Skeleton
                    className="h-11 w-64 rounded-xl"
                    data-testid="loading-skeleton"
                />
            ) : (
                <Select>
                    <SelectTrigger
                        className="max-w-64"
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
                    <SelectContent side="bottom" align="start">
                        <SelectGroup className="flex flex-col gap-y-1">
                            {portfolioList.map((portfolio) => (
                                <SelectItem
                                    key={portfolio.id}
                                    value={portfolio.id.toString()}
                                >
                                    {portfolio.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};

export default PortfolioSelector;
