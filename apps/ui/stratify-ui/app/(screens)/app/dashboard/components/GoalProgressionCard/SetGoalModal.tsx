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
import { useState } from "react";
import { toast } from "sonner";
import * as zod from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSetGoal } from "./useSetGoal";
import { useTranslations } from "next-intl";

const setGoalSchema = zod.object({
    targetAmount: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);

            return !isNaN(numberValue) && numberValue > 0;
        },
        {
            error: "Target amount should be a number greater than 0",
        },
    ),
});

export interface SetGoalModalProps {
    isOpen: boolean;
    handleClose: () => void;
    currentTargetAmount?: number;
    isGoalNotFoundError?: boolean;
}

const SetGoalModal = ({
    isOpen,
    handleClose,
    currentTargetAmount,
    isGoalNotFoundError,
}: SetGoalModalProps) => {
    const translate = useTranslations("Dashboard");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const { isPending, mutate: setGoal } = useSetGoal();
    const queryClient = useQueryClient();

    const form = useAppForm({
        formId: "set-goal-form",
        defaultValues: {
            targetAmount: currentTargetAmount?.toString() ?? "",
        },
        validators: {
            onChange: setGoalSchema,
            onBlurAsync: async ({ value }) => {
                const errors = setGoalSchema.safeParse(value);

                if (!errors.success) {
                    setIsSubmitDisabled(true);
                    return errors;
                }

                setIsSubmitDisabled(false);
            },
        },
        onSubmit: async ({ value }) => {
            const requestBody = {
                targetAmount: parseFloat(value.targetAmount),
            };

            setGoal(requestBody, {
                onSuccess: () => {
                    toast.success("Goal set successfully!");

                    //? Invalidate the goal query to refetch the updated goal
                    queryClient.invalidateQueries({
                        queryKey: ["goal"],
                    });

                    handleClose();
                    form.reset();
                },
            });
        },
        onSubmitInvalid: () => {
            toast.error(
                "Goal could not be set. Please check the target amount and try again.",
            );
            setIsSubmitDisabled(true);
        },
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                handleClose();
                form.reset();
            }}
        >
            <DialogContent className="bg-muted-lightest border border-primary-dark font-sans">
                <DialogHeader>
                    <div className="flex flex-row items-center justify-between">
                        <DialogTitle className="font-medium text-lg leading-7 text-secondary-darker">
                            {translate(
                                isGoalNotFoundError
                                    ? "goalProgression.setGoalModal.setGoalTitle"
                                    : "goalProgression.setGoalModal.editGoalTitle",
                            )}
                        </DialogTitle>
                        <X
                            size={20}
                            className="cursor-pointer text-muted-dark hover:text-primary-darker transition-colors"
                            onClick={() => {
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
                    <form.AppField name="targetAmount">
                        {({ state: { meta }, TextInput }) => {
                            const validationError = meta.isTouched
                                ? meta.errors?.[0]?.message
                                : undefined;

                            return (
                                <TextInput
                                    id="targetAmount"
                                    label="Target Amount"
                                    placeholder="Enter target amount"
                                    error={validationError}
                                    dataTestId="target-amount-input"
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
                                    label={translate(
                                        isGoalNotFoundError
                                            ? "goalProgression.set"
                                            : "goalProgression.edit",
                                    )}
                                    isDisabled={
                                        !form.state.canSubmit ||
                                        isSubmitDisabled ||
                                        form.state.isSubmitting
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

export default SetGoalModal;
