"use client";

import { useAppForm } from "@/app/components/Form/useForm";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import {
    PortfolioNameAlreadyExistsResponse,
    useRenamePortfolio,
} from "./useRenamePortfolio";
import { HTTPError } from "ky";
import * as zod from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const renamePortfolioSchema = zod.object({
    name: zod.string().min(1, "Portfolio name is required"),
});

export interface RenamePortfolioModalProps {
    isOpen: boolean;
    handleClose: () => void;
    selectedPortfolioId: number | null;
    selectedPortfolioName: string;
    setSelectedPortfolioName: Dispatch<SetStateAction<string>>;
}

const RenamePortfolioModal = ({
    isOpen,
    handleClose,
    selectedPortfolioId,
    selectedPortfolioName,
    setSelectedPortfolioName,
}: RenamePortfolioModalProps) => {
    const translate = useTranslations();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isPortfolioNameAlreadyExists, setIsPortfolioNameAlreadyExists] =
        useState(false);

    const [isPortfolioNameSame, setIsPortfolioNameSame] = useState(true);

    const { isPending, mutate: renamePortfolio } =
        useRenamePortfolio(selectedPortfolioId);
    const queryClient = useQueryClient();

    const form = useAppForm({
        formId: "rename-portfolio-form",
        defaultValues: {
            name: selectedPortfolioName,
        },
        validators: {
            onChange: renamePortfolioSchema,
            onBlurAsync: async ({ value }) => {
                const errors = renamePortfolioSchema.safeParse(value);

                if (!errors.success) {
                    setIsSubmitDisabled(true);
                    return errors;
                }

                setIsSubmitDisabled(false);
            },
        },
        onSubmit: async ({ value }) => {
            renamePortfolio(value, {
                onSuccess: ({ response }) => {
                    setIsPortfolioNameAlreadyExists(false);

                    //? Invalidate portfolio list query to fetch updated list
                    queryClient.invalidateQueries({
                        queryKey: ["portfolio-list"],
                    });

                    if (response.status === 204) {
                        toast.success(
                            translate(
                                "Portfolios.renamePortfolioModal.portfolioRenamedSuccess",
                            ),
                        );
                        setSelectedPortfolioName(value.name.toLowerCase());
                    }

                    handleClose();
                    form.reset();
                },
                onError: async (error) => {
                    const httpError = error as HTTPError;
                    if (httpError.response) {
                        const errorJson =
                            (await httpError.data) as PortfolioNameAlreadyExistsResponse;

                        const errorMessage = errorJson?.message;

                        if (errorMessage === "portfolioNameAlreadyExists") {
                            setIsPortfolioNameAlreadyExists(true);
                            setIsSubmitDisabled(true);
                        }
                    }
                },
            });
        },
        onSubmitInvalid: () => {
            toast.error(
                translate(
                    "Portfolios.renamePortfolioModal.portfolioRenameError",
                ),
            );
            setIsSubmitDisabled(true);
        },
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                setIsPortfolioNameAlreadyExists(false);
                handleClose();
                form.reset();
            }}
        >
            <DialogContent className="bg-muted-lightest border border-primary-dark font-sans">
                <DialogHeader>
                    <div className="flex flex-row items-center justify-between">
                        <DialogTitle className="font-medium text-lg leading-7 text-secondary-darker">
                            {translate("Portfolios.renamePortfolioModal.title")}
                        </DialogTitle>
                        <X
                            size={20}
                            className="cursor-pointer text-muted-dark hover:text-primary-darker transition-colors"
                            onClick={() => {
                                setIsPortfolioNameAlreadyExists(false);
                                handleClose();
                                form.reset();
                            }}
                            data-testid="close-modal-icon"
                        />
                    </div>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <form.AppField
                        name="name"
                        validators={{
                            onChange: ({ value }) => {
                                if (value === selectedPortfolioName) {
                                    setIsPortfolioNameSame(true);
                                } else {
                                    setIsPortfolioNameSame(false);
                                    setIsPortfolioNameAlreadyExists(false);
                                }
                            },
                        }}
                    >
                        {({ state: { meta }, TextInput }) => {
                            const validationError = meta.isTouched
                                ? meta.errors?.[0]?.message
                                : undefined;

                            const portfolioNameError =
                                isPortfolioNameAlreadyExists
                                    ? translate(
                                          "Portfolios.portfolioNameAlreadyExists",
                                      )
                                    : isPortfolioNameSame
                                      ? translate(
                                            "Portfolios.renamePortfolioModal.portfolioNameIsSame",
                                        )
                                      : validationError;

                            return (
                                <TextInput
                                    id="name"
                                    dataTestId="name"
                                    label={translate(
                                        "Portfolios.renamePortfolioModal.nameLabel",
                                    )}
                                    placeholder={translate(
                                        "Portfolios.renamePortfolioModal.namePlaceholder",
                                    )}
                                    error={portfolioNameError}
                                />
                            );
                        }}
                    </form.AppField>
                    <form.AppForm>
                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                        >
                            <DialogFooter className="flex flex-col justify-end mt-8">
                                <form.SubmitButton
                                    label={translate("Generic.save")}
                                    isDisabled={
                                        !form.state.canSubmit ||
                                        isSubmitDisabled
                                    }
                                    isLoading={
                                        isPending || form.state.isSubmitting
                                    }
                                />
                            </DialogFooter>
                        </form.Subscribe>
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RenamePortfolioModal;
