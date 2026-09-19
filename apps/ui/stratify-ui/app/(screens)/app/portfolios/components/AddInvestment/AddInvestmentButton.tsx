"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import AddInvestmentModal from "./AddInvestmentModal";

interface AddInvestmentButtonProps {
	portfolioId: number | null;
}

const AddInvestmentButton = ({ portfolioId }: AddInvestmentButtonProps) => {
	const translate = useTranslations();
	const [isAddInvestmentModalOpen, setIsAddInvestmentModalOpen] =
		useState(false);

	return (
		<>
			<Button
				variant="primaryLighter"
				size="lg"
				onClick={() => setIsAddInvestmentModalOpen(true)}
				disabled={!portfolioId}
			>
				<div className="flex flex-row gap-x-1 items-center">
					<Plus size={16} data-testid="plus" />
					<span className="text-sm leading-6">
						{translate("Investments.addInvestment")}
					</span>
				</div>
			</Button>
			<AddInvestmentModal
				portfolioId={portfolioId!}
				isOpen={isAddInvestmentModalOpen}
				handleClose={() => setIsAddInvestmentModalOpen(false)}
			/>
		</>
	);
};

export default AddInvestmentButton;
