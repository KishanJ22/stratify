"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { CircleArrowLeft, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePortfolio } from "./useDeletePortfolio";
import { Button } from "@/app/components/ui/button";
import { Spinner } from "@/app/components/ui/spinner";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

export interface CreatePortfolioModalProps {
    isOpen: boolean;
    handleClose: () => void;
    selectedPortfolioId: number | null;
    selectedPortfolioName: string;
    setSelectedPortfolioId: Dispatch<SetStateAction<number | null>>;
    setSelectedPortfolioName: Dispatch<SetStateAction<string>>;
}

const DeletePortfolioModal = ({
    isOpen,
    handleClose,
    selectedPortfolioId,
    selectedPortfolioName,
    setSelectedPortfolioId,
    setSelectedPortfolioName,
}: CreatePortfolioModalProps) => {
    const translate = useTranslations();
    const { isPending, mutate: deletePortfolio } = useDeletePortfolio();
    const queryClient = useQueryClient();

    const handleDelete = () =>
        deletePortfolio(selectedPortfolioId, {
            onSuccess: ({ response }) => {
                //? Invalidate portfolio list query to fetch updated list
                queryClient.invalidateQueries({
                    queryKey: ["portfolio-list"],
                });

                if (response.status === 204) {
                    setSelectedPortfolioId(null);
                    setSelectedPortfolioName("");
                    toast.success(
                        translate(
                            "Portfolios.deletePortfolioModal.portfolioDeletedSuccess",
                        ),
                    );
                }

                handleClose();
            },
        });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                handleClose();
            }}
        >
            <DialogContent className="bg-muted-lightest border border-primary-dark font-sans">
                <DialogHeader>
                    <div className="flex flex-row items-center justify-between">
                        <DialogTitle className="font-medium text-lg leading-7 text-secondary-darker">
                            {translate("Portfolios.deletePortfolioModal.title")}
                        </DialogTitle>
                        <X
                            size={20}
                            className="cursor-pointer text-muted-dark hover:text-primary-darker transition-colors"
                            onClick={() => handleClose()}
                            data-testid="close-modal-icon"
                        />
                    </div>
                    <div className="text-base text-secondary-base leading-6">
                        <p>
                            {translate(
                                "Portfolios.deletePortfolioModal.descriptionLineOne",
                            )}
                        </p>
                        <p>
                            {translate.rich(
                                "Portfolios.deletePortfolioModal.descriptionLineTwo",
                                {
                                    portfolioName: selectedPortfolioName,
                                    bold: (chunks) => (
                                        <span className="font-bold">
                                            {chunks}
                                        </span>
                                    ),
                                },
                            )}
                        </p>
                    </div>
                </DialogHeader>
                <div className="flex flex-row gap-x-3 justify-end">
                    <Button
                        variant="primaryLighter"
                        onClick={() => handleClose()}
                    >
                        <div className="flex flex-row items-center">
                            <CircleArrowLeft className="mr-2" size={16} />
                            {translate(
                                "Portfolios.deletePortfolioModal.goBack",
                            )}
                        </div>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleDelete()}
                    >
                        <div className="flex flex-row items-center">
                            {isPending ? (
                                <Spinner />
                            ) : (
                                <Trash2 className="mr-2" size={16} />
                            )}
                            {translate(
                                "Portfolios.deletePortfolioModal.deletePortfolio",
                            )}
                        </div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeletePortfolioModal;
