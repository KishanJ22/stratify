import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface CreatePortfolioButtonProps {
    setIsCreatePortfolioModalOpen: Dispatch<SetStateAction<boolean>>;
}

const CreatePortfolioButton = ({
    setIsCreatePortfolioModalOpen,
}: CreatePortfolioButtonProps) => {
    return (
        <Button
            variant="primaryLighter"
            size="lg"
            onClick={() => setIsCreatePortfolioModalOpen(true)}
        >
            <div className="flex flex-row gap-x-1 items-center">
                <Plus size={16} data-testid="plus" />
                <span className="text-sm leading-6">Create Portfolio</span>
            </div>
        </Button>
    );
};

export default CreatePortfolioButton;
