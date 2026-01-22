"use client";

import { useAppForm } from "@/app/components/Form/useForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    PortfolioNameAlreadyExistsResponse,
    useCreatePortfolio,
} from "./useCreatePortfolio";
import { HTTPError } from "ky";
import * as zod from "zod";

const createPortfolioSchema = zod.object({
    name: zod.string().min(1, "Portfolio name is required"),
});

export interface CreatePortfolioModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

const CreatePortfolioModal = ({
    isOpen,
    handleClose,
}: CreatePortfolioModalProps) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isPortfolioNameAlreadyExists, setIsPortfolioNameAlreadyExists] =
        useState(false);

    const { isPending, mutate: createPortfolio } = useCreatePortfolio();

    const form = useAppForm({
        formId: "create-portfolio-form",
        defaultValues: {
            name: "",
        },
        validators: {
            onChange: createPortfolioSchema,
            onBlurAsync: async ({ value }) => {
                const errors = createPortfolioSchema.safeParse(value);

                if (!errors.success) {
                    setIsSubmitDisabled(true);
                    return errors;
                }

                setIsSubmitDisabled(false);
            },
        },
        onSubmit: async ({ value }) => {
            createPortfolio(value, {
                onSuccess: () => {
                    toast.success("Portfolio created successfully!");
                    setIsPortfolioNameAlreadyExists(false);
                    handleClose();
                    form.reset();
                },
                onError: async (error) => {
                    const httpError = error as HTTPError;
                    if (httpError.response) {
                        const errorJson: PortfolioNameAlreadyExistsResponse =
                            await httpError.response.json();

                        const errorMessage = errorJson?.data.error;

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
                "Portfolio could not be created. Please check the form for errors.",
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
                        <DialogTitle className="font-medium text-lg leading-7 text-primary-darker">
                            Create Portfolio
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
                    <DialogDescription className="text-muted-dark leading-5">
                        Add and monitor your investments by creating a
                        portfolio.
                    </DialogDescription>
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
                            onChange: () => {
                                setIsPortfolioNameAlreadyExists(false);
                            },
                        }}
                    >
                        {({ state: { meta }, TextInput }) => {
                            const validationError = meta.isTouched
                                ? meta.errors?.[0]?.message
                                : undefined;

                            const portfolioNameError =
                                isPortfolioNameAlreadyExists
                                    ? "Portfolio name already exists. Please choose a different name."
                                    : validationError;

                            return (
                                <TextInput
                                    id="name"
                                    label="Name"
                                    placeholder="Main Portfolio"
                                    error={portfolioNameError}
                                    inputClassName="border-primary-dark focus-visible:ring-primary-darker"
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
                                    label="Create"
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

export default CreatePortfolioModal;
