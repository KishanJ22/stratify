import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreatePortfolioModal from "./CreatePortfolioModal";

const CreatePortfolioButton = () => {
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] =
        useState(false);

    return (
        <>
            <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsCreatePortfolioModalOpen(true)}
            >
                <div className="flex flex-row gap-x-1 items-center">
                    <Plus size={16} />
                    <span className="text-sm leading-6">Create Portfolio</span>
                </div>
            </Button>
            <CreatePortfolioModal
                isOpen={isCreatePortfolioModalOpen}
                handleClose={() => setIsCreatePortfolioModalOpen(false)}
            />
        </>
    );
};

export default CreatePortfolioButton;