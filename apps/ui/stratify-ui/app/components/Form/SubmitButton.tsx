import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useFormContext } from "./useForm";

interface SubmitButtonProps {
    label: string;
    isDisabled?: boolean;
}

const SubmitButton = ({ label, isDisabled }: SubmitButtonProps) => {
    const form = useFormContext();

    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
            <Button
                type="submit"
                variant="default"
                disabled={isDisabled || !form.state.canSubmit}
                aria-disabled={isDisabled || !form.state.canSubmit}
            >
                <div className="flex flex-row gap-x-2 items-center">
                    {form.state.isSubmitting && <Spinner />}
                    {label}
                </div>
            </Button>
        </form.Subscribe>
    );
};

export default SubmitButton;
