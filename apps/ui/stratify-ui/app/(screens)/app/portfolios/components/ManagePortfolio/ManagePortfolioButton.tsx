import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Ellipsis } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export interface ManagePortfolioButtonProps {
    isManagePortfolioMenuOpen: boolean;
    setIsManagePortfolioMenuOpen: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
}

const ManagePortfolioButton = ({
    isManagePortfolioMenuOpen,
    setIsManagePortfolioMenuOpen,
    isLoading,
}: ManagePortfolioButtonProps) => {
    return isLoading ? (
        <Skeleton className="rounded-full w-10 h-10" data-testid="loading-skeleton" />
    ) : (
        <Button
            variant="primaryLighter"
            size="icon-lg"
            onClick={() =>
                setIsManagePortfolioMenuOpen(!isManagePortfolioMenuOpen)
            }
            className="rounded-full"
        >
            <Ellipsis size={16} data-testid="ellipsis" />
        </Button>
    );
};

export default ManagePortfolioButton;
