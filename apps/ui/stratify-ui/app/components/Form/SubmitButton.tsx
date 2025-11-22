import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface SubmitButtonProps {
    label: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

const SubmitButton = ({
    label,
    isDisabled,
    isLoading,
    className,
}: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            variant="default"
            disabled={isDisabled}
            className={className}
        >
            <div className="flex flex-row gap-x-2 items-center">
                {isLoading && <Spinner />}
                {label}
            </div>
        </Button>
    );
};

export default SubmitButton;
