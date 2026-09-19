"use client";

import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

export interface ManagePortfolioMenuProps {
    isManagePortfolioMenuOpen: boolean;
    setIsRenamePortfolioModalOpen: Dispatch<SetStateAction<boolean>>;
    setIsDeletePortfolioModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ManagePortfolioMenu = ({
    isManagePortfolioMenuOpen,
    setIsRenamePortfolioModalOpen,
    setIsDeletePortfolioModalOpen,
}: ManagePortfolioMenuProps) => {
    const translate = useTranslations("Portfolios");

    return (
        <div
            className={cn(
                "flex flex-col rounded-xl bg-muted-lightest border border-primary-base absolute right-0 top-full mt-2 w-48 font-sans text-sm leading-5 animate-in fade-in-10 fade-out-10 z-10",
                isManagePortfolioMenuOpen ? "block" : "hidden",
            )}
            data-testid="manage-portfolio-menu"
        >
            <div
                className="px-4 py-2 flex flex-row items-center text-primary-darker font-medium cursor-pointer hover:bg-primary-dark hover:text-white transition-colors rounded-t-xl"
                onClick={() => setIsRenamePortfolioModalOpen(true)}
            >
                <Pencil className="mr-2" size={16} />
                {translate("renamePortfolio")}
            </div>
            <div
                className="px-4 py-2 flex flex-row items-center text-negative-base font-medium cursor-pointer rounded-b-xl hover:bg-negative-base hover:text-white transition-colors"
                onClick={() => setIsDeletePortfolioModalOpen(true)}
            >
                <Trash2 className="mr-2" size={16} />
                {translate("deletePortfolio")}
            </div>
        </div>
    );
};

export default ManagePortfolioMenu;
